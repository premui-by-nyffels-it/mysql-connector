export function parseString(value: string): string {
  return value != null && value.toString().trim().length > 0 ? `'${value.toString().replace(/'/g, "''")}'` : 'NULL';
}

export function parseNumber(value: number): number | string {
  return value != null ? value : 'NULL';
}

export function parseBoolean(value: boolean, canBeNull = false): boolean | string {
  return value === undefined || value === null ? (canBeNull ? 'NULL' : false) : value;
}

export function parseDate(date: Date, time = false): string {
	if (date == null) return 'NULL';
	return time ? `'${new Date(date).toISOString().slice(0, 19).replace('T', ' ')}'` : `'${new Date(date).toISOString().slice(0, 10)}'`;
}