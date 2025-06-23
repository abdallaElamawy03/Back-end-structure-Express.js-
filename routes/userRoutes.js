//the router file for the users api 
const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const verifyjwt = require("../middleware/verifyJwt")
const loginLimiter = require('../middleware/loginLimiter')
router.use(loginLimiter)
router.use(verifyjwt)
router.route('/')
    .get(users.getallUsers)
    .post(users.createNewUser)
    .delete(users.deleteUser)
    // .patch(users.updateuser)//update method
router.route('/:id').patch(users.updateuser).get(users.getUser)

module.exports = router