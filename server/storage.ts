import {
  users,
  workouts,
  exercises,
  workoutExercises,
  userWorkouts,
  userExerciseLogs,
  meals,
  mealPlans,
  mealPlanMeals,
  userMealLogs,
  type User,
  type UpsertUser,
  type Workout,
  type Exercise,
  type WorkoutExercise,
  type UserWorkout,
  type UserExerciseLog,
  type Meal,
  type MealPlan,
  type UserMealLog,
  type InsertWorkout,
  type InsertExercise,
  type InsertUserWorkout,
  type InsertUserExerciseLog,
  type InsertMeal,
  type InsertUserMealLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Workout operations
  getWorkouts(): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  getWorkoutWithExercises(id: string): Promise<(Workout & { exercises: (WorkoutExercise & { exercise: Exercise })[] }) | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  
  // Exercise operations
  getExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // User workout operations
  getUserWorkouts(userId: string): Promise<UserWorkout[]>;
  createUserWorkout(userWorkout: InsertUserWorkout): Promise<UserWorkout>;
  updateUserWorkout(id: string, updates: Partial<UserWorkout>): Promise<void>;
  
  // Exercise log operations
  getUserExerciseLogs(userId: string, limit?: number): Promise<UserExerciseLog[]>;
  createUserExerciseLog(log: InsertUserExerciseLog): Promise<UserExerciseLog>;
  getUserPersonalBests(userId: string, exerciseId: string): Promise<{ weight: number; reps: number; date: Date } | undefined>;
  
  // Nutrition operations
  getMeals(): Promise<Meal[]>;
  getMealsByCategory(category: string): Promise<Meal[]>;
  getMealsByDietType(dietType: string): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  
  getMealPlans(): Promise<MealPlan[]>;
  getMealPlan(id: string): Promise<MealPlan | undefined>;
  
  getUserMealLogs(userId: string, limit?: number): Promise<UserMealLog[]>;
  createUserMealLog(log: InsertUserMealLog): Promise<UserMealLog>;
  
  // Analytics
  getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalExerciseLogs: number;
    currentStreak: number;
    totalCaloriesLogged: number;
  }>;

  // Subscription operations
  updateUserSubscription(userId: string, plan: string, status: string, expiresAt: Date): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workout operations
  async getWorkouts(): Promise<Workout[]> {
    return await db.select().from(workouts);
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }

  async getWorkoutWithExercises(id: string): Promise<(Workout & { exercises: (WorkoutExercise & { exercise: Exercise })[] }) | undefined> {
    const workout = await this.getWorkout(id);
    if (!workout) return undefined;

    const workoutExercisesList = await db
      .select()
      .from(workoutExercises)
      .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
      .where(eq(workoutExercises.workoutId, id))
      .orderBy(workoutExercises.dayNumber, workoutExercises.orderIndex);

    return {
      ...workout,
      exercises: workoutExercisesList.map(row => ({
        ...row.workout_exercises,
        exercise: row.exercises,
      })),
    };
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [newWorkout] = await db.insert(workouts).values(workout).returning();
    return newWorkout;
  }

  // Exercise operations
  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }

  // User workout operations
  async getUserWorkouts(userId: string): Promise<UserWorkout[]> {
    return await db
      .select()
      .from(userWorkouts)
      .where(eq(userWorkouts.userId, userId))
      .orderBy(desc(userWorkouts.startedAt));
  }

  async createUserWorkout(userWorkout: InsertUserWorkout): Promise<UserWorkout> {
    const [newUserWorkout] = await db.insert(userWorkouts).values(userWorkout).returning();
    return newUserWorkout;
  }

  async updateUserWorkout(id: string, updates: Partial<UserWorkout>): Promise<void> {
    await db.update(userWorkouts).set(updates).where(eq(userWorkouts.id, id));
  }

  // Exercise log operations
  async getUserExerciseLogs(userId: string, limit: number = 50): Promise<UserExerciseLog[]> {
    return await db
      .select()
      .from(userExerciseLogs)
      .where(eq(userExerciseLogs.userId, userId))
      .orderBy(desc(userExerciseLogs.completedAt))
      .limit(limit);
  }

  async createUserExerciseLog(log: InsertUserExerciseLog): Promise<UserExerciseLog> {
    const [newLog] = await db.insert(userExerciseLogs).values(log).returning();
    return newLog;
  }

  async getUserPersonalBests(userId: string, exerciseId: string): Promise<{ weight: number; reps: number; date: Date } | undefined> {
    const [result] = await db
      .select({
        weight: userExerciseLogs.weight,
        reps: userExerciseLogs.reps,
        date: userExerciseLogs.completedAt,
      })
      .from(userExerciseLogs)
      .where(and(
        eq(userExerciseLogs.userId, userId),
        eq(userExerciseLogs.exerciseId, exerciseId)
      ))
      .orderBy(desc(userExerciseLogs.weight))
      .limit(1);

    return result ? { weight: result.weight!, reps: result.reps!, date: result.date! } : undefined;
  }

  // Nutrition operations
  async getMeals(): Promise<Meal[]> {
    return await db.select().from(meals);
  }

  async getMealsByCategory(category: string): Promise<Meal[]> {
    return await db.select().from(meals).where(eq(meals.category, category));
  }

  async getMealsByDietType(dietType: string): Promise<Meal[]> {
    return await db.select().from(meals).where(eq(meals.dietType, dietType));
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    const [meal] = await db.select().from(meals).where(eq(meals.id, id));
    return meal;
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const [newMeal] = await db.insert(meals).values(meal).returning();
    return newMeal;
  }

  async getMealPlans(): Promise<MealPlan[]> {
    return await db.select().from(mealPlans);
  }

  async getMealPlan(id: string): Promise<MealPlan | undefined> {
    const [mealPlan] = await db.select().from(mealPlans).where(eq(mealPlans.id, id));
    return mealPlan;
  }

  async getUserMealLogs(userId: string, limit: number = 50): Promise<UserMealLog[]> {
    return await db
      .select()
      .from(userMealLogs)
      .where(eq(userMealLogs.userId, userId))
      .orderBy(desc(userMealLogs.consumedAt))
      .limit(limit);
  }

  async createUserMealLog(log: InsertUserMealLog): Promise<UserMealLog> {
    const [newLog] = await db.insert(userMealLogs).values(log).returning();
    return newLog;
  }

  // Analytics
  async getUserStats(userId: string): Promise<{
    totalWorkouts: number;
    totalExerciseLogs: number;
    currentStreak: number;
    totalCaloriesLogged: number;
  }> {
    const [workoutCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userWorkouts)
      .where(eq(userWorkouts.userId, userId));

    const [exerciseLogCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userExerciseLogs)
      .where(eq(userExerciseLogs.userId, userId));

    // Simple streak calculation - days with at least one exercise log
    const [streakResult] = await db
      .select({ 
        streak: sql<number>`count(distinct date(${userExerciseLogs.completedAt}))` 
      })
      .from(userExerciseLogs)
      .where(and(
        eq(userExerciseLogs.userId, userId),
        sql`${userExerciseLogs.completedAt} >= current_date - interval '30 days'`
      ));

    // Calculate total calories from meal logs
    const mealLogsWithCalories = await db
      .select({
        totalCalories: sql<number>`sum(${meals.calories} * ${userMealLogs.servings})`,
      })
      .from(userMealLogs)
      .innerJoin(meals, eq(userMealLogs.mealId, meals.id))
      .where(eq(userMealLogs.userId, userId));

    return {
      totalWorkouts: workoutCount.count || 0,
      totalExerciseLogs: exerciseLogCount.count || 0,
      currentStreak: streakResult.streak || 0,
      totalCaloriesLogged: mealLogsWithCalories[0]?.totalCalories || 0,
    };
  }

  // Subscription operations
  async updateUserSubscription(userId: string, plan: string, status: string, expiresAt: Date): Promise<void> {
    await db
      .update(users)
      .set({
        subscriptionPlan: plan,
        subscriptionStatus: status,
        subscriptionExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
