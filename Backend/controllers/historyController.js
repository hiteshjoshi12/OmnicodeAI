const History = require('../models/History');

// @desc    Get logged-in user's generation history
// @route   GET /api/history
// @access  Private
const getUserHistory = async (req, res) => {
  try {
    // Find history for the logged-in user, limit to last 20, sort newest first
    const history = await History.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server error while fetching history.' });
  }
};

module.exports = { getUserHistory };