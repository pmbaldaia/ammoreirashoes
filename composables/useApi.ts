export const useApi=()=>{const {authHeaders}=useAuth();return <T>(path:string,options:any={})=>$fetch<T>(path,{...options,headers:{...authHeaders(),...(options.headers||{})}})}
