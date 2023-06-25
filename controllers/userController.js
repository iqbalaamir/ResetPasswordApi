const userService = require('../services/userService');

exports.checkEmail = async (req, res) => {
  const response = await userService.checkEmail(req.body.email);
  res.send(response);
};

exports.forgotPassword = async (req, res) => {
  const response = await userService.forgotPassword(req.body.email);
  res.send(response);
};

exports.resetPassword = async (req, res) => {
  const response = await userService.resetPassword(req.body.token, req.body.newPassword);
  res.send(response);
};
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await userService.register(email, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
