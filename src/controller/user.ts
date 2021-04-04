import { execSql, effectSql, escape, escapeOptions } from '../db/mysql';
import encrypt from '../utils/encrypt';
import type { SignInType, RegisterOptions, HistoryPlayGets, HistoryPlaySets, User, HistoryPlay } from './user.d';

const signIn = async (options: SignInType) => {
  const { phone = undefined, email = undefined, password } = escapeOptions(options);
  const value = email != null ? email : phone;
  const key = email ? 'email' : 'phone';
  const sql = `SELECT id, name, face FROM users WHERE ${key}=${value} AND password=${encrypt(password)}`;
  console.log(`sql is: ${sql}`);

  try {
    const data = await execSql<User>(sql);
    return data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const register = async (options: RegisterOptions) => {
  const { name, password, phone = undefined, email = undefined } = escapeOptions(options);
  let key = '',
    val = '';
  if (email != null) {
    key = 'email';
    val = email;
  } else {
    key = 'phone';
    val = phone;
  }
  const sql = `INSERT INTO users (name, face, password, ${key}) VALUES (${name}, '/img/head/default.webp', ${encrypt(
    password
  )}, ${val});`;

  try {
    return (await effectSql(sql)).affectedRows > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const findUserByPhone = async (phone: string) => {
  const sql = `SELECT id FROM users WHERE phone = '${escape(phone)}';`;
  try {
    const res = await execSql(sql);
    return res.length !== 0;
  } catch (err) {
    return false;
  }
};

const findUserByEmail = async (email: string) => {
  const sql = `SELECT id FROM users WHERE email = '${escape(email)}';`;
  try {
    const res = await execSql(sql);
    return res.length !== 0;
  } catch (err) {
    return false;
  }
};

const getHistoryPlays = async ({ user_id, page = 1, limit = 10 }: HistoryPlayGets) => {
  if (!user_id) {
    return null;
  }
  const sql = `SELECT p.id, p.title, h.ep, v.title AS ep_title, v.img, h.play_time AS time, h.video_time FROM plays AS p JOIN historys AS h ON h.play_id = p.id JOIN videos AS v ON p.id = h.play_id WHERE h.ep = v.ep AND h.user_id = ${user_id} ORDER BY h.play_time DESC LIMIT ${
    (page - 1) * limit
  }, ${page * limit};`;

  try {
    const data = await execSql<HistoryPlay>(sql);
    return data.length ? data : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const setHistoryPlays = async (options: HistoryPlaySets) => {
  const { user_id, play_id, ep, play_time, video_time } = escapeOptions(options);

  const exitSql = `SELECT user_id FROM historys WHERE user_id = ${user_id} AND play_id = ${play_id};`;
  const exit = (await execSql(exitSql)).length;

  let sql = '';
  if (exit) {
    sql = `UPDATE historys SET ep = ${ep}, play_time = ${play_time}, video_time = ${video_time} WHERE user_id = ${user_id} AND play_id = ${play_id};`;
  } else {
    sql = `INSERT INTO historys (user_id, play_id, ep, play_time, video_time) VALUES(${user_id}, ${play_id}, ${ep}, ${play_time}, ${video_time});`;
  }

  try {
    return (await effectSql(sql)).affectedRows > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export { signIn, register, findUserByPhone, findUserByEmail, getHistoryPlays, setHistoryPlays };
