const { Router } = require('express');
const userController = require('../controllers/users.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { ROLES } = require('../utils/constants');

const router = Router();
const users = '/users';

router.post(users, userController.singUp);
router.get(users+'/:userId', authMiddleware(ROLES.CLIENT), userController.getUser);
router.get(users, authMiddleware(ROLES.CLIENT), userController.getUsers);
router.post(users+'/login', userController.login);

module.exports = router;