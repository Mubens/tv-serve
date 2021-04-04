import type { ConnectionConfig } from 'mysql';

const env = process.env.NODE_ENV;

interface RedisConfig {
  port: number;
  host: string;
}

let MYSQL_CONF: ConnectionConfig = null;
let REDIS_CONF: RedisConfig = null;

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '0095428',
    port: 3306,
    database: 'sftv'
  };

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  };
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '0095428',
    port: 3306,
    database: 'sftv'
  };

  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  };
}

export { MYSQL_CONF, REDIS_CONF };
