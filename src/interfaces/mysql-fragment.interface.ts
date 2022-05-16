import { DirectionEnum } from "./premui-smart-table.interface";

export interface SelectQueryFragment {
  field: string;
  alias?: string;
  database?: string;
}

export interface JoinQueryFragment {
  type?: 'CROSS JOIN' | 'INNER JOIN' | 'LEFT OUTER JOIN' | 'RIGHT OUTER JOIN';
  database: string;
  requirements: string;
}

export interface WhereQueryFragment {
  type?: 'AND' | 'OR';
  value: string;
}

export interface OrderQueryFragment {
  database?: string;
  field: string;
  direction: DirectionEnum;
}

export interface LimitQueryFragment {
  offset?: number;
  count: number;
}