export function processPremuiSmartTableParameters(sqlString: string, tableParameters: TableParameters, rowCount = false): string {
  /* Add the filter parameter */
  let noAnd = false;
  if (tableParameters.search?.length > 0 && tableParameters.search?.find((x) => x.search.length > 0) && !sqlString.toLowerCase().includes('where')) {
    sqlString += ' WHERE';
    noAnd = true;
  }

  if (tableParameters.search?.length > 0) {
    for (const searchValue of tableParameters.search) {
      if (searchValue.field?.trim() != '' && searchValue.search?.length > 0) {
        if (noAnd) {
          sqlString += ' (';

          const sqlStringStack: string[] = [];
          for (const search of searchValue.search) sqlStringStack.push(`${searchValue.field} LIKE '${search}'`);

          sqlString += sqlStringStack.join(' OR ');
          sqlString += ')';
          noAnd = false;
        } else {
          sqlString += ' AND (';

          const sqlStringStack: string[] = [];
          for (const search of searchValue.search) sqlStringStack.push(`${searchValue.field} LIKE '${search}'`);

          sqlString += sqlStringStack.join(' OR ');
          sqlString += ')';
          noAnd = false;
        }
      }
    }
  }

  if (rowCount === true) return sqlString;

  /* Add the sort parameter */
  if (tableParameters?.order?.keys?.length > 0) {
    let orderString: string;
    for (const singleField of tableParameters.order.keys) {
      if (!orderString) {
        orderString = ` ORDER BY ${singleField} ${tableParameters.order.direction == 'ASC' ? 'IS NULL' : 'IS NOT NULL'}, ${singleField} ${tableParameters.order.direction}`;
      } else {
        orderString += `, ${singleField} ${tableParameters.order.direction == 'ASC' ? 'IS NULL' : 'IS NOT NULL'}, ${singleField} ${tableParameters.order.direction}`;
      }
    }

    sqlString += orderString;
  }

  /* Add the paginator parameter */
  if (tableParameters?.pagination) {
    sqlString += ` LIMIT ${(tableParameters.pagination.page - 1) * tableParameters.pagination.size}, ${tableParameters.pagination.size}`;
  }

  return sqlString;
}

export interface TableParameters {
  pagination: PagintionParameters;
  order: OrderParameters;
  search: SearchParameters[];
}

export interface PagintionParameters {
  page: number;
  size: number;
}

export interface OrderParameters {
  keys: string[];
  direction: DirectionEnum;
}

export enum DirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SearchParameters {
  field: string;
  search: string[];
}
