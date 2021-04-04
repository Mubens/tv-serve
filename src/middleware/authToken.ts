import Jwt from '../model/jwt';
import { ErrorModel } from '../model/resModel';

const authToken = async (ctx, next) => {
  const authorization: string = ctx.header.authorization;
  if (!authorization) {
    ctx.body = new ErrorModel('用户未登录');
    return;
  }
  const {
    token: isToken,
    data: { iat, exp, id }
  } = Jwt.verify(authorization.split('Bearer ')[1]);
  if (isToken && iat < exp) {
    ctx.request.body.user_id = id;
    await next();
  } else {
    ctx.body = new ErrorModel('身份验证过期，请重新登录');
  }
};

const userIdInject = async (ctx, next) => {
  const { id = undefined } = Jwt.verify(ctx.header.authorization && ctx.header.authorization.split('Bearer ')[1]).data;
  ctx.request.body.user_id = id;
  await next();
};

export { authToken, userIdInject };

export default authToken;
