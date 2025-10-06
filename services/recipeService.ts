// src/services/recipeService.js
import apiClient from '../lib/api';

/**
 * Fetches all recipes for the authenticated user.
 * GET /api/recipes
 */
export const getRecipes = async () => {
    try {
        const response = await apiClient.get('/recipes');
        return response.data; // The array of recipes
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

/**
 * Creates a new recipe.
 * POST /api/recipes
 * @param {object} recipeData - { name, url, description, etc. }
 */
export const createRecipe = async (recipeData) => {
    try {
        const response = await apiClient.post('/recipes', recipeData);
        return response.data; // The newly created recipe
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};

// ... add other functions like updateRecipe, deleteRecipe etc.