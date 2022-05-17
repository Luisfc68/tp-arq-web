const { Router } = require('express');
const userController = require('../controllers/users.controller');

const router = Router();
const users = '/users';

router.post(users, userController.singUp);

module.exports = router;