import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'travel_app',
  password: '0911',
  port: 5432
})

export default pool