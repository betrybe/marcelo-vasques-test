const { isValidObjectId } = require('mongoose');

const GetErrors = require('../errors/getErrors');
const Recipe = require('../models/Recipe');

class ShowRecipeService {
  static async execute(recipeId) {
    const isValid = isValidObjectId(recipeId);

    if (!isValid) {
      throw new GetErrors('recipe not found', 404);
    }

    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      throw new GetErrors('recipe not found', 404);
    }

    return recipe;
  }
}

module.exports = ShowRecipeService;