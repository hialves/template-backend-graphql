import { ID } from '../../@types'
import { DeleteResult, NotFoundError } from '../graphql/types/result-type'

export interface Gql {
  __typename: string
}

export interface Crud {
  exists(id: ID): Promise<boolean>
  notFound(id: ID): NotFoundError
  delete(id: ID): Promise<DeleteResult | NotFoundError>
}
