interface CmsUser { id:string; name:string; email:string; role:string }
export const useAuth = () => {
  const token=useCookie<string|null>('am_moreira_cms_token',{sameSite:'lax',secure:process.env.NODE_ENV==='production'}); const user=useState<CmsUser|null>('cms-user',()=>null)
  const authHeaders=()=>token.value?{Authorization:`Bearer ${token.value}`}:{ }
  async function login(email:string,password:string){const result=await $fetch<{token:string;user:CmsUser}>(`/api/auth/login`,{method:'POST',body:{email,password}});token.value=result.token;user.value=result.user;return result.user}
  async function me(){if(!token.value) throw new Error('Sem sessão'); const result=await $fetch<{user:CmsUser}>(`/api/auth/me`,{headers:authHeaders()});user.value=result.user;return result.user}
  async function logout(){try{if(token.value)await $fetch(`/api/auth/logout`,{method:'POST',headers:authHeaders()})}catch{} token.value=null;user.value=null;return navigateTo('/admin/login')}
  return {token,user,login,me,logout,authHeaders}
}
