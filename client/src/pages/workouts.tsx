import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import WorkoutCard from "@/components/workout-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workout } from "@shared/schema";

export default function Workouts() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/workouts"],
    enabled: isAuthenticated,
  });

  const { data: userWorkouts, isLoading: userWorkoutsLoading } = useQuery({
    queryKey: ["/api/user/workouts"],
    enabled: isAuthenticated,
  });

  const startWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      await apiRequest("POST", "/api/user/workouts", { workoutId });
    },
    onSuccess: () => {
      toast({
        title: "Programma Gestart",
        description: "Uw nieuwe trainingsprogramma is succesvol gestart!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/workouts"] });
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
        description: "Er is een fout opgetreden bij het starten van het programma.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-accent">Laden...</div>
    </div>;
  }

  const filteredWorkouts = workouts?.filter((workout: Workout) => 
    selectedCategory === "all" || workout.category === selectedCategory
  ) || [];

  const activeWorkout = userWorkouts?.find(uw => uw.isActive);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold" data-testid="heading-workouts">
                <span className="text-gradient">Training</span> Programma's
              </h1>
              <p className="text-xl text-muted-foreground" data-testid="text-workouts-description">
                Kies uit onze exclusieve collectie van wetenschappelijk onderbouwde trainingsprogramma's
              </p>
            </div>
          </section>

          {/* Active Workout Banner */}
          {activeWorkout && (
            <section className="mb-12">
              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20" data-testid="card-active-workout">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-accent text-accent-foreground">Actief Programma</Badge>
                      </div>
                      <h3 className="text-xl font-semibold" data-testid="title-active-workout">Dag {activeWorkout.currentDay} van uw huidige programma</h3>
                      <p className="text-muted-foreground">Gestart op {new Date(activeWorkout.startedAt!).toLocaleDateString('nl-NL')}</p>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground"
                      data-testid="button-continue-active-workout"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Doorgaan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Category Tabs */}
          <section className="mb-8">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-secondary">
                <TabsTrigger value="all" data-testid="tab-all">Alle</TabsTrigger>
                <TabsTrigger value="full-body" data-testid="tab-full-body">Volledige Lichaam</TabsTrigger>
                <TabsTrigger value="upper-lower" data-testid="tab-upper-lower">Upper/Lower</TabsTrigger>
                <TabsTrigger value="strength" data-testid="tab-strength">Kracht</TabsTrigger>
                <TabsTrigger value="cutting" data-testid="tab-cutting">Cutting</TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          {/* Workouts Grid */}
          <section>
            {workoutsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} data-testid={`skeleton-workout-${i}`}>
                    <CardContent className="p-6">
                      <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredWorkouts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkouts.map((workout, index) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onStart={() => startWorkoutMutation.mutate(workout.id)}
                    isStarting={startWorkoutMutation.isPending}
                    testId={`workout-${index}`}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <i className="fas fa-dumbbell text-4xl text-muted-foreground"></i>
                    <h3 className="text-xl font-semibold" data-testid="heading-no-workouts">Geen Programma's Gevonden</h3>
                    <p className="text-muted-foreground" data-testid="text-no-workouts">
                      Geen programma's gevonden in deze categorie. Probeer een andere categorie.
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
