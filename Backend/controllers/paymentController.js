const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Centralized mapping so both order creation and verification use the same exact values
// *Make sure the planName strings match what your frontend expects!*
const PACKAGE_DETAILS = {
  99:  { credits: 50,  planName: 'Basic' },
  199: { credits: 120, planName: 'Starter' },
  499: { credits: 350, planName: 'Pro' } // Adjusted credits to match your earlier array, change to 1000 if needed
};

// @desc    Create a Razorpay Order
// @route   POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR

    // 1. Safety check to ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    // Check if the amount exists in our mapping
    if (!PACKAGE_DETAILS[amount]) {
      return res.status(400).json({ message: "Invalid package selected." });
    }

    // 2. Safely get the user ID
    const userId = req.user.id || req.user._id;

    const options = {
      amount: amount * 100, // Razorpay expects amount in PAISE
      currency: "INR",
      receipt: `rcpt_${userId.toString().slice(-8)}_${Date.now().toString().slice(-6)}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Something went wrong creating the order." });
  }
};

// @desc    Verify Payment, Upgrade Plan, and Log Transaction
// @route   POST /api/payment/verify-payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amountPaid } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please log in." });
    }

    // 1. Verify the Signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      const userId = req.user.id || req.user._id;
      const user = await User.findById(userId);
      
      // 2. Dynamic Upgrade Logic Based on Amount
      const packageSelected = PACKAGE_DETAILS[amountPaid];
      
      if (!packageSelected) {
        return res.status(400).json({ message: "Unknown package amount." });
      }

      const newPlan = packageSelected.planName;
      const creditsToAdd = packageSelected.credits;

      user.plan = newPlan;
      user.credits += creditsToAdd; 

      await user.save();

      // 3. Log the Transaction
      const transaction = await Transaction.create({
        user: userId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: amountPaid,
        planPurchased: newPlan,
        creditsAdded: creditsToAdd,
        status: 'Success'
      });

      // 4. --- SEND EMAIL RECEIPT ---
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const dateStr = new Date().toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        const mailOptions = {
          from: `"Omnicode AI Billing" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: `Payment Receipt: Omnicode AI ${newPlan} Plan`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 12px; background-color: #0b0f2a; color: #f8fafc;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #818cf8; margin: 0; font-size: 28px;">Omnicode AI</h1>
                <p style="color: #94a3b8; margin-top: 5px;">Payment Receipt</p>
              </div>
              
              <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                <h2 style="color: #34d399; margin-top: 0;">Payment Successful!</h2>
                <p>Hi ${user.fullName},</p>
                <p>Thank you for upgrading. Your payment has been successfully processed and your account is now on the <strong>${newPlan}</strong> plan.</p>
                
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Receipt Date:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; font-weight: bold;">${dateStr}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Transaction ID:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; font-weight: bold;">${razorpay_payment_id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94a3b8;">Plan Upgraded:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; font-weight: bold; color: #818cf8;">${newPlan}</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 0 5px 0; color: #94a3b8;">Total Amount Paid:</td>
                    <td style="padding: 15px 0 5px 0; text-align: right; font-size: 20px; font-weight: bold; color: #fff;">₹${amountPaid}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://omnicode-ai.vercel.app/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
                <p style="color: #64748b; font-size: 12px; margin-top: 20px;">If you have any questions about this receipt, simply reply to this email.</p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log("Receipt email sent successfully!");

      } catch (emailError) {
        console.error("Failed to send receipt email. Transaction was still successful.", emailError);
      }

      // 5. Send success back to React
      return res.status(200).json({ 
        message: "Payment verified successfully!", 
        newCreditBalance: user.credits,
        newPlan: user.plan
      });

    } else {
      return res.status(400).json({ message: "Invalid payment signature." });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error during verification." });
  }
};