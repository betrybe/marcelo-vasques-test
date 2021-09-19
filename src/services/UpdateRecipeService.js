const GetErrors = require('../errors/getErrors');
const Recipe = require('../models/Recipe');

class UpdateRecipeService {
  static async execute({ name, ingredients, preparation, recipeId }) {
    const recipe = await Recipe.findOneAndUpdate({ _id: recipeId }, {
      name,
      ingredients,
      preparation,
    },
    { 
      new: true, 
    });

    if (!recipe) {
      throw new GetErrors('Recipe not found', 404);
    }

    return recipe;
  }
}

module.exports = UpdateRecipeService;