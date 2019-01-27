const express = require('express');
const checkAuth = require('../middleware/check-auth')
const UserController = require('../controllers/user')

const router = express.Router();

router.post('/signup', UserController.user_signup);
router.post('/login', UserController.user_login)
router.delete('/:userId', checkAuth, UserController.user_delete)

module.exports = router;