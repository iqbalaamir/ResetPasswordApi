const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/checkEmail', userController.checkEmail);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/register', userController.register);

module.exports = router;
