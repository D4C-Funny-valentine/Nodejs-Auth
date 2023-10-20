const { AUTH_EMAIL } = process.env;
const createMailOptions = (email, subject, message, generatedOtp, duration) => {
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject,
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${subject}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              padding: 20px;
            }
            .container {
              background-color: #fff;
              border-radius: 5px;
              padding: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
            }
            p {
              color: #555;
              font-size: 16px;
            }
            .otp {
              color: tomato;
              font-size: 24px;
              letter-spacing: 2px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${subject}</h1>
            <p>${message}</p>
            <p>Your verification code is:</p>
            <p class="otp"><b>${generatedOtp}</b></p>
            <p>This code will expire in ${duration} hour(s).</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </body>
        </html>
        `,
  };
  return mailOptions;
};

module.exports = createMailOptions;
