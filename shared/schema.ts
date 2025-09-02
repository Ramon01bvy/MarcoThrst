import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionPlan: varchar("subscription_plan").default("free"),
  subscriptionStatus: varchar("subscription_status").default("inactive"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // full-body, upper-lower, strength, etc
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  duration: integer("duration"), // in minutes
  daysPerWeek: integer("days_per_week"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  muscleGroups: text("muscle_groups").array(), // ['chest', 'triceps']
  equipment: varchar("equipment"), // barbell, dumbbell, bodyweight, etc
  videoUrl: varchar("video_url"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workoutExercises = pgTable("workout_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id").references(() => workouts.id),
  exerciseId: varchar("exercise_id").references(() => exercises.id),
  dayNumber: integer("day_number").notNull(),
  sets: integer("sets"),
  reps: varchar("reps"), // can be ranges like "8-12"
  restTime: integer("rest_time"), // in seconds
  notes: text("notes"),
  orderIndex: integer("order_index").notNull(),
});

export const userWorkouts = pgTable("user_workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  workoutId: varchar("workout_id").references(() => workouts.id),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  currentDay: integer("current_day").default(1),
  isActive: boolean("is_active").default(true),
});

export const userExerciseLogs = pgTable("user_exercise_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  exerciseId: varchar("exercise_id").references(() => exercises.id),
  workoutSessionId: varchar("workout_session_id"),
  sets: integer("sets"),
  reps: integer("reps"),
  weight: real("weight"),
  notes: text("notes"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const meals = pgTable("meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // breakfast, lunch, dinner, snack
  dietType: varchar("diet_type").notNull(), // standard, vegetarian, vegan
  calories: integer("calories"),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),
  ingredients: text("ingredients").array(),
  instructions: text("instructions"),
  prepTime: integer("prep_time"), // in minutes
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  dietType: varchar("diet_type").notNull(),
  totalCalories: integer("total_calories"),
  totalProtein: real("total_protein"),
  totalCarbs: real("total_carbs"),
  totalFat: real("total_fat"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mealPlanMeals = pgTable("meal_plan_meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mealPlanId: varchar("meal_plan_id").references(() => mealPlans.id),
  mealId: varchar("meal_id").references(() => meals.id),
  dayNumber: integer("day_number").notNull(),
  mealTime: varchar("meal_time").notNull(), // breakfast, lunch, dinner, snack
  orderIndex: integer("order_index").notNull(),
});

export const userMealLogs = pgTable("user_meal_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  mealId: varchar("meal_id").references(() => meals.id),
  consumedAt: timestamp("consumed_at").defaultNow(),
  servings: real("servings").default(1),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workouts: many(userWorkouts),
  exerciseLogs: many(userExerciseLogs),
  mealLogs: many(userMealLogs),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(workoutExercises),
  userWorkouts: many(userWorkouts),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
  userLogs: many(userExerciseLogs),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const mealsRelations = relations(meals, ({ many }) => ({
  mealPlanMeals: many(mealPlanMeals),
  userLogs: many(userMealLogs),
}));

export const mealPlansRelations = relations(mealPlans, ({ many }) => ({
  meals: many(mealPlanMeals),
}));

// Zod schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  createdAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
});

export const insertUserWorkoutSchema = createInsertSchema(userWorkouts).omit({
  id: true,
  startedAt: true,
});

export const insertUserExerciseLogSchema = createInsertSchema(userExerciseLogs).omit({
  id: true,
  completedAt: true,
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
  createdAt: true,
});

export const insertUserMealLogSchema = createInsertSchema(userMealLogs).omit({
  id: true,
  consumedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type UserWorkout = typeof userWorkouts.$inferSelect;
export type UserExerciseLog = typeof userExerciseLogs.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type MealPlan = typeof mealPlans.$inferSelect;
export type MealPlanMeal = typeof mealPlanMeals.$inferSelect;
export type UserMealLog = typeof userMealLogs.$inferSelect;

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertUserWorkout = z.infer<typeof insertUserWorkoutSchema>;
export type InsertUserExerciseLog = z.infer<typeof insertUserExerciseLogSchema>;
export type InsertMeal = z.infer<typeof insertMealSchema>;
export type InsertUserMealLog = z.infer<typeof insertUserMealLogSchema>;
