import 'dotenv/config'
import express, { response } from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const sendMail = (req, res) => {

    const { name, email, phone, message } = req.body

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.CREDENTIAL
        }
    });

    const clientResponseEmail = {
        from: process.env.EMAIL,
        to: email,
        subject: "Request Received Successfully",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Request Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #22d3ee;
                    color: white;
                    text-align: center;
                    padding: 15px;
                    font-size: 20px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333;
                }
                .content p {
                    margin: 10px 0;
                }
                .footer {
                    background-color: #f9f9f9;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">Thank You for Reaching Out</div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>We have successfully received your request. Our team is currently reviewing it and will get in touch with you shortly.</p>
                    <p>Thank you for contacting Nuqi. We appreciate your interest.</p>
                    <p>Best regards,</p>
                    <p><strong>Team Nuqi</strong></p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Nuqi. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `
    }
    const clientDetailsEmail = {
        from: process.env.EMAIL,
        to: process.env.MYEMAIL,
        subject: `New Client Request from ${name}`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Client Request</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .header {
                    background-color: #e1c66a;
                    color: white;
                    text-align: center;
                    padding: 15px;
                    font-size: 20px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333;
                }
                .content p {
                    margin: 10px 0;
                }
                .details-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .details-table th, .details-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }
                .details-table th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                }
                .footer {
                    background-color: #f9f9f9;
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">New Client Request</div>
                <div class="content">
                    <p>Hello Team,</p>
                    <p>We have received a new request from a client. Below are the details:</p>
                    <table class="details-table">
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>${email}</td>
                        </tr>
                        <tr>
                            <td>phone</td>
                            <td>${phone}</td>
                        </tr>
                        <tr>
                            <td>message</td>
                            <td>${message}</td>
                        </tr>
                    </table>
                    <p>Best regards,</p>
                    <p>Your System</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Nuqi. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `
    }

    transporter.sendMail(clientResponseEmail, (err, info) => {
        if (err) {
            console.error("Error sending confirmation email:", err);
            return res.status(500).send({ message: 'Failed to send confirmation email' });
        } else {
            console.log("Confirmation email sent:", info.response);
            transporter.sendMail(clientDetailsEmail, (err, info) => {
                if (err) {
                    console.error("Error sending client details email:", err);
                    return res.status(500).send({ message: 'Failed to send client details email' });
                } else {
                    console.log("Client details email sent:", info.response);
                    return res.status(200).send({ message: 'Emails sent successfully' });
                }
            });
        }
    });
};

// Route to handle email sending
app.get('/', (req, res) => {
    res.send("Hello World!")
});
app.post('/mail', sendMail);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
