import * as mysql from 'mysql';
import { first, map, Observable } from 'rxjs';
import { MutationResult } from '../interfaces/mutate-result.interface';
import { PoolConfig } from '../interfaces/mysql-config.interface';

export class MySqlConnector {
  private _pool: mysql.Pool;

  constructor(config: PoolConfig) {
    this._pool = mysql.createPool(config);
    this.testConnection();
  }

  private testConnection(): void {
    this._pool.getConnection((error, connection) => {
      if (error) {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          console.error(new Date() + ': Database connection was closed.');
        }
        if (error.code === 'ER_CON_COUNT_ERROR') {
          console.error(new Date() + ': Database has too many connections.');
        }
        if (error.code === 'ECONNREFUSED') {
          console.error(new Date() + ': Database connection was refused.');
        }
      }
      if (connection) connection.release();
      return;
    });
  }

  public query<T>(_query: string): Observable<T[]> {
    return new Observable((observer) => {
      this._pool.query(_query, (error, results) => {
        if (error) observer.error(error.code + ': ' + error.sqlMessage);
        observer.next(results as T[]);
      });
    }).pipe(
      first(),
      map((result) => result as T[])
    );
  }

  public mutate(_query: string): Observable<MutationResult> {
    return new Observable((observer) => {
      this._pool.query(_query, (error, results) => {
        if (error) observer.error(error.sqlMessage);
        observer.next(results as MutationResult);
      });
    }).pipe(
      first(),
      map((result) => result as MutationResult)
    );
  }
}
