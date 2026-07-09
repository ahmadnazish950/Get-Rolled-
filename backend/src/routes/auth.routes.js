const express = require('express')
const { RegisterController, LoginController, MeController, LogoutController } = require('../controller/auth.controller')
const authmiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/register', RegisterController)
router.post('/login', LoginController)
router.get('/me', authmiddleware, MeController)
router.post('/logout', LogoutController)

module.exports = router