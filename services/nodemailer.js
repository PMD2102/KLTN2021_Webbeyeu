const nodemailer = require("nodemailer");

const {
  EMAIL_TYPE,
  EMAIL_USER,
  EMAIL_PASS,
  FRONTEND_URI,
} = require("../config/keys");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const  sendMail = async (to, subject, data, type) => {
  let htmlBody;
  switch (type) {
    case EMAIL_TYPE.VERIFY_USER:
      htmlBody = `<b><a href="${FRONTEND_URI}/verify/${data}">Click here to verify</a></b>`;
      break;
    case EMAIL_TYPE.RESET_PASS:
      htmlBody ='<p>Xin chào bạn,</p> <p>Webbeyeu vừa nhận được một yêu cầu reset mật khẩu từ bạn. Mật khẩu mới của bạn là : </p><p>' + data +
      '</p><hr><p>Cảm ơn bạn đã đăng ký trở thành một thành viên của Webbeyeu. </hr><p>Chúc bạn tham gia cộng đồng vui vẻ.</p><p>Nếu cần hỗ trợ từ Webbeyeu, vui lòng gửi email về webtretho.kltn2021@gmail.com.</p>';
      break;
    default:
      return;
  }
  const emailContent = {
    to,
    subject,
    html: htmlBody,
  };
  try {
    await transporter.sendMail(emailContent);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendMail,
};
