const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Get all tasks
exports.getTasks = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the project
    const { project } = req.query;

    // Check if project exist
    const projectExist = await Project.findById(project);
    if (!projectExist) {
      return res.status(404).json({ msg: 'Project not found!' });
    }
    // Check the project creator
    if (projectExist.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not allowed!' });
    }
    // Get all the tasks by project
    const tasks = await Task.find({ project: project }).sort({created: -1});
    res.status(200).json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
// Create new task
exports.createTask = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the project
    const { project } = req.body;
    // Check if project exist
    const projectExist = await Project.findById(project);
    if (!projectExist) {
      return res.status(404).json({ msg: 'Project not found!' });
    }
    // Check the project creator
    if (projectExist.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not allowed!' });
    }

    // Create the task
    const task = new Task(req.body);
    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
// Update task
exports.updateTask = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the project
    const { project, name, status } = req.body;

    // Check if task exist
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "The task selected doesn't exist" });
    }
    // Get the task project
    const projectExist = await Project.findById(project);

    // Check the project creator
    if (projectExist.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not allowed!' });
    }
    // Update task
    const newTask = {};
    newTask.name = name;
    newTask.status = status;

    task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { $set: newTask },
      { new: true }
    );
    res.status(200).json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
// Delete task
exports.deleteTask = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get the project
    const { project } = req.query;
    // Check if task exist
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "The tasks selected doesn't exist" });
    }
    // Get the task project
    const projectExist = await Project.findById(project);

    // Check the project creator
    if (projectExist.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not allowed!' });
    }

    await Task.findOneAndRemove({ _id: req.params.id });
    res.status(200).json({ msg: 'Task deleted succesfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
