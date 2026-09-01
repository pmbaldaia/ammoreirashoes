import { createCrudService } from '~/modules/core/repository/crud.service'
import { usersRepository } from '../repository/users.repository'
export const usersService=()=>createCrudService(usersRepository())
