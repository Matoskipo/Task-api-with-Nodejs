const Task = require("../models/task");


exports.createTasks= async (req, res) => {
  // const task = new Task(req.body);
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

exports.getTasks= async(req, res) => {
  try {
    const tasks = await Task.find({'owner':req.user._id});
    console.log(tasks)
    res.status(200).send(tasks);
  } catch (error) {}
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