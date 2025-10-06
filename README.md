# What's For Dinner - Mobile App

A React Native mobile application for 14-day dinner meal planning with smart recipe assignment and flexible day-of-the-week rules. Built with Expo, Tamagui, and Supabase.

## ✨ Features

- 📆 **Create 2-week dinner meal plans** - Plan your dinners for exactly 14 days
- 🎲 **Smart recipe assignment** - Automatically assign recipes based on your preferences
- 🏷️ **Tag-based filtering** - Organize recipes with custom tags (vegetarian, quick, pasta, etc.)
- 📋 **Day-of-the-week rules** - Set persistent rules like "Mondays are always vegetarian"
- 🔄 **Easy recipe swapping** - Change any day's recipe with a single click
- 👤 **User-scoped data** - All your recipes, tags, and meal plans are private to you
- 📱 **Cross-platform** - Works on both iOS and Android
- 🔐 **Secure authentication** - Powered by Supabase Auth

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **UI Library**: Tamagui for cross-platform design system
- **Navigation**: Expo Router
- **Backend**: Supabase (Auth + Database)
- **Language**: TypeScript
- **Icons**: Lucide Icons via Tamagui

## 📊 Data Model

### Core Entities

**Users**
- Authenticated through Supabase Auth
- Own all recipes, tags, meal plans, and day rules

**Recipes**
```typescript
{
  id: number,
  userId: uuid,
  name: string,
  url?: string,           // Link to external recipe
  imageUrl?: string,      // Recipe photo
  description?: string
}
```

**Tags** (User-scoped)
```typescript
{
  id: number,
  userId: uuid,
  name: string,           // e.g., "vegetarian", "quick", "pasta"
  description?: string
}
```

**Day Rules** (Persistent weekly preferences)
```typescript
{
  id: number,
  userId: uuid,
  dayOfWeek: number,      // 1=Monday, 7=Sunday
  tagId: number           // Required tag for this day
}
```

**Meal Plans** (14-day containers)
```typescript
{
  id: number,
  userId: uuid,
  name: string,
  startDate: date,
  endDate: date,          // Always 14 days from start
  isActive: boolean
}
```

**Meal Plan Items** (Daily dinner assignments)
```typescript
{
  id: number,
  mealPlanId: number,
  date: date,
  recipeId: number
}
```

### Key Relationships

- **Recipes ↔ Tags**: Many-to-many through `recipe_tags`
- **Day Rules**: Link days of the week to required tags
- **Meal Plan Items**: Can have additional day-specific tags
- **All entities**: Scoped to authenticated users

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd what-s-for-dinner
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npx expo start
```

5. Run on your preferred platform:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## 📱 App Structure

```
app/
├── _layout.tsx          # Root layout with providers
├── +html.tsx           # Web-specific HTML head
├── +not-found.tsx      # 404 page
├── modal.tsx           # Modal screen
└── (tabs)/             # Tab navigation
    ├── _layout.tsx     # Tab layout
    ├── index.tsx       # Home/Meal Plans tab
    └── two.tsx         # Second tab
components/
├── CurrentToast.tsx    # Toast notifications
└── Provider.tsx        # App providers wrapper
```

## 🔧 Configuration

### Monorepo Setup
Note: This project is configured for monorepo usage. The following dependencies have been removed from `package.json` and should be provided by the parent monorepo:
- `react`
- `react-dom` 
- `react-native-web`

The `metro.config.js` has been modified to work within the monorepo structure.

### Tamagui Configuration
The app uses Tamagui for cross-platform UI components. Configuration is in:
- `tamagui.config.ts` - Main Tamagui configuration
- `tamagui-web.css` - Web-specific styles

## 🎨 Design System

The app uses Tamagui's design system which provides:
- Consistent spacing and sizing tokens (e.g., `$2`, `$4`)
- Theme-aware colors that adapt to light/dark mode
- Cross-platform components that work on web, iOS, and Android
- Built-in animations and interactions

## 🔗 API Integration

The mobile app connects to a separate API backend that handles:
- Recipe CRUD operations
- Tag management
- Meal plan creation and management
- Day rule configuration
- Smart recipe assignment algorithms

All API calls are authenticated using Supabase Auth tokens.

## 📦 Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

### Web
```bash
npx expo export:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## 📄 License

