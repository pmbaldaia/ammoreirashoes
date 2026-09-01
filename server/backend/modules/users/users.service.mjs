import crypto from 'node:crypto'
import { usersRepository } from './users.repository.mjs'
import { hashPassword } from '../../core/auth.mjs'
const clean = ({ passwordHash, ...user }) => user
const normalizeEmail = (email='') => email.trim().toLowerCase()
const allowedRoles = new Set(['admin','editor','commercial'])
const normalizeRole = (role='editor') => {
  if(!allowedRoles.has(role)){ const e=new Error('Perfil inválido. Usa Administrador, Editor ou Comercial.'); e.statusCode=400; throw e }
  return role
}
export const usersService = {
  async list(){ return (await usersRepository.readAll()).map(clean) },
  async get(id){ const u=await usersRepository.findById(id); return u?clean(u):null },
  async findByEmail(email){ return (await usersRepository.readAll()).find(u=>u.email===normalizeEmail(email))||null },
  async create(payload){
    if(!payload.name?.trim() || !normalizeEmail(payload.email) || !payload.password || payload.password.length<8) { const e=new Error('Nome, email e palavra-passe (mín. 8 caracteres) são obrigatórios'); e.statusCode=400; throw e }
    if(await this.findByEmail(payload.email)){ const e=new Error('Já existe um utilizador com este email'); e.statusCode=409; throw e }
    const row=await usersRepository.create({ id:crypto.randomUUID(), name:payload.name.trim(), email:normalizeEmail(payload.email), role:normalizeRole(payload.role||'editor'), active:payload.active!==false, passwordHash:hashPassword(payload.password), createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() })
    return clean(row)
  },
  async update(id,payload){
    const current=await usersRepository.findById(id); if(!current) return null
    const patch={ name:payload.name?.trim()??current.name, email:normalizeEmail(payload.email??current.email), role:normalizeRole(payload.role??current.role), active:payload.active??current.active, updatedAt:new Date().toISOString() }
    if(payload.password) patch.passwordHash=hashPassword(payload.password)
    const row=await usersRepository.update(id,patch); return clean(row)
  },
  remove:(id)=>usersRepository.remove(id)
}
