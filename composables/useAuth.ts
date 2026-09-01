interface CmsUser { id:string; name:string; username:string; email?:string; role:string; avatar?:string }
export const useAuth = () => {
  const token=useCookie<string|null>('am_moreira_cms_token',{sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:60*60}); const user=useState<CmsUser|null>('cms-user',()=>null)
  const authHeaders=()=>token.value?{Authorization:`Bearer ${token.value}`}:{ }
  async function login(username:string,password:string){const result=await $fetch<{token:string;user:CmsUser}>(`/api/auth/login`,{method:'POST',body:{username,password}});token.value=result.token;user.value=result.user;return result.user}
  async function me(){if(!token.value) throw new Error('Sem sessão'); const result=await $fetch<{user:CmsUser}>(`/api/auth/me`,{headers:authHeaders()});user.value=result.user;return result.user}
  async function logout(){try{if(token.value)await $fetch(`/api/auth/logout`,{method:'POST',headers:authHeaders()})}catch{} token.value=null;user.value=null;return navigateTo('/admin/login')}
  async function updateProfile(payload:{name:string;avatar:string;currentPassword?:string;password?:string;confirmPassword?:string}){const result=await $fetch<{user:CmsUser}>('/api/auth/profile',{method:'PUT',headers:authHeaders(),body:payload});user.value=result.user;return result.user}
  return {token,user,login,me,logout,updateProfile,authHeaders}
}
