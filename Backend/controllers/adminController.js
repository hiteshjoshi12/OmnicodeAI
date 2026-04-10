// controllers/adminController.js
const User = require('../models/User');

const Settings = require('../models/Settings');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// @desc    Update user plan and credits
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const { plan, credits } = req.body;
    
    // Find the user first
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the allowed fields
    if (plan) user.plan = plan;
    if (credits !== undefined) user.credits = credits;

    const updatedUser = await user.save();

    // Remove password before sending back
    updatedUser.password = undefined;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user.' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Find the user first
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // THE ULTIMATE FAILSAFE: Prevent deletion of ANY admin account
    if (user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Action rejected. Admin accounts cannot be deleted.' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true, 
      message: 'User permanently deleted.' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
};




const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings document exists yet, create the default one
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.status(200).json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error fetching settings.' });
  }
};

// @desc    Update global platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { maintenanceMode, signupEnabled, defaultCredits } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update fields
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (signupEnabled !== undefined) settings.signupEnabled = signupEnabled;
    if (defaultCredits !== undefined) settings.defaultCredits = defaultCredits;

    await settings.save();

    res.status(200).json({ success: true, message: 'Settings updated successfully.', settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error updating settings.' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getSettings,    // <-- Add this
  updateSettings  // <-- Add this
};
