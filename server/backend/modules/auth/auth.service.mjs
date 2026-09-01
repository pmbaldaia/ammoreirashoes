import { usersService } from '../users/users.service.mjs'
import { createToken, verifyPassword } from '../../core/auth.mjs'
export const authService = {
  async login(email,password){
    const user=await usersService.findByEmail(email)
    if(!user || !user.active || !verifyPassword(password,user.passwordHash)){
      const e=new Error('Email ou palavra-passe inválidos');e.statusCode=401;throw e
    }
    if(!['admin','editor','commercial'].includes(user.role)){
      const e=new Error('Este perfil já não tem acesso ao CMS. Contacta um administrador.');e.statusCode=403;throw e
    }
    return {token:createToken(user),user:{id:user.id,name:user.name,email:user.email,role:user.role}}
  },
  async register(payload){ const user=await usersService.create({...payload,role:'editor'}); const raw=await usersService.findByEmail(user.email); return {token:createToken(raw),user} }
}
