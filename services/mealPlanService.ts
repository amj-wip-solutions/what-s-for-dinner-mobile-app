import apiClient from '../lib/api';

export interface MealPlan {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanItem {
  id: number;
  mealPlanId: number;
  date: string;
  recipeId: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches all meal plans for the authenticated user.
 * GET /api/meal-plans
 */
export const getMealPlans = async (): Promise<MealPlan[]> => {
  try {
    const response = await apiClient.get('/meal-plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
};

/**
 * Creates a new meal plan.
 * POST /api/meal-plans
 * @param mealPlanData - { name, startDate, duration? }
 */
export const createMealPlan = async (mealPlanData: {
  name: string;
  startDate: string;
  duration?: number;
}): Promise<MealPlan> => {
  try {
    const response = await apiClient.post('/meal-plans', mealPlanData);
    return response.data;
  } catch (error) {
    console.error('Error creating meal plan:', error);
    throw error;
  }
};

/**
 * Gets a single meal plan by ID with its items.
 * GET /api/meal-plans/:id
 */
export const getMealPlan = async (id: number): Promise<MealPlan> => {
  try {
    const response = await apiClient.get(`/meal-plans/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
};

/**
 * Updates a meal plan item with a recipe.
 * PUT /api/meal-plan-items/:itemId
 */
export const updateMealPlanItem = async (itemId: number, data: {
  recipeId?: number | null;
}): Promise<MealPlanItem> => {
  try {
    const response = await apiClient.put(`/meal-plan-items/${itemId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating meal plan item:', error);
    throw error;
  }
};

/**
 * Gets meal plan items for a specific meal plan.
 * GET /api/meal-plan-items?mealPlanId=X
 */
export const getMealPlanItems = async (mealPlanId: number): Promise<MealPlanItem[]> => {
  try {
    const response = await apiClient.get(`/meal-plan-items?mealPlanId=${mealPlanId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meal plan items:', error);
    throw error;
  }
};

/**
 * Creates a single meal plan item.
 * POST /api/meal-plan-items
 */
export const createMealPlanItem = async (data: {
  mealPlanId: number;
  date: string;
  recipeId?: number | null;
}): Promise<MealPlanItem> => {
  try {
    const response = await apiClient.post('/meal-plan-items', data);
    return response.data;
  } catch (error) {
    console.error('Error creating meal plan item:', error);
    throw error;
  }
};

/**
 * Creates multiple meal plan items at once.
 * POST /api/meal-plan-items (with array payload)
 */
export const createMealPlanItems = async (items: Array<{
  mealPlanId: number;
  date: string;
  recipeId?: number | null;
}>): Promise<MealPlanItem[]> => {
  try {
    const response = await apiClient.post('/meal-plan-items', items);
    return response.data;
  } catch (error) {
    console.error('Error creating meal plan items:', error);
    throw error;
  }
};
