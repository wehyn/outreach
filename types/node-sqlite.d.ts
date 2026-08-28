declare module "node:sqlite" {
  type SQLInputValue = string | number | bigint | Uint8Array | null;

  interface StatementSync {
    all(...parameters: SQLInputValue[]): unknown[];
    get(...parameters: SQLInputValue[]): Record<string, unknown> | undefined;
    run(...parameters: SQLInputValue[]): {
      changes: number | bigint;
      lastInsertRowid: number | bigint;
    };
  }

  class DatabaseSync {
    constructor(location: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
