import { createConnection, Connection } from 'typeorm'
import { spawnSync } from 'child_process'

let connection: Connection

const getTableNames = async () =>
  (await connection.manager.query('SELECT * FROM pg_catalog.pg_tables;')).map(t => t.tablename)

beforeAll(async () => {
  connection = await createConnection()
})

afterAll(() => connection.close())

test('migrations', async () => {
  let tables = await getTableNames()
  expect(tables.includes('_migrations')).toBe(false)
  expect(tables.includes('user')).toBe(false)
  expect(tables.includes('note')).toBe(false)
  spawnSync('yarn', ['_run-migrations'])
  tables = await getTableNames()
  expect(tables.includes('_migrations')).toBe(true)
  expect(tables.includes('user')).toBe(true)
  expect(tables.includes('note')).toBe(true)
})