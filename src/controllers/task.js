const Task = require("../models/task");


exports.createTasks= async (req, res) => {
  const task =  new Task({
    ...req.body,
    owner:req.user._id
  })
  try {
    const tasks = await task.save();
    res.status(201).send(tasks);
  } catch (error) {
    res.status(400).send(error);
  }
};

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=2
// GET /tasks?sortBy=createdAt:desc
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    const limit = req.query.limit ? parseInt(req.query.limit) : 2;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      // set a default sorting if no sortBy parameter is provided
      sort.createdAt = -1;
    }
    if (!req.query.completed) {
      tasks = await Task.find().limit(limit).skip(skip).sort(sort);
    } else {
      const completed = req.query.completed === "true";
      tasks = await Task.find({ completed }).limit(limit).skip(skip).sort(sort);
    }
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getTask= async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({_id, owner:req.user._id})
    if(!task){
      res.status(404).send()
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateTask= async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const isAllowedUpdates = ["description", "completed"];
  const isValidUpdates = updates.every((update) =>
    isAllowedUpdates.includes(update)
  );
  if (!isValidUpdates) {
    return res.status(400).send({ error: "invalid updates!" });
  }
  try {
    const task = await Task.findOne({_id, owner:req.user._id})
     
    if (!task) {
      res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteTask=async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({_id, owner:req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
};