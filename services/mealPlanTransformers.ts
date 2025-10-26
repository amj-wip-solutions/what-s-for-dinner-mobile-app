/**
 * Meal Plan Data Transformers
 * Handles transformation of API data to UI format
 */

import { dayRuleService } from './dayRuleService'
import { tagService } from './tagService'
import { getRecipes } from './recipeService'
import { getDayOfWeekNumber, formatMealPlanItemDate } from '../utils/mealPlanUtils'

export interface TransformedMealPlanItem {
  id: number
  date: string
  dayOfWeek: string
  recipe: any | null
  tags: any[]
}

/**
 * Transforms a single meal plan item with its associated data
 * @param item - Raw meal plan item from API
 * @param allRecipes - All available recipes (to avoid fetching per item)
 * @param dayRules - All day rules
 * @param allTags - All tags
 * @returns Transformed meal plan item
 */
export const transformMealPlanItem = async (
  item: any,
  allRecipes: any[],
  dayRules: any[],
  allTags: any[]
): Promise<TransformedMealPlanItem> => {
  const dayOfWeek = formatMealPlanItemDate(item.date)

  // Get the recipe if one is assigned
  let recipe = null
  if (item.recipeId) {
    recipe = allRecipes.find(r => r.id === item.recipeId) || null
  }

  // Get day rules to show tags
  const dayOfWeekNumber = getDayOfWeekNumber(item.date)
  const dayRule = dayRules.find(rule => rule.dayOfWeek === dayOfWeekNumber)
  const tags = dayRule ? allTags.filter(t => t.id === dayRule.tagId) : []

  return {
    id: item.id,
    date: item.date,
    dayOfWeek,
    recipe,
    tags
  }
}

/**
 * Transforms multiple meal plan items efficiently
 * Fetches shared data once instead of per-item
 * @param items - Array of raw meal plan items
 * @returns Array of transformed meal plan items
 */
export const transformMealPlanItems = async (
  items: any[]
): Promise<TransformedMealPlanItem[]> => {
  // Fetch shared data once for all items
  const [allRecipes, dayRules, allTags] = await Promise.all([
    getRecipes(),
    dayRuleService.getAll(),
    tagService.getAll()
  ])

  // Transform all items
  return Promise.all(
    items.map(item => transformMealPlanItem(item, allRecipes, dayRules, allTags))
  )
}

/**
 * Transforms auto-setup items from backend response
 * @param autoSetupItems - Items from auto-setup API response
 * @returns Array of transformed meal plan items
 */
export const transformAutoSetupItems = async (
  autoSetupItems: any[]
): Promise<TransformedMealPlanItem[]> => {
  // Fetch day rules and tags once
  const [dayRules, allTags] = await Promise.all([
    dayRuleService.getAll(),
    tagService.getAll()
  ])

  // Transform all items
  return Promise.all(
    autoSetupItems.map(async (item) => {
      const dayOfWeek = formatMealPlanItemDate(item.date)

      const recipe = item.recipeId ? {
        id: item.recipeId,
        name: item.recipeName,
        url: item.recipeUrl,
        imageUrl: item.recipeImageUrl
      } : null

      // Get day rules to show tags
      const dayOfWeekNumber = getDayOfWeekNumber(item.date)
      const dayRule = dayRules.find(rule => rule.dayOfWeek === dayOfWeekNumber)
      const tags = dayRule ? allTags.filter(t => t.id === dayRule.tagId) : []

      return {
        id: item.id,
        date: item.date,
        dayOfWeek,
        recipe,
        tags
      }
    })
  )
}

