import SibApiV3Sdk from "sib-api-v3-sdk";

const sendMail = async (email, name, password) => {
  try {

    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];

    apiKey.apiKey = process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: "billstocks.app@gmail.com",
      name: "BillStocks",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "🎉 Welcome to BillStocks - Your Account is Ready!",

      htmlContent: `
        <div style="
          max-width:650px;
          margin:auto;
          font-family:Arial,sans-serif;
          background:#f4f7fb;
          padding:40px 20px;
        ">

          <div style="
            background:white;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 6px 18px rgba(0,0,0,0.08);
          ">

            <!-- HEADER -->
            <div style="
              background:linear-gradient(135deg,#2563eb,#1e40af);
              padding:35px;
              text-align:center;
              color:white;
            ">

              <h1 style="
                margin:0;
                font-size:32px;
              ">
                Welcome to BillStocks 🚀
              </h1>

              <p style="
                margin-top:12px;
                font-size:16px;
                opacity:0.95;
              ">
                Smart Inventory & Billing Management Platform
              </p>

            </div>

            <!-- BODY -->
            <div style="padding:40px;">

              <p style="
                font-size:17px;
                color:#333;
              ">
                Hello <strong>${name}</strong>,
              </p>

              <p style="
                font-size:15px;
                color:#555;
                line-height:1.8;
              ">
                Congratulations 🎉 Your BillStocks account has been
                successfully created and is now ready to use.
              </p>

              <div style="
                background:#f3f7ff;
                border-left:5px solid #2563eb;
                padding:20px;
                border-radius:10px;
                margin:30px 0;
              ">

                <h3 style="
                  margin-top:0;
                  color:#2563eb;
                ">
                  🔐 Login Credentials
                </h3>

                <p style="margin:8px 0;">
                  <strong>Email:</strong> ${email}
                </p>

                <p style="margin:8px 0;">
                  <strong>Password:</strong> ${password}
                </p>

              </div>

              <p style="
                font-size:15px;
                color:#555;
                line-height:1.8;
              ">
                With BillStocks, you can:
              </p>

              <ul style="
                color:#444;
                line-height:2;
                padding-left:20px;
              ">
                <li>📦 Manage Product Inventory</li>
                <li>🧾 Generate Professional Invoices</li>
                <li>💰 Track Purchases & Sales</li>
                <li>📊 Access Business Reports & Analytics</li>
                <li>⚡ Streamline Billing Operations</li>
              </ul>

              <div style="
                text-align:center;
                margin:40px 0 20px;
              ">

                <a
                  href="https://billstocks.netlify.app"
                  style="
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    padding:16px 32px;
                    border-radius:10px;
                    display:inline-block;
                    font-size:16px;
                    font-weight:bold;
                    box-shadow:0 4px 12px rgba(37,99,235,0.3);
                  "
                >
                  Open BillStocks
                </a>

              </div>

              <div style="
                background:#fff8e6;
                border:1px solid #ffe08a;
                padding:18px;
                border-radius:10px;
                margin-top:30px;
              ">

                <p style="
                  margin:0;
                  color:#8a6d3b;
                  font-size:14px;
                  line-height:1.7;
                ">
                  🔒 For security reasons, we recommend changing your password
                  after your first login and keeping your credentials confidential.
                </p>

              </div>

            </div>

            <!-- FOOTER -->
            <div style="
              background:#f9fafb;
              padding:25px;
              text-align:center;
              border-top:1px solid #e5e7eb;
            ">

              <p style="
                margin:0;
                color:#666;
                font-size:14px;
              ">
                Need help? Contact our support team anytime.
              </p>

              <p style="
                margin-top:10px;
                color:#999;
                font-size:13px;
              ">
                © 2026 BillStocks. All Rights Reserved.
              </p>

            </div>

          </div>

        </div>
      `,
    });

    console.log("EMAIL SENT:", response);

  } catch (error) {

    console.log("EMAIL ERROR:", error);

  }
};

export default sendMail;