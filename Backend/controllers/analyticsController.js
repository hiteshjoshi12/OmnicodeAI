const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get Admin Analytics Dashboard Data
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // 1. REVENUE DATA (Grouped by Month for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueRaw = await Transaction.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'Success' } },
      { $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$amount" }
      }},
      { $sort: { "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = revenueRaw.map(item => ({
      name: monthNames[item._id.month - 1],
      revenue: item.revenue
    }));

    // 2. USER GROWTH DATA (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const userGrowthRaw = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { day: { $dayOfWeek: "$createdAt" } },
          users: { $sum: 1 }
      }},
      { $sort: { "_id.day": 1 } }
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const userGrowthData = userGrowthRaw.map(item => ({
      name: dayNames[item._id.day - 1],
      users: item.users
    }));

    // 3. APP USAGE DATA (Mocked for now until you build an AI Generations database model)
    const appUsageData = [
      { name: 'Code Gen', uses: 8500 },
      { name: 'Email Writer', uses: 3200 },
      { name: 'Image Studio', uses: 5100 },
    ];

    // 4. KPI TOTALS
    const totalUsers = await User.countDocuments();
    const totalRevenueResult = await Transaction.aggregate([
      { $match: { status: 'Success' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    res.status(200).json({
      revenueData,
      userGrowthData,
      appUsageData,
      kpis: {
        totalRevenue,
        totalUsers,
        totalGenerations: 16800 // Hardcoded until AI models are built
      }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Failed to fetch analytics." });
  }
};

// @desc    Seed Mock Data (Run this ONCE to fill your DB)
// @route   POST /api/admin/seed-analytics
exports.seedAnalytics = async (req, res) => {
  try {
    const users = [];
    const transactions = [];

    // Generate 50 fake users over the last 7 days
    for (let i = 0; i < 50; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));
      users.push({
        fullName: `Test User ${i}`,
        email: `test${i}@omnicode.ai`,
        password: 'hashedpassword', // Doesn't matter, just for counting
        plan: Math.random() > 0.8 ? 'Pro' : 'Free',
        createdAt: randomDate
      });
    }

    // Generate 30 fake transactions over the last 6 months
    for (let i = 0; i < 30; i++) {
      const randomDate = new Date();
      randomDate.setMonth(randomDate.getMonth() - Math.floor(Math.random() * 6));
      transactions.push({
        user: "64a7c8f9e1d2c3b4a5f6e7d8", // Fake Mongo ID
        razorpayOrderId: `order_fake_${i}`,
        razorpayPaymentId: `pay_fake_${i}`,
        amount: Math.random() > 0.5 ? 499 : 999,
        planPurchased: 'Pro',
        creditsAdded: 1000,
        status: 'Success',
        createdAt: randomDate
      });
    }

    await User.insertMany(users);
    await Transaction.insertMany(transactions);

    res.status(200).json({ message: "Mock data successfully injected into database!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed DB." });
  }
};