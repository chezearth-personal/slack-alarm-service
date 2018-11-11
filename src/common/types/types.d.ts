export interface DbConfig {
  count: number;
  env: string;
  url: string;
  dbName: string;
  serverFunctions: Array<() => Promise<any>>;
  wait?: number;
  retries?: number;
}
