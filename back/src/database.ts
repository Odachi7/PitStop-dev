import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pitstop_utf8",
  password: "Ryan.0412",
  port: 5432, 
});

export default pool;
