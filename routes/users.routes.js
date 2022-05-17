const { Router } = require('express');
const userController = require('../controllers/users.controller');

const router = Router();
const users = '/users';

router.post(users, userController.singUp);
router.get(users+'/:userId', userController.getUser);
router.get(users, userController.getUsers)

module.exports = router;