const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Generate User-Wise Report
// @route   GET /api/admin/reports/user/:userId
exports.generateUserReport = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch User Data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch all transactions for this user
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });

    // 3. Calculate Totals
    const totalSpent = transactions
      .filter(t => t.status === 'Success')
      .reduce((sum, t) => sum + t.amount, 0);

    const successfulTransactionsCount = transactions.filter(t => t.status === 'Success').length;

    // 4. Construct the Report Object
    const reportData = {
      userInfo: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        currentPlan: user.plan,
        availableCredits: user.credits,
        joinedDate: user.createdAt,
      },
      financialSummary: {
        totalSpent: totalSpent,
        totalTransactions: transactions.length,
        successfulTransactions: successfulTransactionsCount
      },
      transactionHistory: transactions.map(t => ({
        date: t.createdAt,
        amount: t.amount,
        planPurchased: t.planPurchased,
        creditsAdded: t.creditsAdded,
        status: t.status,
        paymentId: t.razorpayPaymentId || 'N/A'
      }))
    };

    res.status(200).json(reportData);

  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ message: "Failed to generate report." });
  }
};