import { usersService } from '../users/users.service.mjs'
import { createToken, verifyPassword } from '../../core/auth.mjs'
export const authService = {
  async login(username,password){
    const user=await usersService.findByUsername(username)
    if(!user || !user.active || !verifyPassword(password,user.passwordHash)){
      const e=new Error('Utilizador ou palavra-passe inválidos');e.statusCode=401;throw e
    }
    if(!['admin','viewer','commercial'].includes(user.role)){
      const e=new Error('Este perfil já não tem acesso ao CMS. Contacta um administrador.');e.statusCode=403;throw e
    }
    return {token:createToken(user),user:{id:user.id,name:user.name,username:user.username,email:user.email||'',role:user.role,avatar:user.avatar||''}}
  },
  async register(payload){ const user=await usersService.create({...payload,role:'viewer'}); const raw=await usersService.findByUsername(user.username); return {token:createToken(raw),user} }
}
