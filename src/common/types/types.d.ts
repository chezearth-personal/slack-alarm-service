export interface DbConfig {
  url: string;
  dbName: string;
  wait?: number;
  retries?: number;
}
