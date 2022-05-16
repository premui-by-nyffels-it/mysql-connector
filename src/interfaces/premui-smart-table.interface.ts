export interface TableParameters {
  pagination: PagintionParameters;
  orders: OrderParameters[];
  filter: FilterParameters[];
}

export interface PagintionParameters {
  page: number;
  size: number;
}

export interface OrderParameters {
  database?: string;
  key: string;
  direction?: DirectionEnum;
}

export enum DirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface FilterParameters {
  database?: string;
  type?: 'STRICT' | 'SUB' | 'ORDER';
  field: string;
  value: string;
}