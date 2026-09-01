import crypto from 'node:crypto'
import { usersRepository } from './users.repository.mjs'
import { hashPassword } from '../../core/auth.mjs'
import { verifyPassword } from '../../core/auth.mjs'
const clean = ({ passwordHash, passwordResetTokenHash, passwordResetExpiresAt, ...user }) => user
const normalizeEmail = (email='') => email.trim().toLowerCase()
const normalizeUsername = (username='') => String(username).trim().toLowerCase()
const validUsername = (username) => /^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)
const allowedRoles = new Set(['admin','viewer','commercial'])
const normalizeRole = (role='viewer') => {
  if(!allowedRoles.has(role)){ const e=new Error('Perfil inválido. Usa Administrador, Viewer ou Comercial.'); e.statusCode=400; throw e }
  return role
}
export const usersService = {
  async list(){ return (await usersRepository.readAll()).map(clean) },
  async get(id){ const u=await usersRepository.findById(id); return u?clean(u):null },
  async findByEmail(email){ return (await usersRepository.readAll()).find(u=>u.email===normalizeEmail(email))||null },
  async findByUsername(username){ return (await usersRepository.readAll()).find(u=>u.username===normalizeUsername(username))||null },
  async create(payload){
    const username=normalizeUsername(payload.username), email=normalizeEmail(payload.email)
    if(!payload.name?.trim() || !validUsername(username) || !payload.password || payload.password.length<8) { const e=new Error('Nome, utilizador (3–32 caracteres) e palavra-passe (mín. 8 caracteres) são obrigatórios'); e.statusCode=400; throw e }
    if(await this.findByUsername(username)){ const e=new Error('Este nome de utilizador já existe'); e.statusCode=409; throw e }
    if(email&&await this.findByEmail(email)){ const e=new Error('Já existe um utilizador com este email'); e.statusCode=409; throw e }
    const row=await usersRepository.create({ id:crypto.randomUUID(), name:payload.name.trim(), username, email, role:normalizeRole(payload.role||'viewer'), active:payload.active!==false, passwordHash:hashPassword(payload.password), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() })
    return clean(row)
  },
  async update(id,payload){
    const current=await usersRepository.findById(id); if(!current) return null
    const username=normalizeUsername(payload.username??current.username), email=normalizeEmail(payload.email??current.email)
    if(!validUsername(username)){const e=new Error('O utilizador deve ter entre 3 e 32 caracteres e usar apenas letras, números, ponto, hífen ou underscore');e.statusCode=400;throw e}
    const usernameOwner=await this.findByUsername(username);if(usernameOwner&&usernameOwner.id!==id){const e=new Error('Este nome de utilizador já existe');e.statusCode=409;throw e}
    const emailOwner=email&&await this.findByEmail(email);if(emailOwner&&emailOwner.id!==id){const e=new Error('Já existe um utilizador com este email');e.statusCode=409;throw e}
    const patch={ name:payload.name?.trim()??current.name, username, email, role:normalizeRole(payload.role??current.role), active:payload.active??current.active, updatedAt:new Date().toISOString() }
    if(payload.password) patch.passwordHash=hashPassword(payload.password)
    const row=await usersRepository.update(id,patch); return clean(row)
  },
  async updateProfile(id,payload={}){
    const current=await usersRepository.findById(id);if(!current){const e=new Error('Utilizador não encontrado');e.statusCode=404;throw e}
    const name=String(payload.name??current.name).trim()
    if(!name){const e=new Error('O nome é obrigatório');e.statusCode=400;throw e}
    const avatar=String(payload.avatar??current.avatar??'').trim().slice(0,1000)
    const patch={name,avatar,updatedAt:new Date().toISOString()}
    if(payload.currentPassword||payload.password||payload.confirmPassword){
      if(!payload.currentPassword||!verifyPassword(String(payload.currentPassword),current.passwordHash)){const e=new Error('A palavra-passe atual não está correta');e.statusCode=400;throw e}
      if(typeof payload.password!=='string'||payload.password.length<8){const e=new Error('A nova palavra-passe deve ter pelo menos 8 caracteres');e.statusCode=400;throw e}
      if(payload.password!==payload.confirmPassword){const e=new Error('A confirmação da palavra-passe não coincide');e.statusCode=400;throw e}
      patch.passwordHash=hashPassword(payload.password)
    }
    return clean(await usersRepository.update(id,patch))
  },
  remove:(id)=>usersRepository.remove(id)
}
