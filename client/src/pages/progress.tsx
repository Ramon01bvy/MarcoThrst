import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import ProgressChart from "@/components/progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Progress() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedExercise, setSelectedExercise] = useState("all");

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

  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    enabled: isAuthenticated,
  });

  const { data: exerciseLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/user/exercise-logs"],
    enabled: isAuthenticated,
  });

  const { data: mealLogs, isLoading: mealLogsLoading } = useQuery({
    queryKey: ["/api/user/meal-logs"],
    enabled: isAuthenticated,
  });

  const { data: exercises, isLoading: exercisesLoading } = useQuery({
    queryKey: ["/api/exercises"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-accent">Laden...</div>
    </div>;
  }

  // Process data for charts
  const processExerciseData = () => {
    if (!exerciseLogs) return [];
    
    const filteredLogs = selectedExercise === "all" 
      ? exerciseLogs 
      : exerciseLogs.filter(log => log.exerciseId === selectedExercise);
    
    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentLogs = filteredLogs.filter(log => 
      new Date(log.completedAt!) >= cutoffDate
    );
    
    // Group by date and calculate max weight/volume
    const groupedData = recentLogs.reduce((acc, log) => {
      const date = new Date(log.completedAt!).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, weight: 0, reps: 0, volume: 0 };
      }
      
      const weight = log.weight || 0;
      const reps = log.reps || 0;
      const volume = weight * reps * (log.sets || 1);
      
      acc[date].weight = Math.max(acc[date].weight, weight);
      acc[date].reps = Math.max(acc[date].reps, reps);
      acc[date].volume += volume;
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const processNutritionData = () => {
    if (!mealLogs) return [];
    
    const days = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentLogs = mealLogs.filter(log => 
      new Date(log.consumedAt!) >= cutoffDate
    );
    
    // Group by date and sum calories (this is simplified - would need meal data for accurate calories)
    const groupedData = recentLogs.reduce((acc, log) => {
      const date = new Date(log.consumedAt!).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, calories: 0 };
      }
      
      // Estimate calories per meal (would need to join with meals table for accurate data)
      acc[date].calories += 400 * (log.servings || 1);
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const exerciseData = processExerciseData();
  const nutritionData = processNutritionData();

  // Calculate personal bests
  const getPersonalBests = () => {
    if (!exerciseLogs) return [];
    
    const bestsByExercise = exerciseLogs.reduce((acc, log) => {
      const exerciseId = log.exerciseId;
      const weight = log.weight || 0;
      
      if (!acc[exerciseId] || weight > acc[exerciseId].weight) {
        acc[exerciseId] = {
          exerciseId,
          weight,
          reps: log.reps || 0,
          date: log.completedAt!,
        };
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(bestsByExercise).slice(0, 5);
  };

  const personalBests = getPersonalBests();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold" data-testid="heading-progress">
                Uw <span className="text-gradient">Voortgang</span>
              </h1>
              <p className="text-xl text-muted-foreground" data-testid="text-progress-description">
                Volg uw transformatie en behaal nieuwe persoonlijke records
              </p>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-hover" data-testid="card-stat-total-workouts">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-total-workouts">
                    {statsLoading ? "..." : userStats?.totalWorkouts || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Totaal Workouts</div>
                </CardContent>
              </Card>
              
              <Card className="card-hover" data-testid="card-stat-exercise-logs">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-exercise-logs">
                    {statsLoading ? "..." : userStats?.totalExerciseLogs || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Oefeningen</div>
                </CardContent>
              </Card>
              
              <Card className="card-hover" data-testid="card-stat-streak">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-streak">
                    {statsLoading ? "..." : userStats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Dag Streak</div>
                </CardContent>
              </Card>
              
              <Card className="card-hover" data-testid="card-stat-total-calories">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-total-calories">
                    {statsLoading ? "..." : Math.round(userStats?.totalCaloriesLogged || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Calorieën</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Personal Bests */}
          <section className="mb-12">
            <Card data-testid="card-personal-bests">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" data-testid="heading-personal-bests">
                  <i className="fas fa-trophy text-accent"></i>
                  <span>Persoonlijke Records</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {personalBests.length > 0 ? (
                  <div className="space-y-3">
                    {personalBests.map((pb, index) => (
                      <div key={pb.exerciseId} className="flex justify-between items-center p-3 bg-secondary rounded-lg" data-testid={`personal-best-${index}`}>
                        <div className="space-y-1">
                          <div className="font-medium" data-testid={`pb-exercise-${index}`}>
                            Oefening #{pb.exerciseId.slice(-4)}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`pb-date-${index}`}>
                            {new Date(pb.date).toLocaleDateString('nl-NL')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-accent text-lg" data-testid={`pb-weight-${index}`}>
                            {pb.weight}kg
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`pb-reps-${index}`}>
                            {pb.reps} reps
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground" data-testid="no-personal-bests">
                    <i className="fas fa-trophy text-4xl mb-4"></i>
                    <p>Nog geen persoonlijke records</p>
                    <p className="text-sm">Start met trainen om uw eerste PR's te behalen!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Charts */}
          <section>
            <Tabs defaultValue="training" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="training" data-testid="tab-training">Training Voortgang</TabsTrigger>
                <TabsTrigger value="nutrition" data-testid="tab-nutrition">Voeding Voortgang</TabsTrigger>
              </TabsList>
              
              <TabsContent value="training" className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-full sm:w-48" data-testid="select-period">
                      <SelectValue placeholder="Selecteer periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Afgelopen week</SelectItem>
                      <SelectItem value="30">Afgelopen maand</SelectItem>
                      <SelectItem value="90">Afgelopen 3 maanden</SelectItem>
                      <SelectItem value="365">Afgelopen jaar</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                    <SelectTrigger className="w-full sm:w-48" data-testid="select-exercise">
                      <SelectValue placeholder="Selecteer oefening" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle oefeningen</SelectItem>
                      {exercisesLoading ? (
                        <SelectItem value="loading" disabled>Laden...</SelectItem>
                      ) : exercises?.slice(0, 10).map((exercise: any) => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Training Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card data-testid="card-weight-chart">
                    <CardHeader>
                      <CardTitle data-testid="heading-weight-chart">Gewicht Progressie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProgressChart
                        data={exerciseData}
                        type="weight"
                        title="Max Gewicht"
                        color="#D4AF37"
                        testId="weight-progress"
                      />
                    </CardContent>
                  </Card>
                  
                  <Card data-testid="card-volume-chart">
                    <CardHeader>
                      <CardTitle data-testid="heading-volume-chart">Volume Progressie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProgressChart
                        data={exerciseData}
                        type="volume"
                        title="Totaal Volume"
                        color="#22C55E"
                        testId="volume-progress"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="space-y-6">
                <Card data-testid="card-nutrition-chart">
                  <CardHeader>
                    <CardTitle data-testid="heading-nutrition-chart">Dagelijkse Calorieën</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressChart
                      data={nutritionData}
                      type="calories"
                      title="Calorieën"
                      color="#3B82F6"
                      testId="nutrition-progress"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
}
