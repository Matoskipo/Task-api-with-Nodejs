const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const users = require('../controllers/user')

router.post("/users", users.registerUsers);
router.post("/users/login", users.loginUsers);
router.post("/users/logout",auth, users.logoutUsers);
router.post("/users/logoutall",auth, users.logoutAllUsers);
router.get("/users/:id",auth, users.getUsers);
router.patch("/users/me",auth, users.updateUser);
router.delete("/users/me",auth, users.deleteUser);












module.exports=router