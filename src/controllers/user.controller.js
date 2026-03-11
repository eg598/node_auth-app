const { ApiError } = require('../exeptions/api.error');
const { userService } = require('../services/user.service');
const bcrypt = require('bcrypt');

const getAllActivated = async (req, res) => {
  const users = await userService.getAllActivated();

  res.send(users.map(userService.normalize));
};

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.badRequest('Incorrect user');
  }

  if (!newPassword || !oldPassword) {
    throw ApiError.badRequest('Please provide old and new password');
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    throw ApiError.badRequest('New password is same as current');
  }

  const hashedPass = await bcrypt.hash(newPassword, 10);

  await user.update({ password: hashedPass });

  res.redirect(`${process.env.CLIENT_HOST}/profile`);
};

const changeName = async (req, res) => {
  const { email, newName } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.badRequest('Incorrect user');
  }

  if (!newName) {
    throw ApiError.badRequest('No new name entered');
  }

  if (user.name === newName) {
    throw ApiError.badRequest('New name is same as current');
  }

  await user.update({ name: newName });

  res.redirect(`${process.env.CLIENT_HOST}/profile`);
};

const changeEmail = async (req, res) => {
  const { email, newEmail } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    throw ApiError.badRequest('Incorrect user');
  }

  if (!newEmail) {
    throw ApiError.badRequest('No email entered');
  }

  if (email === newEmail) {
    throw ApiError.badRequest('New email is same as current');
  }

  await user.update({ email: newEmail });

  res.redirect(`${process.env.CLIENT_HOST}/profile`);
};

const userController = {
  getAllActivated,
  changeEmail,
  changeName,
  changePassword,
};

module.exports = { userController };
