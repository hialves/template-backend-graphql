import { ID } from '../../@types'

interface Node {
  id: ID
}

export interface PaginatedResult<T extends Node> {
  items: Array<T>
  totalItems: number
}