[Add your license information here]

## WIP 

Of course. Here is a technical design prompt for the mobile app's views and tabs. This can be handed to a UI/UX designer or a front-end developer to guide the implementation.

---

## 🎨 Technical Design Prompt: "What's For Dinner" Mobile App UI

### **Objective**

Design and develop the user interface for a 14-day meal planning application. The design must be intuitive, data-driven, and align with the specified component structure and API interactions. The primary navigation will be a three-tab system at the bottom of the screen.

### **Global Components & Style**

* **Recipe Card**: A reusable component to display a recipe preview. Must contain fields for `imageUrl`, `name`, and a list of associated `Tags` (displayed as chips or labels).
* **Floating Action Button (FAB)**: A primary action button for creating new items (Recipes, Plans).
* **Modals**: To be used for contextual actions like filtering, recipe swapping, and confirmations.

### **Core Navigation: Bottom Tab Bar**

Design a bottom tab bar with three persistent icons and labels:

1.  **Meal Plan**: (Icon suggestion: `calendar-alt`) - The default view.
2.  **Recipes**: (Icon suggestion: `book-open`) - The user's recipe library.
3.  **Settings**: (Icon suggestion: `cog`) - User preferences and rules.

---

### **View Specifications**

#### 1. Tab 1: Meal Plan View

* **Purpose**: Display the active 14-day meal plan.
* **Components**:
    * **Header**: Displays the `name` of the current `MealPlan` (e.g., "October 6 - October 19"). Can include a dropdown to switch between multiple saved plans.
    * **14-Day List**: A vertically scrollable list of "Day Items".
        * **Day Item**: A list row component displaying the `date`, `dayOfWeek`, the assigned `recipe.name`, and a small `recipe.imageUrl` thumbnail.
        * **Swap Button**: An icon button (e.g., `refresh` or `exchange-alt`) within each Day Item.
    * **FAB**: A button labeled "Generate New Plan" or similar.
* **Interactions**:
    * On load, the view must fetch and display the active meal plan.
    * Tapping the **Swap Button** must trigger a "Select a Recipe" modal, allowing the user to replace the recipe for that specific day.
    * Tapping the **FAB** should initiate the workflow for creating a new 14-day plan, likely starting with a confirmation modal.
* **API Calls**:
    * `GET /api/meal-plans?isActive=true`
    * `GET /api/meal-plan-items?mealPlanId={id}`
    * `PUT /api/meal-plan-items/{id}` (for swapping)
    * `POST /api/meal-plans` (for generation)



#### 2. Tab 2: Recipes View

* **Purpose**: Allow the user to browse, search, and manage their recipe collection.
* **Components**:
    * **Search Bar**: A text input field at the top to filter recipes by `name`.
    * **Filter Button**: An icon button that opens a modal displaying a list of the user's `Tags`. The user can select one or more tags to filter the recipe list.
    * **Recipe Grid/List**: A scrollable view displaying multiple `Recipe Card` components.
    * **FAB (+)**: A button to initiate the creation of a new recipe.
* **Interactions**:
    * Tapping a `Recipe Card` navigates the user to the `Recipe Detail View`.
    * Tapping the **FAB (+)** navigates the user to the `Add/Edit Recipe View`.
* **API Calls**:
    * `GET /api/recipes`
    * `GET /api/tags` (for the filter modal)

#### 3. Tab 3: Settings & Rules View

* **Purpose**: Provide access to application settings and user-specific rules.
* **Components**:
    * A static list of navigation links.
* **Navigation Links & Associated Sub-Views**:
    1.  **"Day of the Week Rules"**: Navigates to a view with a list of 7 days (Monday-Sunday). Each day has a dropdown selector populated by the user's `Tags`. This allows the user to enforce rules like "Mondays must have the 'vegetarian' tag". A "Save" button persists the changes.
        * **API Calls**: `GET /api/day-rules`, `POST /api/day-rules`.
    2.  **"Manage Tags"**: Navigates to a view where the user can see a list of all their created tags. This view must support adding new tags, editing existing tag names, and deleting tags.
        * **API Calls**: `GET /api/tags`, `POST /api/tags`, `PUT /api/tags/{id}`, `DELETE /api/tags/{id}`.
    3.  **"Account"**: A simple link that performs the logout action via the Supabase client.
