import nodemailer from 'nodemailer';

function emailConfiguration(): nodemailer.Transporter {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transporter;
}

export default function sendMail(userMail: string, address: string): void {
  emailConfiguration().sendMail({
    from: '"Cheguei" <noreply@cheguei.com>',
    to: userMail,
    subject: 'Cheguei - Confirm your e-mail',
    text: `Confirm your Email with the following link : ${address}`,
    html: `<p>Confirm your Email with the following link : <a href="${address}">Here</a></p>`,
  });
}
