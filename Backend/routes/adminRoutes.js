// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Destructure all three functions from the controller
const { getAllUsers, updateUser, deleteUser,getSettings,updateSettings } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/auth');
const { getAnalytics, seedAnalytics } = require('../controllers/analyticsController');
const { generateUserReport } = require('../controllers/reportsController');

// Apply protect and isAdmin to all routes in this file
router.use(protect, isAdmin);

// Route: GET /api/admin/users
router.get('/users', getAllUsers);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

router.get('/reports/user/:userId', generateUserReport);

router.get('/analytics', getAnalytics);
router.post('/seed-analytics', seedAnalytics);

// Route: PUT /api/admin/users/:id
router.put('/users/:id', updateUser);

// Route: DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);


module.exports = router;