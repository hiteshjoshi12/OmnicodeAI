const User = require("../models/User");
const Settings = require("../models/Settings"); 
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // <-- 1. Import Nodemailer

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register new user & send OTP
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // --- Global Settings Checks ---
    let settings = await Settings.findOne();
    
    // Reject if admin disabled signups
    if (settings && settings.signupEnabled === false) {
      return res.status(403).json({
        message: "New user registrations are currently disabled by the administrator.",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({
        message: "User already exists and is verified. Please log in.",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Determine initial credits from global settings (fallback to 15)
    const initialCredits = settings ? settings.defaultCredits : 15;

    if (user && !user.isVerified) {
      // If user exists but isn't verified, update their info
      user.password = password; 
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.fullName = fullName;
      user.credits = initialCredits; 
      await user.save();
    } else {
      // Create new user with dynamic credits
      user = await User.create({ 
        fullName, 
        email, 
        password, 
        otp, 
        otpExpires,
        credits: initialCredits 
      });
    }

    // --- NEW: Trigger Nodemailer ---
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT, // Usually 465 for secure, 587 for unsecure
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Omnicode AI" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Omnicode AI Verification Code",
        text: `Welcome to Omnicode AI, ${fullName}! Your verification code is: ${otp}. This code expires in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Welcome to Omnicode AI!</h2>
            <p style="color: #475569; font-size: 16px;">Hi ${fullName},</p>
            <p style="color: #475569; font-size: 16px;">Thank you for registering. Please use the verification code below to complete your sign-up process:</p>
            <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #0f172a; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #64748b; font-size: 14px;">This code is valid for the next 10 minutes.</p>
            <p style="color: #475569; font-size: 16px;">Happy coding!</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP sent successfully to ${email}`);

    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // We log the error but do not crash the registration process
    }

    res.status(200).json({ message: "OTP sent to email successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Verify OTP and log user in
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified." });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT for immediate login after verification
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Account verified successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        credits: user.credits,
        plan: user.plan,
        profileImage: user.profileImage,
        role: user.role, 
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email first." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        credits: user.credits,
        profileImage: user.profileImage,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc    Forgot Password (Generate Token & Send Email)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // We return 200 even if the user doesn't exist to prevent "email harvesting" hackers
      return res.status(200).json({ message: "If that email exists, a reset link was sent." });
    }

    // 1. Generate a secure random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash it and save it to the database (hashing prevents db admins from stealing tokens)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

    await user.save();

    // 3. Create the Reset URL (pointing to your React frontend)
    const resetUrl = `https://omnicode-ai.vercel.app/reset-password/${resetToken}`; 
    


    // 4. Send the Email via Nodemailer
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
      from: `"Omnicode AI" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Omnicode AI - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 10px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #818cf8;">Password Reset Request</h2>
          <p>You requested to reset your password for your Omnicode AI account.</p>
          <p>Click the button below to set a new password. This link is only valid for 15 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    // If it fails, clear the tokens so they can try again
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    res.status(500).json({ message: "Email could not be sent." });
  }
};

// @desc    Reset Password (Verify Token & Save New Password)
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    // 1. Re-hash the token from the URL so we can compare it to the DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Find user by token and ensure it hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } // $gt means "Greater Than" current time
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token." });
    }

    // 3. Set the new password
    user.password = req.body.password;
    
    // 4. Clear the reset tokens so they can't be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 5. Save the user (Your pre-save hook in User.js will automatically hash the new password!)
    await user.save();

    res.status(200).json({ message: "Password updated successfully! You can now log in." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
};

// @desc    Resend OTP Verification Code
// @route   POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified. Please log in." });
    }

    // 1. Generate a new 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Update user document with new OTP and Expiry (10 mins from now)
    user.otp = newOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 3. Send the Email using your existing Nodemailer setup
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
      from: `"Omnicode AI" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Omnicode AI - Your New Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #1e293b; border-radius: 10px; background-color: #0f172a; color: #f8fafc;">
          <h2 style="color: #818cf8;">Verification Code</h2>
          <p>Here is your new 6-digit verification code to activate your Omnicode AI account:</p>
          <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #34d399;">${newOtp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "A new OTP has been sent to your email." });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Failed to send new verification code. Please try again." });
  }
};