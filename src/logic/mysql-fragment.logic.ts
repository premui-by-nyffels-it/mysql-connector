import { SelectQueryFragment, JoinQueryFragment, WhereQueryFragment, OrderQueryFragment, LimitQueryFragment } from '../interfaces/mysql-fragment.interface';

export function processMySqlQueryFragments(database: string, selectQuery: SelectQueryFragment[], joinQuery: JoinQueryFragment[] = [], whereQuery: WhereQueryFragment[] = [], orderQuery: OrderQueryFragment[] = [], limitQuery: LimitQueryFragment): string {
  orderQuery = orderQuery ?? [];
  whereQuery = whereQuery ?? [];
  joinQuery = joinQuery ?? [];
  selectQuery = selectQuery ?? [{ field: '*' }];

  let finalQuery = '';

  selectQuery.forEach((query, index) => {
    finalQuery += index === 0 ? 'SELECT ' : ', ';
    if (query.database) finalQuery += `${query.database}.`;
    finalQuery += query.field;
    if (query.alias) finalQuery += ` AS ${query.alias}`;
  });

  finalQuery += ` FROM ${database}`;

  joinQuery.forEach((query) => {
    query.type = query.type ?? 'CROSS JOIN';
    finalQuery += ` ${query.type} ${query.database} ON ${query.requirements}`;
  });

  whereQuery.forEach((query, index) => {
    finalQuery += index === 0 ? ' WHERE' : ` ${query.type ?? 'AND'}`;
    finalQuery += ` ${query.value}`;
  });

  orderQuery.forEach((query, index) => {
    finalQuery += index === 0 ? ' ORDER BY ' : ', ';
    if (query.database) finalQuery += `${query.database}.`;
    finalQuery += `${query.field} ${query.direction}`;
  });

  if (limitQuery) {
    finalQuery += ` LIMIT ${limitQuery.offset ?? 0}, ${limitQuery.count}`;
  }

  return finalQuery;
}
