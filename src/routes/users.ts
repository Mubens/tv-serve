import Router from 'koa-router';
import { SuccessModel, ErrorModel } from '../model/resModel';
import {
  signIn,
  register,
  findUserByPhone,
  findUserByEmail,
  getHistoryPlays,
  setHistoryPlays
} from '../controller/user';
import Jwt from '../model/jwt';
import authToken from '../middleware/authToken';

const router = new Router();

router.prefix('/api/users');

router.post('/sign_in', async (ctx) => {
  const { phone, email, password } = ctx.request.body;

  if ((phone || email) && password) {
    const data = await signIn({ phone, email, password });

    try {
      const token = new Jwt({ id: data.id, name: data.name }, { expiresIn: '30d' }).token;

      ctx.body = new SuccessModel({ id: data.id, token }, '登录成功');
      return;
    } catch (err) {
      console.error(err);
    }
  }

  ctx.body = new ErrorModel('登录失败');
});

router.post('/register', async (ctx) => {
  const { name, password, phone = undefined, email = undefined } = ctx.request.body;

  if (name && password && (phone || email)) {
    const res = await register({ name, password, phone, email });
    ctx.body = res ? new SuccessModel('注册成功') : new ErrorModel('注册失败');
  } else {
    ctx.body = new ErrorModel('信息填写不完整');
  }
});

router.post('/auth_email', async (ctx) => {
  const { phone } = ctx.request.body;

  const res = await findUserByPhone(phone);
  ctx.body = res ? new ErrorModel('该手机号已被注册') : new SuccessModel('可使用该手机号');
});

router.post('/auth_email', async (ctx) => {
  const { email } = ctx.request.body;

  const res = await findUserByEmail(email);
  ctx.body = res ? new ErrorModel('该邮箱已被注册') : new SuccessModel('可使用该邮箱');
});

router.get('/history/:page', authToken, async (ctx) => {
  const { page = 1 } = ctx.params.page;
  const { limit = 10 } = ctx.request.query as any;
  const { user_id } = ctx.request.body;

  if (user_id) {
    const list = await getHistoryPlays({ user_id, page, limit });
    ctx.body = list ? new SuccessModel(list, '历史记录') : new ErrorModel('无记录');
  } else {
    ctx.body = new ErrorModel('未登录');
  }
});

router.post('/history', authToken, async (ctx) => {
  const { user_id, play_id, ep, play_time, video_time } = ctx.request.body;

  if (user_id) {
    const data = await setHistoryPlays({ user_id, play_id, ep, play_time, video_time });
    ctx.body = data ? new SuccessModel('添加成功') : new ErrorModel('添加失败');
  } else {
    ctx.body = new ErrorModel('未登录');
  }
});

export default router;
