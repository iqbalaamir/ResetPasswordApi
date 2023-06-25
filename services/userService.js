const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

exports.checkEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: "User with this email doesn't exist." };
  }
  return { success: true };
};

exports.register = async (email, password) => {
  const user = new User({ email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) });
  await user.save();
  return { success: true, message: 'User has been registered.' };
};

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: "User with this email doesn't exist." };
  }

  // generate random token
  const token = crypto.randomBytes(20).toString('hex');

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"Reset Password"', // sender address
    to: user.email, 
    subject: 'Password reset link', 
    text: 'Please use the following link to reset your password: ' + 
          'https://astonishing-pegasus-7048b4.netlify.app/resetPassword/' + token, // plain text body
  };

  // send mail with defined transport object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return { error: 'Error occurred while sending email.' };
  }

  user.passwordResetToken = token;
  await user.save();

  return { success: true };
};

exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({ passwordResetToken: token });
  if (!user) {
    return { error: 'Invalid or expired token.' };
  }

  user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);
  user.passwordResetToken = '';
  await user.save();

  return { success: true };
};
