// controllers/userController.js
const User = require('../models/User');
const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Handle standard text fields
    user.fullName = req.body.fullName || user.fullName;
    
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.company !== undefined) user.company = req.body.company;
    if (req.body.location !== undefined) user.location = req.body.location;
    if (req.body.githubUrl !== undefined) user.githubUrl = req.body.githubUrl;
    if (req.body.linkedinUrl !== undefined) user.linkedinUrl = req.body.linkedinUrl;
    if (req.body.portfolioUrl !== undefined) user.portfolioUrl = req.body.portfolioUrl;

    // 2. Handle Image Upload if a file is present in the request
    if (req.file) {
      // Upload the file buffer from RAM directly to ImageKit
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer, // The file buffer provided by Multer
        fileName: `profile_${user._id}_${Date.now()}`, // Unique file name
        folder: '/omnicode/profiles', // Organizes images in your ImageKit dashboard
      });

      // Save the returned URL to the database
      user.profileImage = uploadResponse.url;
    }

    // 3. Save to MongoDB
    const updatedUser = await user.save();

    // 4. Return the updated user object
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        company: updatedUser.company,
        location: updatedUser.location,
        githubUrl: updatedUser.githubUrl,
        linkedinUrl: updatedUser.linkedinUrl,
        portfolioUrl: updatedUser.portfolioUrl,
        credits: updatedUser.credits,
        plan: updatedUser.plan
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    // req.user._id is attached by the 'protect' middleware
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        company: user.company,
        location: user.location,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        credits: user.credits,
        plan: user.plan
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};