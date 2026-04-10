const nodemailer = require("nodemailer");

// @desc    Handle Contact Us Form Submission
// @route   POST /api/contact
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please provide all fields." });
    }

    // Configure Nodemailer exactly like your authController
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Omnicode AI System" <${process.env.SMTP_USER}>`, // Sent from your system
      to: process.env.SMTP_USER, // Send IT TO YOURSELF so you can read it
      replyTo: email, // If you hit 'reply' in Gmail, it goes to the user
      subject: `New Contact Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
};