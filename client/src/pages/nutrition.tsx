import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import NutritionCard from "@/components/nutrition-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Meal } from "@shared/schema";

export default function Nutrition() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDietType, setSelectedDietType] = useState("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: meals, isLoading: mealsLoading } = useQuery({
    queryKey: ["/api/meals", selectedCategory !== "all" ? `?category=${selectedCategory}` : selectedDietType !== "all" ? `?dietType=${selectedDietType}` : ""],
    enabled: isAuthenticated,
  });

  const { data: mealPlans, isLoading: mealPlansLoading } = useQuery({
    queryKey: ["/api/meal-plans"],
    enabled: isAuthenticated,
  });

  const { data: userMealLogs, isLoading: mealLogsLoading } = useQuery({
    queryKey: ["/api/user/meal-logs"],
    enabled: isAuthenticated,
  });

  const logMealMutation = useMutation({
    mutationFn: async ({ mealId, servings }: { mealId: string; servings: number }) => {
      await apiRequest("POST", "/api/user/meal-logs", { mealId, servings });
    },
    onSuccess: () => {
      toast({
        title: "Maaltijd Gelogd",
        description: "Uw maaltijd is succesvol toegevoegd aan uw dagboek!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/meal-logs"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het loggen van de maaltijd.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-accent">Laden...</div>
    </div>;
  }

  const todayMealLogs = userMealLogs?.filter(log => 
    new Date(log.consumedAt!).toDateString() === new Date().toDateString()
  ) || [];

  const todayCalories = todayMealLogs.reduce((total, log) => {
    const meal = meals?.find((m: Meal) => m.id === log.mealId);
    return total + (meal?.calories || 0) * (log.servings || 1);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold" data-testid="heading-nutrition">
                <span className="text-gradient">Voeding</span> & Maaltijden
              </h1>
              <p className="text-xl text-muted-foreground" data-testid="text-nutrition-description">
                Ontdek onze exclusieve voedingsbibliotheek met meer dan 200 gezonde en heerlijke maaltijden
              </p>
            </div>
          </section>

          {/* Today's Nutrition Summary */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20" data-testid="card-daily-nutrition">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" data-testid="title-daily-nutrition">
                  <i className="fas fa-calendar-day text-accent"></i>
                  <span>Vandaag's Voeding</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1" data-testid="stat-daily-calories">
                      {mealLogsLoading ? "..." : Math.round(todayCalories)}
                    </div>
                    <div className="text-sm text-muted-foreground">Calorieën</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1" data-testid="stat-daily-meals">
                      {mealLogsLoading ? "..." : todayMealLogs.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Maaltijden</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1" data-testid="stat-daily-protein">
                      {mealLogsLoading ? "..." : "85g"}
                    </div>
                    <div className="text-sm text-muted-foreground">Proteïne</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1" data-testid="stat-daily-water">
                      2.1L
                    </div>
                    <div className="text-sm text-muted-foreground">Water</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Category and Diet Type Filters */}
          <section className="mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" data-testid="heading-meal-categories">Maaltijd Categorieën</h3>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-secondary">
                    <TabsTrigger value="all" data-testid="tab-category-all">Alle</TabsTrigger>
                    <TabsTrigger value="breakfast" data-testid="tab-category-breakfast">Ontbijt</TabsTrigger>
                    <TabsTrigger value="lunch" data-testid="tab-category-lunch">Lunch</TabsTrigger>
                    <TabsTrigger value="dinner" data-testid="tab-category-dinner">Diner</TabsTrigger>
                    <TabsTrigger value="snack" data-testid="tab-category-snack">Snacks</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4" data-testid="heading-diet-types">Dieet Types</h3>
                <Tabs value={selectedDietType} onValueChange={setSelectedDietType} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-secondary">
                    <TabsTrigger value="all" data-testid="tab-diet-all">Alle</TabsTrigger>
                    <TabsTrigger value="standard" data-testid="tab-diet-standard">Standaard</TabsTrigger>
                    <TabsTrigger value="vegetarian" data-testid="tab-diet-vegetarian">Vegetarisch</TabsTrigger>
                    <TabsTrigger value="vegan" data-testid="tab-diet-vegan">Vegan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </section>

          {/* Meals Grid */}
          <section>
            {mealsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} data-testid={`skeleton-meal-${i}`}>
                    <CardContent className="p-6">
                      <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : meals && meals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal: Meal, index: number) => (
                  <NutritionCard
                    key={meal.id}
                    meal={meal}
                    onLog={(servings) => logMealMutation.mutate({ mealId: meal.id, servings })}
                    isLogging={logMealMutation.isPending}
                    testId={`meal-${index}`}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <i className="fas fa-utensils text-4xl text-muted-foreground"></i>
                    <h3 className="text-xl font-semibold" data-testid="heading-no-meals">Geen Maaltijden Gevonden</h3>
                    <p className="text-muted-foreground" data-testid="text-no-meals">
                      Geen maaltijden gevonden in deze categorie. Probeer een andere filter.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
