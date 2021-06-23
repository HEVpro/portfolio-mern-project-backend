const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//-> /api/projects
router.get('/', auth, projectController.getProjects);
router.post(
  '/',
  auth,
  [check('name', "The project's name is mandatory!").not().isEmpty()],
  projectController.createProject
);

router.put(
  '/:id',
  auth,
  [check('name', "The project's name is mandatory!").not().isEmpty()],
  projectController.updateProject
);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
