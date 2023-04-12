const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const users = require('../controllers/user')
const upload = require('../middleware/upload')





router.post("/users", users.registerUsers);
router.post("/users/login", users.loginUsers);
router.post("/users/logout",auth, users.logoutUsers);
router.post("/users/logoutall",auth, users.logoutAllUsers);
router.get("/users/:id",auth, users.getUsers);
router.patch("/users/me",auth, users.updateUser);
router.delete("/users/me",auth, users.deleteUser);
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  users.uploadAvatar,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete( "/users/me/avatar",auth, users.deleteAvatar);
router.get( "/users/:id/avatar", users.getAvatar);














module.exports=router