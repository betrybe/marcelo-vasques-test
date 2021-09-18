const { isValidObjectId } = require('mongoose');

const GetError = require('../errors/getErrors');
const Recipe = require('../models/Recipe');

async function allowRecipe(request, response, next) {
  const recipeId = request.params.id;
  const { id: userId, role } = request.user;

  const isValid = isValidObjectId(recipeId);

  if (!isValid) {
    throw new GetError('Recipe not found', 404);
  }

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new GetError('Recipe not found', 404);
  }

  const isLoggedUser = userId === recipe.userId.toString();

  if (isLoggedUser || role === 'admin') {
    next();
  } else {
    throw new GetError('User does not have permission', 401);
  }      
}

module.exports = allowRecipe;