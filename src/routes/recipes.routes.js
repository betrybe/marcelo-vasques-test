const { Router } = require('express');
const multer = require('multer');

const RecipesController = require('../controllers/RecipesController');
const RecipeImageController = require('../controllers/RecipeImageController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const allowRecipe = require('../middlewares/allowRecipe');
const uploadImageConfig = require('../config/uploadImage');

const recipesRouter = Router();

recipesRouter.post('/', ensureAuthenticated, RecipesController.create);
recipesRouter.get('/', RecipesController.list);
recipesRouter.get('/:id', RecipesController.show);
recipesRouter.put('/:id', ensureAuthenticated, allowRecipe, RecipesController.update);
recipesRouter.delete('/:id', ensureAuthenticated, allowRecipe, RecipesController.delete);

const uploadImage = multer(uploadImageConfig);
recipesRouter.put('/:id/image', 
  ensureAuthenticated, 
  allowRecipe, 
  uploadImage.single('image'), 
  RecipeImageController.update);

module.exports = recipesRouter;