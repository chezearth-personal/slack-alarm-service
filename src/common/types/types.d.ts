export interface DbConfig  extends DbConnect {
  count: number;
  env: string;
  serverFunctions: Array<() => Promise<any>>;
  retries?: number;
}

export interface DbConnect {
  url: string;
  dbName: string;
  wait?: number;
}
