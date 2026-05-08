import SibApiV3Sdk from "sib-api-v3-sdk";

const sendMail = async (email, name) => {
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
      subject: "Welcome to BillStocks 🚀",

      htmlContent: `
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
            ">
              Welcome to BillStocks 🚀
            </h1>

            <p>
              Hello <strong>${name}</strong>,
            </p>

            <p>
              Your account has been successfully created.
            </p>

            <p>
              You can now manage inventory, invoices,
              reports and billing.
            </p>

            <div style="
              margin-top:30px;
              text-align:center;
            ">
              <a
                href="https://billstocks.netlify.app"
                style="
                  background:#2563eb;
                  color:white;
                  padding:12px 24px;
                  text-decoration:none;
                  border-radius:8px;
                "
              >
                Open BillStocks
              </a>
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