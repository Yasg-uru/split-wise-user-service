import nodemailer from "nodemailer";

const Transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,

  service: "yashpawar12122004@gmail.com",
  auth: {
    user: "yashpawar12122004@gmail.com",

    pass: "nwxb yuwl uioz dzkc",
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    text: `You are receiving this email because you (or someone else) have requested a password reset for your account.\n\n
           Please click on the following link, or paste it into your browser to complete the process:\n\n
           ${resetUrl}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };
  await Transporter.sendMail(mailOptions);
};
