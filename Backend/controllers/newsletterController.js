const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(200).json({ message: "Successfully subscribed!" });

  } catch (error) {
    // MongoDB duplicate key error code is 11000
    if (error.code === 11000) {
      return res.status(400).json({ message: "You are already subscribed!" });
    }
    console.error("Newsletter Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};