import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_APP_PASS
    }
});

const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log("Mail server is ready");
    } catch (error) {
        console.error(`Error setting up mail server : ${error}`);
        process.exit(1);
    }
};

export { transporter, verifyTransporter };