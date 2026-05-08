import nodemailer from "nodemailer";

const sendMail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to BillStocks 🚀",
      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h1>Welcome ${name}</h1>
          <p>Your account has been created successfully.</p>
          <p>Thanks for using BillStocks 🚀</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("EMAIL SENT:", info.response);

  } catch (error) {
    console.log("EMAIL ERROR:", error);
  }
};

export default sendMail;