import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
  onStart: () => void;
  isStarting: boolean;
  testId: string;
}

export default function WorkoutCard({ workout, onStart, isStarting, testId }: WorkoutCardProps) {
  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-400",
    intermediate: "bg-yellow-500/20 text-yellow-400",
    advanced: "bg-red-500/20 text-red-400",
  };

  const categoryLabels = {
    "full-body": "Volledige Lichaam",
    "upper-lower": "Upper/Lower",
    "strength": "Kracht",
    "cutting": "Cutting",
    "bulking": "Massa",
    "hybrid": "Hybride",
  };

  return (
    <Card className="card-hover h-full" data-testid={`card-${testId}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${testId}`}>
            {categoryLabels[workout.category as keyof typeof categoryLabels] || workout.category}
          </Badge>
          <Badge 
            className={`text-xs ${difficultyColors[workout.difficulty as keyof typeof difficultyColors] || 'bg-gray-500/20 text-gray-400'}`}
            data-testid={`badge-difficulty-${testId}`}
          >
            {workout.difficulty === 'beginner' && 'Beginner'}
            {workout.difficulty === 'intermediate' && 'Gemiddeld'}
            {workout.difficulty === 'advanced' && 'Gevorderd'}
          </Badge>
        </div>
        <CardTitle className="text-xl" data-testid={`title-${testId}`}>
          {workout.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {workout.imageUrl && (
          <img 
            src={workout.imageUrl} 
            alt={workout.name}
            className="w-full h-48 object-cover rounded-lg"
            data-testid={`image-${testId}`}
          />
        )}
        
        <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`description-${testId}`}>
          {workout.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <i className="fas fa-clock text-accent"></i>
            <span data-testid={`duration-${testId}`}>
              {workout.duration ? `${workout.duration} min` : 'Variabel'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-calendar text-accent"></i>
            <span data-testid={`days-${testId}`}>
              {workout.daysPerWeek ? `${workout.daysPerWeek}x/week` : 'Flexibel'}
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:opacity-90 transition-opacity"
          onClick={onStart}
          disabled={isStarting}
          data-testid={`button-start-${testId}`}
        >
          {isStarting ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-play mr-2"></i>
          )}
          {isStarting ? 'Starten...' : 'Start Programma'}
        </Button>
      </CardContent>
    </Card>
  );
}
