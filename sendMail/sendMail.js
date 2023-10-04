import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let sendMail = (email, product, quality) => {
  console.log(process.env.USER, process.env.PASS);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "teammedonor@gmail.com",
      pass: process.env.PASS,
    },
  });

  let mailOptions = {
    from: {
      name: "Team Medonor",
      address: "teammedonor@gmail.com",
    },
    to: ["apoorvavpendse@gmail.com"],
    subject: "Donation of medical equipment",
    html: `
        <h1>New Product Registered for donation</h1>
        <h4>Owner email:${email}</h4>
        <h4>Product Name:${product}</h4>
        <h4>Product Quality:${quality}</h4>


        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("mail sent:", info.response);
    }
  });
};
export default sendMail;
