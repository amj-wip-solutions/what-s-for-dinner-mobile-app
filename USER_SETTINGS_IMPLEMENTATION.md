# User Settings Implementation

## Overview
Implement user settings management to allow users to configure their meal planning preferences, specifically planner duration (7 or 14 days) and auto-plan creation behavior.

## Technical Requirements

### 1. Create Settings Service (`services/settingsService.ts`)
- **Purpose**: Handle user settings CRUD operations
- **Methods**:
  - `getSettings()`: Fetch user's current settings (creates defaults if none exist)
  - `updateSettings(settings)`: Update user's settings
- **API Integration**: 
  - `GET /api/settings`
  - `PUT /api/settings`
- **Type Safety**: Define `UserSettings` interface matching backend schema

### 2. Update Settings Screen (`app/(tabs)/settings.tsx`)
- **Add Settings Configuration Section**:
  - Planner Duration selector (7 days vs 14 days)
  - Auto-create plans toggle
  - Save functionality with loading states
- **UI Components**: Use Tamagui's Select and Switch components
- **Error Handling**: Toast notifications for save success/failure
- **Data Flow**: Load settings on mount, update on user changes

### 3. Integration Points
- **Authentication**: Leverage existing JWT token via `apiClient`
- **State Management**: Local state with React hooks
- **Navigation**: Maintain existing settings navigation structure
- **Styling**: Follow existing Tamagui design patterns

## Implementation Constraints
- Must maintain backward compatibility with existing settings navigation
- Settings changes should be persisted immediately or with explicit save action
- UI must handle loading states during API calls
- Error states must provide clear user feedback
- Default values must match backend defaults (14 days, auto-create enabled)

## Validation Rules
- Planner duration: Must be 7 or 14 days only
- Auto-create plans: Boolean toggle
- All settings are optional with fallback to defaults

## Success Criteria
- Users can view and modify their meal planning preferences
- Settings persist across app sessions
- Clear feedback for save success/failure
- Intuitive UI matching app's design language
