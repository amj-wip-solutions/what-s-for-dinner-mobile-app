/**
 * Meal Plan Utility Functions
 * Pure functions for meal plan operations
 */

import { Recipe, Tag } from '../types'

/**
 * Converts a date string to a day of week number (1=Monday, 7=Sunday)
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Day of week number (1-7)
 */
export const getDayOfWeekNumber = (dateString: string): number => {
  // Parse as local date to avoid timezone shifts
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  return dayOfWeek === 0 ? 7 : dayOfWeek // Convert Sunday from 0 to 7
}

/**
 * Filters recipes based on day tags
 * @param allRecipes - All available recipes
 * @param dayItem - Day item with tags
 * @returns Filtered recipes that match day tags
 */
export const filterRecipesByDayTags = (
  allRecipes: any[],
  dayItem: { tags?: Tag[] }
): any[] => {
  const dayTags = dayItem.tags || []
  const dayTagIds = dayTags.map(tag => tag.id)

  return allRecipes.filter(recipe => {
    const recipeTagIds = recipe.tagIds || []

    // Rule: If day has tag rules, only recipes with matching tags
    if (dayTagIds.length > 0) {
      return recipeTagIds.some(recipeTagId => dayTagIds.includes(recipeTagId))
    }

    // Rule: If day has no tag rules, accept any recipe
    return true
  })
}

/**
 * Formats a date range for display
 * @param startDate - ISO date string
 * @param endDate - ISO date string
 * @returns Formatted date range string (e.g., "Oct 20 - Nov 2")
 */
export const formatMealPlanDateRange = (startDate: string, endDate: string): string => {
  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

  // Parse as local dates to avoid timezone shifts
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number)
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number)

  const start = new Date(startYear, startMonth - 1, startDay).toLocaleDateString('en-US', formatOptions)
  const end = new Date(endYear, endMonth - 1, endDay).toLocaleDateString('en-US', formatOptions)
  return `${start} - ${end}`
}

/**
 * Formats a single date for display in meal plan items
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Monday, Oct 20")
 */
export const formatMealPlanItemDate = (dateString: string): string => {
  // Parse as local date to avoid timezone shifts
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}
