import * as nodemailer from 'nodemailer';

export const sendMail = async () => {
  // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com', // 第三方邮箱的主机地址
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: '876809592@qq.com', // 发送方邮箱的账号
      pass: 'wlmztowclouybebc', // 邮箱授权密码
    },
  });

  // 定义transport对象并发送邮件
  const info = await transporter.sendMail({
    from: '876809592@qq.com', // 发送方邮箱的账号
    to: '18256485741@163.com', // 邮箱接受者的账号
    subject: 'Hello Dooring', // Subject line
    text: 'H5-Dooring?', // 文本内容
    html: `<div id="mailContentContainer" class="qmbox qm_con_body_content qqmail_webmail_only" style="opacity: 1;"><div style="padding: 0 40px;border: 1px solid #ccc; width: 600px;"></div>
    <div style="
      height: 70px; 
      line-height: 70px; 
      border-bottom: 1px dashed #ccc; 
      color: #5867dd;
      font-weight: 800;
      font-size: 20px;
      text-align: center;">
      SuperAPI
    </div>
    <div style="padding: 28px 0; color: #888;">
      <h1 style="color: #888;">
        尊敬的 <span style="color:#5867dd; margin:0 1px;"><a href="mailto:876809592@qq.com" rel="noopener" target="_blank">876809592@qq.com</a></span>， 您好！
      </h1>
      <p>请确认本邮件是否是你需要的。</p>
      <p>请点击下面的地址，根据提示进行邮箱激活：</p>
      <a href="http://localhost:8000/user/signup/876809592@qq.com/a38e49fb-e676-4c7c-abbc-1fa67d157b26" target="_blank" style="text-decoration: none;
      display: inline-block;
      padding: 8px 25px;
      background: #5867dd;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;" rel="noopener">点击完成邮箱验证</a>
      <p>如果单击链接没有反应，请复制下面链接到浏览器窗口中，或直接输入链接。</p>
      <p><a href="http://localhost:8000/user/signup/876809592@qq.com/a38e49fb-e676-4c7c-abbc-1fa67d157b26" rel="noopener" target="_blank">http://localhost:8000/user/signup/876809592@qq.com/a38e49fb-e676-4c7c-abbc-1fa67d157b26</a></p>
      <p>如您未提交该申请，请不要理会此邮件，对此为您带来的不便深表歉意。</p>
      <div style="text-align: right;margin-top: 50px;">
        <span>QuickAPI</span>
        <div style="margin-top: 4px;"><span style="border-bottom:1px dashed #ccc;" t="5" times="">2020-06-06</span></div>
      </div>
    </div>
  <style type="text/css">.qmbox style, .qmbox script, .qmbox head, .qmbox link, .qmbox meta {display: none !important;}</style></div>`, // html 内容, 如果设置了html内容, 将忽略text内容
  });

  console.log(info);

  return info;
};
