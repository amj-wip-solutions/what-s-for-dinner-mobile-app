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

/**
 * Updates an existing recipe.
 * PUT /api/recipes/:id
 * @param {number} id - Recipe ID
 * @param {object} recipeData - Updated recipe data
 */
export const updateRecipe = async (id, recipeData) => {
    try {
        const response = await apiClient.put(`/recipes/${id}`, recipeData);
        return response.data; // The updated recipe
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

/**
 * Deletes a recipe.
 * DELETE /api/recipes/:id
 * @param {number} id - Recipe ID
 */
export const deleteRecipe = async (id) => {
    try {
        const response = await apiClient.delete(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};

/**
 * Gets a single recipe by ID.
 * GET /api/recipes/:id
 * @param {number} id - Recipe ID
 */
export const getRecipe = async (id) => {
    try {
        const response = await apiClient.get(`/recipes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

// ... add other functions like updateRecipe, deleteRecipe etc.