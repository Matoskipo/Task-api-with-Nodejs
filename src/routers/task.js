const express = require('express')
const router = new express.Router()
const Task = require("../models/task");
const tasks = require("../controllers/task")
const auth = require("../middleware/auth")

router.post("/tasks",auth, tasks.createTasks);
router.get("/tasks",auth, tasks.getTasks);
router.get("/tasks/:id", auth, tasks.getTask);
router.patch("/tasks/:id",auth, tasks.updateTask);
router.delete("/tasks/:id", auth, tasks.deleteTask);





module.exports = router