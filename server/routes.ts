import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { createPayment, handlePaymentWebhook, SUBSCRIPTION_PLANS } from "./mollie";
import { 
  insertUserWorkoutSchema, 
  insertUserExerciseLogSchema,
  insertUserMealLogSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Workout routes
  app.get('/api/workouts', async (req, res) => {
    try {
      const workouts = await storage.getWorkouts();
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get('/api/workouts/:id', async (req, res) => {
    try {
      const workout = await storage.getWorkoutWithExercises(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  app.get('/api/exercises', async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  // User workout routes
  app.get('/api/user/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userWorkouts = await storage.getUserWorkouts(userId);
      res.json(userWorkouts);
    } catch (error) {
      console.error("Error fetching user workouts:", error);
      res.status(500).json({ message: "Failed to fetch user workouts" });
    }
  });

  app.post('/api/user/workouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workoutData = insertUserWorkoutSchema.parse({
        ...req.body,
        userId,
      });
      const userWorkout = await storage.createUserWorkout(workoutData);
      res.json(userWorkout);
    } catch (error) {
      console.error("Error creating user workout:", error);
      res.status(500).json({ message: "Failed to create user workout" });
    }
  });

  app.patch('/api/user/workouts/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.updateUserWorkout(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user workout:", error);
      res.status(500).json({ message: "Failed to update user workout" });
    }
  });

  // Exercise log routes
  app.get('/api/user/exercise-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getUserExerciseLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching exercise logs:", error);
      res.status(500).json({ message: "Failed to fetch exercise logs" });
    }
  });

  app.post('/api/user/exercise-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logData = insertUserExerciseLogSchema.parse({
        ...req.body,
        userId,
      });
      const log = await storage.createUserExerciseLog(logData);
      res.json(log);
    } catch (error) {
      console.error("Error creating exercise log:", error);
      res.status(500).json({ message: "Failed to create exercise log" });
    }
  });

  app.get('/api/user/personal-bests/:exerciseId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pb = await storage.getUserPersonalBests(userId, req.params.exerciseId);
      res.json(pb);
    } catch (error) {
      console.error("Error fetching personal best:", error);
      res.status(500).json({ message: "Failed to fetch personal best" });
    }
  });

  // Nutrition routes
  app.get('/api/meals', async (req, res) => {
    try {
      const { category, dietType } = req.query;
      let meals;
      
      if (category) {
        meals = await storage.getMealsByCategory(category as string);
      } else if (dietType) {
        meals = await storage.getMealsByDietType(dietType as string);
      } else {
        meals = await storage.getMeals();
      }
      
      res.json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.get('/api/meals/:id', async (req, res) => {
    try {
      const meal = await storage.getMeal(req.params.id);
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.json(meal);
    } catch (error) {
      console.error("Error fetching meal:", error);
      res.status(500).json({ message: "Failed to fetch meal" });
    }
  });

  app.get('/api/meal-plans', async (req, res) => {
    try {
      const mealPlans = await storage.getMealPlans();
      res.json(mealPlans);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      res.status(500).json({ message: "Failed to fetch meal plans" });
    }
  });

  // User meal log routes
  app.get('/api/user/meal-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getUserMealLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching meal logs:", error);
      res.status(500).json({ message: "Failed to fetch meal logs" });
    }
  });

  app.post('/api/user/meal-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logData = insertUserMealLogSchema.parse({
        ...req.body,
        userId,
      });
      const log = await storage.createUserMealLog(logData);
      res.json(log);
    } catch (error) {
      console.error("Error creating meal log:", error);
      res.status(500).json({ message: "Failed to create meal log" });
    }
  });

  // User stats route
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Payment routes
  app.get('/api/subscription-plans', async (req, res) => {
    res.json(SUBSCRIPTION_PLANS);
  });

  app.post('/api/create-payment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { plan } = req.body;
      
      if (!plan || !SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]) {
        return res.status(400).json({ message: "Invalid subscription plan" });
      }

      const redirectUrl = `${req.protocol}://${req.get('host')}/subscription?status=success`;
      const payment = await createPayment(userId, plan, redirectUrl);
      
      res.json({ 
        paymentUrl: payment.getCheckoutUrl(),
        paymentId: payment.id 
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.post('/api/webhooks/mollie', async (req, res) => {
    try {
      const { id: paymentId } = req.body;
      
      const subscriptionData = await handlePaymentWebhook(paymentId);
      
      if (subscriptionData) {
        await storage.updateUserSubscription(
          subscriptionData.userId,
          subscriptionData.plan,
          subscriptionData.status,
          subscriptionData.expiresAt
        );
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error handling Mollie webhook:", error);
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // Update user subscription status
  app.get('/api/user/subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json({ 
        plan: user?.subscriptionPlan || 'free',
        status: user?.subscriptionStatus || 'inactive',
        expiresAt: user?.subscriptionExpiresAt 
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
