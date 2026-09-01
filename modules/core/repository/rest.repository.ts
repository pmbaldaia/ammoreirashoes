export interface CrudRepository<T extends { id?: string | number }> { list():Promise<T[]>;create(payload:Partial<T>):Promise<T>;update(id:string|number,payload:Partial<T>):Promise<T>;remove(id:string|number):Promise<void> }
export const createRestRepository=<T extends {id?:string|number}>(resource:string):CrudRepository<T>=>{
 const api=useApi();const base=`/api/${resource}`
 return {list:()=>api<T[]>(base),create:(payload)=>api<T>(base,{method:'POST',body:payload}),update:(id,payload)=>api<T>(`${base}/${id}`,{method:'PUT',body:payload}),remove:(id)=>api<void>(`${base}/${id}`,{method:'DELETE'})}
}
