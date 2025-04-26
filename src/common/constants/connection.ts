export const connection: Connection = {
  CONNECTION_STRING: 'postgresql://myuser:mypassword@localhost:5432/mydatabase',
  DB: 'PostgreSQL',
  DBNAME: 'mydatabase',
}

export type Connection = {
  CONNECTION_STRING: string
  DB: string
  DBNAME: string
}
