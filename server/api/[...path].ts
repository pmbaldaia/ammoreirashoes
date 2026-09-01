import { getMongoDb } from '../backend/core/mongo.mjs'
import { usersService } from '../backend/modules/users/users.service.mjs'
import { authService } from '../backend/modules/auth/auth.service.mjs'
import { mediaService } from '../backend/modules/media/media.service.mjs'
import { verifyToken } from '../backend/core/auth.mjs'
import { amServices, audit } from '../backend/core/am-moreira.service.mjs'

const publicResources = new Set(['pages','contentBlocks','products','categories','collections','events','gallery','menus','settings'])
const fail=(statusCode:number,message:string)=>{throw createError({statusCode,statusMessage:message,message})}
const currentUser=(event:any)=>{const value=getHeader(event,'authorization')||'';return verifyToken(value.startsWith('Bearer ')?value.slice(7):'')}
const requireAuth=(event:any)=>{const user=currentUser(event);if(!user)fail(401,'Sessão inválida ou expirada');return user}
const requireAdmin=(user:any)=>{if(user.role!=='admin')fail(403,'Apenas administradores podem executar esta ação')}
const canEdit=(user:any,resource:string)=>user.role==='admin'||user.role==='editor'||(user.role==='commercial'&&resource==='contacts')
const cleanText=(value:any,max=5000)=>String(value??'').replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi,'').trim().slice(0,max)
const contactHits=new Map<string,{count:number,at:number}>()

export default defineEventHandler(async(event)=>{
  const path=(getRouterParam(event,'path')||'').split('/').filter(Boolean); const method=event.method
  if(path[0]==='health'&&method==='GET'){const db=await getMongoDb();await db.command({ping:1});return {ok:true,database:'mongodb',application:'am-moreira'}}
  if(path[0]==='auth'&&path[1]==='login'&&method==='POST'){const p=await readBody(event);const result=await authService.login(p.email,p.password);await audit(result.user,'login','auth',result.user.id);return result}
  if(path[0]==='auth'&&path[1]==='register')fail(403,'O registo público está desativado.')
  if(path[0]==='auth'&&path[1]==='me'&&method==='GET')return {user:requireAuth(event)}
  if(path[0]==='auth'&&path[1]==='logout'&&method==='POST'){const user=requireAuth(event);await audit(user,'logout','auth',user.id);return {ok:true}}
  if(path[0]==='public'&&path[1]==='contact'&&method==='POST'){
    const ip=getRequestIP(event,{xForwardedFor:true})||'unknown', now=Date.now(), hit=contactHits.get(ip)
    if(hit&&now-hit.at<60000&&hit.count>=5)fail(429,'Demasiados pedidos. Tenta novamente dentro de um minuto.')
    contactHits.set(ip,{count:hit&&now-hit.at<60000?hit.count+1:1,at:now})
    const p=await readBody(event);if(!cleanText(p.name,120)||!/^\S+@\S+\.\S+$/.test(cleanText(p.email,180))||!cleanText(p.message,5000))fail(400,'Nome, email válido e mensagem são obrigatórios.')
    setResponseStatus(event,201);return amServices.contacts.create({name:cleanText(p.name,120),email:cleanText(p.email,180),phone:cleanText(p.phone,40),company:cleanText(p.company,160),subject:cleanText(p.subject,180),message:cleanText(p.message,5000),productId:cleanText(p.productId,80),collectionId:cleanText(p.collectionId,80),origin:'website',status:'new',notes:''})
  }
  if(path[0]==='media'){
    const user=requireAuth(event)
    if(method==='GET'&&!path[1])return mediaService.list('')
    if(method==='POST'&&!path[1]){if(!canEdit(user,'media'))fail(403,'Sem permissão');const row=await mediaService.upload(await readBody(event),'');await audit(user,'create','media',row?.id);setResponseStatus(event,201);return row}
    if(method==='DELETE'&&path[1]){requireAdmin(user);if(await mediaService.remove(decodeURIComponent(path[1]))){await audit(user,'delete','media',path[1]);setResponseStatus(event,204);return null}fail(404,'Ficheiro não encontrado')}
  }
  const isPublic=path[0]==='public', resource=isPublic?path[1]:path[0], id=isPublic?path[2]:path[1]
  if(resource==='users'){
    const user=requireAuth(event);requireAdmin(user)
    if(method==='GET'&&!id)return usersService.list();if(method==='POST'){const row=await usersService.create(await readBody(event));await audit(user,'create','users',row.id);return row}
    if(method==='PUT'&&id){const row=await usersService.update(id,await readBody(event));await audit(user,'update','users',id);return row}
    if(method==='DELETE'&&id){await usersService.remove(id);await audit(user,'delete','users',id);setResponseStatus(event,204);return null}
  }
  const service=amServices[resource];if(!service||(isPublic&&!publicResources.has(resource)))fail(404,'Recurso não encontrado')
  if(isPublic){if(method!=='GET')fail(405,'Método não permitido');if(id){const row=await service.get(id);if(!row)fail(404,'Registo não encontrado');return row}return service.listPublic()}
  const user=requireAuth(event);if(method==='GET'&&!id)return service.list();if(method==='GET'&&id)return service.get(id)
  if(!canEdit(user,resource))fail(403,'Sem permissão para gerir este conteúdo')
  if(method==='POST'){const row=await service.create(await readBody(event));await audit(user,'create',resource,row.id);setResponseStatus(event,201);return row}
  if(['PUT','PATCH'].includes(method)&&id){const row=await service.update(id,await readBody(event));await audit(user,'update',resource,id);return row}
  if(method==='DELETE'&&id){requireAdmin(user);await service.remove(id);await audit(user,'delete',resource,id);setResponseStatus(event,204);return null}
  fail(405,'Método não permitido')
})
