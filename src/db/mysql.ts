import mysql, { OkPacket } from 'mysql';

import { MYSQL_CONF } from '../conf/db';

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF);

// 开始连接
con.connect();

// 执行 sql
const execSql = <T>(sql: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const effectSql = (sql: string): Promise<OkPacket> => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const escape = mysql.escape;

const escapeOptions = <T extends object>(options: T) => {
  const data = {};
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      data[key as string] = escape(options[key]);
    }
  }
  return data as Record<keyof T, string>;
};

export { execSql, effectSql, escape, escapeOptions };
