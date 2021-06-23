const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Create new project
    const project = new Project(req.body);

    // Save the project checked first by JWT
    project.creator = req.user.id;

    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
// Get all the projects of the user logged
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user.id }).sort({
      created: -1,
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
// Update project
exports.updateProject = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Get project info
  const { name } = req.body;
  const newProject = {};
  if (name) {
    newProject.name = name;
  }
  try {
    // Check if exist the project
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found!' });
    }

    // Check the project creator
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not allowed!' });
    }
    // Update
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );
    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
// Delete project
exports.deleteProject = async (req, res) => {
  // Check if there are errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Get project info
  const { name } = req.body;
  const newProject = {};
  if (name) {
    newProject.name = name;
  }
  try {
    // Check if exist the project
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found!' });
    }

    // Check the project creator
    if (project.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not allowed!' });
    }
    // Delte
    project = await Project.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: 'Project deleted succesfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).send('There are an error!');
  }
};
