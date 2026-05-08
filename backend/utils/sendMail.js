import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (email, name) => {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to BillStocks 🚀",
      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h1>Welcome ${name}</h1>
          <p>Your account has been created successfully.</p>
          <p>Thanks for joining BillStocks 🚀</p>
        </div>
      `,
    });

    console.log("EMAIL SENT:", data);
  } catch (error) {
    console.log("EMAIL ERROR:", error);
  }
};

export default sendMail;