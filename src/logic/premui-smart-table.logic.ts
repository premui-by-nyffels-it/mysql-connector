import { WhereQueryFragment, OrderQueryFragment, LimitQueryFragment } from "../interfaces/mysql-fragment.interface";
import { DirectionEnum, TableParameters } from "../interfaces/premui-smart-table.interface";
import { parseString } from "./parser.logic";

export function convertPremuiSmartTableParametersToQueryFragments(tableParameters: TableParameters, filter = true, sort = true, pagination = true): { whereQuery: WhereQueryFragment[]; orderQuery: OrderQueryFragment[]; limitQuery: LimitQueryFragment } {
  const whereQuery: WhereQueryFragment[] = [];
  const orderQuery: OrderQueryFragment[] = [];
  let limitQuery: LimitQueryFragment = null;

  if (!tableParameters) {
    return {
      whereQuery,
      orderQuery,
      limitQuery,
    };
  }

  if (filter) {
    tableParameters.filter?.forEach((filterValue) => {
      filterValue.type = filterValue.type ?? 'SUB';

      let whereQueryValue = '';
      if (filterValue.database) whereQueryValue += `${filterValue.database}.`;

      switch (filterValue.type) {
        case 'SUB':
          whereQueryValue += `${filterValue.field} LIKE ${parseString('%' + filterValue.value + '%')}`;
          break;
        case 'ORDER':
          whereQueryValue += `${filterValue.field} LIKE ${parseString('%' + filterValue.value.split('').join('%') + '%')}`;
          break;
        case 'STRICT':
          whereQueryValue += `${filterValue.field} = ${parseString(filterValue.value)}`;
          break;
      }

      whereQuery.push({
        value: whereQueryValue,
      });
    });
  }

  if (sort) {
    tableParameters.orders?.forEach((order) => {
      orderQuery.push({
        database: order.database,
        direction: order.direction ?? DirectionEnum.ASC,
        field: order.key,
      });
    });
  }

  if (pagination && tableParameters.pagination) {
    limitQuery = {
      count: tableParameters.pagination.size,
      offset: (tableParameters.pagination.page - 1) * tableParameters.pagination.size,
    };
  }

  return {
    whereQuery,
    orderQuery,
    limitQuery,
  };
}
