const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword
} = require('../controllers/auth');

const router = express.Router()

const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, authorize('publisher', 'admin'), getMe);
router.post('/forgotpassword', forgotPassword);

module.exports = router;