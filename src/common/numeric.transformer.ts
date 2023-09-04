export class ColumnFloatTransformer {
  to(data: number): number {
    return data
  }
  from(data: string): number {
    return parseFloat(data)
  }
}
