const { userService } = require('../services/user.service');

const getAllActivated = async (req, res) => {
  const users = await userService.getAllActivated();

  res.send(users.map(userService.normalize));
};

const userController = {
  getAllActivated,
};

module.exports = { userController };
