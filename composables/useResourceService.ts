export const useResourceService = (resource: string) => {
  const api = useApi()
  return {
    list: () => api(`/api/${resource}`),
    create: (payload:any) => api(`/api/${resource}`, { method: 'POST', body: payload }),
    update: (id:string|number,payload:any) => api(`/api/${resource}/${id}`, { method: 'PUT', body: payload }),
    remove: (id:string|number) => api(`/api/${resource}/${id}`, { method: 'DELETE' }),
  }
}
