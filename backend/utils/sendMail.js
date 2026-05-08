import nodemailer from "nodemailer";

const sendMail = async (email, name) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `BillStocks <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to BillStocks 🚀",
      html: `
        <div style="
          max-width:600px;
          margin:auto;
          font-family:Arial,sans-serif;
          background:#f4f7fb;
          padding:40px 20px;
        ">

          <div style="
            background:white;
            border-radius:12px;
            padding:40px;
            box-shadow:0 4px 12px rgba(0,0,0,0.08);
          ">

            <h1 style="
              color:#2563eb;
              text-align:center;
              margin-bottom:20px;
            ">
              Welcome to BillStocks 🚀
            </h1>

            <p style="
              font-size:16px;
              color:#333;
            ">
              Hello <strong>${name}</strong>,
            </p>

            <p style="
              font-size:15px;
              color:#555;
              line-height:1.7;
            ">
              Your account has been successfully created on
              <strong>BillStocks</strong>.
            </p>

            <p style="
              font-size:15px;
              color:#555;
              line-height:1.7;
            ">
              You can now manage:
            </p>

            <ul style="
              color:#444;
              line-height:1.8;
              padding-left:20px;
            ">
              <li>📦 Product Inventory</li>
              <li>🧾 Invoices & Billing</li>
              <li>💰 Purchase Records</li>
              <li>📊 Reports & Analytics</li>
            </ul>

            <div style="text-align:center;margin-top:35px;">
              <a
                href="https://billstocks.netlify.app"
                style="
                  background:#2563eb;
                  color:white;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:8px;
                  display:inline-block;
                  font-weight:bold;
                "
              >
                Open BillStocks
              </a>
            </div>

            <hr style="
              border:none;
              border-top:1px solid #e5e7eb;
              margin:30px 0;
            ">

            <p style="
              text-align:center;
              color:#888;
              font-size:13px;
            ">
              © 2026 BillStocks. All rights reserved.
            </p>

          </div>
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