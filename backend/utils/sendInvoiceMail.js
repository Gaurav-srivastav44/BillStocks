import SibApiV3Sdk from "sib-api-v3-sdk";

const sendInvoiceMail = async (customerEmail, customerName, invoiceNumber, pdfBuffer) => {
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
        email: customerEmail,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: `Invoice #${invoiceNumber} from BillStocks`,
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

            <div style="
              background:linear-gradient(135deg,#2563eb,#1e40af);
              padding:30px;
              text-align:center;
              color:white;
            ">

              <h1 style="margin:0;">
                BillStocks Invoice
              </h1>

            </div>

            <div style="padding:40px;">

              <p>Hello <strong>${customerName}</strong>,</p>

              <p>
                Thank you for your purchase.
              </p>

              <p>
                Your invoice <strong>#${invoiceNumber}</strong>
                has been attached with this email.
              </p>

              <p>
                Please keep this invoice for your records.
              </p>

              <div style="
                margin-top:30px;
                padding:20px;
                background:#f3f7ff;
                border-left:5px solid #2563eb;
                border-radius:10px;
              ">

                <p style="margin:0;">
                  Invoice Attached
                </p>

              </div>

            </div>

            <div style="
              background:#f9fafb;
              padding:20px;
              text-align:center;
              border-top:1px solid #e5e7eb;
            ">

              <p style="margin:0;color:#777;">
                (c) 2026 BillStocks
              </p>

            </div>

          </div>

        </div>
      `,
      attachment: [
        {
          content: pdfBuffer.toString("base64"),
          name: `Invoice-${invoiceNumber}.pdf`,
        },
      ],
    });

    console.log("INVOICE EMAIL SENT");
  } catch (error) {
    console.log("INVOICE EMAIL ERROR:", error);
  }
};

export default sendInvoiceMail;