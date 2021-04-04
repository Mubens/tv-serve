import crypto from 'crypto';

// 密钥
const SECRET_KEY = 'Mr_Zhu-My#Project%@QQ1321219448%';

// md5 加密
const md5 = (content: string) => {
  const hash = crypto.createHash('md5');
  return hash.update(content).digest('hex');
};

// 加密
const encrypt = (plaintext: string) => {
  return md5(`passward=${plaintext}&key=${SECRET_KEY}`);
};

export default encrypt;
