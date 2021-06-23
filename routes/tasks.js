const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//-> /api/tasks
// Get all tasks
router.get(
  '/',
  auth,
  taskController.getTasks
);
// Create task
router.post(
  '/',
  auth,
  [check('name', 'The task name is mandatory!').not().isEmpty()],
  [check('project', 'The project is mandatory!').not().isEmpty()],
  taskController.createTask
);
// update task
router.put(
  '/:id',
  auth,
  taskController.updateTask
);
// delete task
router.delete(
  '/:id',
  auth,
  [check('project', 'The project is mandatory!').not().isEmpty()],
  taskController.deleteTask
);

module.exports = router;
