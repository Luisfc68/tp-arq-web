const { Router } = require('express');
const userController = require('../controllers/users.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = Router();
const users = '/users';

router.post(users, userController.singUp);
router.get(users+'/:userId', authMiddleware, userController.getUser);
router.get(users, authMiddleware, userController.getUsers);
router.post(users+'/login', userController.login);

module.exports = router;