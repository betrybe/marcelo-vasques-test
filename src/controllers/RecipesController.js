const Joi = require('joi');
const GetErrors = require('../errors/getErrors');
const CreateRecipeService = require('../services/CreateRecipeService');
const ListRecipesService = require('../services/ListRecipeService');
const ShowRecipeService = require('../services/ShowRecipeService');
const UpdateRecipeService = require('../services/UpdateRecipeService');
const DeleteRecipeService = require('../services/DeleteRecipeService');

class RecipesController {
  static async create(request, response) {
    const userId = request.user.id;
    const { name, ingredients, preparation } = request.body;
    
    const schema = Joi.object({
      name: Joi.string().required(),
      ingredients: Joi.string().required(),
      preparation: Joi.string().required(),
    });

    const { error } = schema.validate({ name, ingredients, preparation });

    if (error) {
      throw new GetErrors('Invalid entries. Try again.');
    }   
    const recipe = await CreateRecipeService.execute({ name, ingredients, preparation, userId });
    return response.status(201).json({ recipe });
  }

  static async list(request, response) {
      const recipes = await ListRecipesService.execute();
      return response.json(recipes);
    }

  static async show(request, response) {
    const recipeId = request.params.id;
      const recipe = await ShowRecipeService.execute(recipeId);

      return response.json(recipe);
  }

  static async update(request, response) {
    const recipeId = request.params.id;
    const { name, ingredients, preparation } = request.body;
    
      const recipe = await UpdateRecipeService.execute(
        { name, ingredients, preparation, recipeId },
      );
      return response.json(recipe);
  }

  static async delete(request, response) {
    const recipeId = request.params.id;
    
    await DeleteRecipeService.execute(recipeId);
    return response.status(204).send();
  }
}

module.exports = RecipesController;