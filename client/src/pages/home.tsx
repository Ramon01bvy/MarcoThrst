import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: userWorkouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/user/workouts"],
    enabled: isAuthenticated,
  });

  const { data: recentLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/user/exercise-logs"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-accent">Laden...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <section className="mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold" data-testid="heading-welcome">
                Welkom terug, <span className="text-gradient">{user?.firstName || 'Sporter'}</span>
              </h1>
              <p className="text-xl text-muted-foreground" data-testid="text-welcome-message">
                Klaar om uw grenzen te verleggen en uw potentieel te ontgrendelen?
              </p>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-hover" data-testid="card-stat-workouts">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-total-workouts">
                    {statsLoading ? "..." : userStats?.totalWorkouts || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Totaal Workouts</div>
                </CardContent>
              </Card>
              
              <Card className="card-hover" data-testid="card-stat-exercises">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-total-exercises">
                    {statsLoading ? "..." : userStats?.totalExerciseLogs || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Oefeningen Gelogd</div>
                </CardContent>
              </Card>
              
              <Card className="card-hover" data-testid="card-stat-streak">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-current-streak">
                    {statsLoading ? "..." : userStats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Dag Streak</div>
                </CardContent>
              </Card>
              
              <Card className="card-hover" data-testid="card-stat-calories">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2" data-testid="stat-total-calories">
                    {statsLoading ? "..." : Math.round(userStats?.totalCaloriesLogged || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Calorieën Gelogd</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Active Workouts */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" data-testid="heading-active-workouts">Actieve Programma's</h2>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/workouts'}
                data-testid="button-view-all-workouts"
              >
                Bekijk Alles
              </Button>
            </div>
            
            {workoutsLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">Laden...</div>
                </CardContent>
              </Card>
            ) : userWorkouts && userWorkouts.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-6">
                {userWorkouts.slice(0, 2).map((workout, index) => (
                  <Card key={workout.id} className="card-hover" data-testid={`card-active-workout-${index}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle data-testid={`title-active-workout-${index}`}>Schema Dag {workout.currentDay}</CardTitle>
                        <Badge variant="secondary" data-testid={`badge-active-workout-${index}`}>Actief</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress value={(workout.currentDay! / 7) * 100} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Voortgang</span>
                          <span data-testid={`progress-active-workout-${index}`}>{workout.currentDay}/7 dagen</span>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground"
                          data-testid={`button-continue-workout-${index}`}
                        >
                          Doorgaan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <i className="fas fa-dumbbell text-4xl text-muted-foreground"></i>
                    <h3 className="text-xl font-semibold" data-testid="heading-no-workouts">Geen Actieve Programma's</h3>
                    <p className="text-muted-foreground" data-testid="text-no-workouts">Start uw eerste trainingsprogramma om uw transformatie te beginnen.</p>
                    <Button 
                      className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground"
                      onClick={() => window.location.href = '/workouts'}
                      data-testid="button-start-first-workout"
                    >
                      Start Eerste Programma
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" data-testid="heading-recent-activity">Recente Activiteit</h2>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/progress'}
                data-testid="button-view-all-progress"
              >
                Volledige Voortgang
              </Button>
            </div>
            
            {logsLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">Laden...</div>
                </CardContent>
              </Card>
            ) : recentLogs && recentLogs.length > 0 ? (
              <Card data-testid="card-recent-activity">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentLogs.slice(0, 5).map((log, index) => (
                      <div key={log.id} className="flex justify-between items-center p-3 bg-secondary rounded-lg" data-testid={`activity-log-${index}`}>
                        <div className="space-y-1">
                          <div className="font-medium" data-testid={`activity-exercise-${index}`}>Oefening #{log.exerciseId.slice(-4)}</div>
                          <div className="text-sm text-muted-foreground" data-testid={`activity-date-${index}`}>
                            {new Date(log.completedAt!).toLocaleDateString('nl-NL')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold" data-testid={`activity-weight-${index}`}>{log.weight}kg</div>
                          <div className="text-sm text-muted-foreground" data-testid={`activity-reps-${index}`}>{log.sets}x{log.reps}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <i className="fas fa-chart-line text-4xl text-muted-foreground"></i>
                    <h3 className="text-xl font-semibold" data-testid="heading-no-activity">Geen Recente Activiteit</h3>
                    <p className="text-muted-foreground" data-testid="text-no-activity">Begin met een workout om uw voortgang bij te houden.</p>
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
