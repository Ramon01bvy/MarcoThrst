import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Meal } from "@shared/schema";

interface NutritionCardProps {
  meal: Meal;
  onLog: (servings: number) => void;
  isLogging: boolean;
  testId: string;
}

export default function NutritionCard({ meal, onLog, isLogging, testId }: NutritionCardProps) {
  const [servings, setServings] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  const categoryLabels = {
    breakfast: "Ontbijt",
    lunch: "Lunch", 
    dinner: "Diner",
    snack: "Snack",
  };

  const dietTypeLabels = {
    standard: "Standaard",
    vegetarian: "Vegetarisch",
    vegan: "Vegan",
  };

  const dietTypeColors = {
    standard: "bg-blue-500/20 text-blue-400",
    vegetarian: "bg-green-500/20 text-green-400",
    vegan: "bg-emerald-500/20 text-emerald-400",
  };

  const handleLog = () => {
    onLog(servings);
    setShowDetails(false);
    setServings(1);
  };

  return (
    <Card className="card-hover h-full" data-testid={`card-${testId}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${testId}`}>
            {categoryLabels[meal.category as keyof typeof categoryLabels] || meal.category}
          </Badge>
          <Badge 
            className={`text-xs ${dietTypeColors[meal.dietType as keyof typeof dietTypeColors] || 'bg-gray-500/20 text-gray-400'}`}
            data-testid={`badge-diet-${testId}`}
          >
            {dietTypeLabels[meal.dietType as keyof typeof dietTypeLabels] || meal.dietType}
          </Badge>
        </div>
        <CardTitle className="text-xl" data-testid={`title-${testId}`}>
          {meal.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {meal.imageUrl && (
          <img 
            src={meal.imageUrl} 
            alt={meal.name}
            className="w-full h-48 object-cover rounded-lg"
            data-testid={`image-${testId}`}
          />
        )}
        
        <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`description-${testId}`}>
          {meal.description}
        </p>
        
        {/* Nutrition Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xl font-bold text-accent" data-testid={`calories-${testId}`}>
              {meal.calories || 0}
            </div>
            <div className="text-xs text-muted-foreground">Calorieën</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-xl font-bold text-accent" data-testid={`protein-${testId}`}>
              {meal.protein || 0}g
            </div>
            <div className="text-xs text-muted-foreground">Proteïne</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1"
                data-testid={`button-details-${testId}`}
              >
                <i className="fas fa-info-circle mr-2"></i>
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle data-testid={`dialog-title-${testId}`}>{meal.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Detailed Nutrition */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-bold text-accent">{meal.calories || 0}</div>
                    <div className="text-xs text-muted-foreground">Calorieën</div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-bold text-accent">{meal.protein || 0}g</div>
                    <div className="text-xs text-muted-foreground">Proteïne</div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-bold text-accent">{meal.carbs || 0}g</div>
                    <div className="text-xs text-muted-foreground">Koolhydraten</div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <div className="font-bold text-accent">{meal.fat || 0}g</div>
                    <div className="text-xs text-muted-foreground">Vet</div>
                  </div>
                </div>
                
                {/* Prep Time */}
                {meal.prepTime && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <i className="fas fa-clock text-accent"></i>
                    <span>Bereidingstijd: {meal.prepTime} minuten</span>
                  </div>
                )}
                
                {/* Ingredients */}
                {meal.ingredients && meal.ingredients.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Ingrediënten:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {meal.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Instructions */}
                {meal.instructions && (
                  <div>
                    <h4 className="font-semibold mb-2">Bereiding:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{meal.instructions}</p>
                  </div>
                )}
                
                {/* Log Meal Section */}
                <div className="border-t pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Porties:</label>
                    <Input
                      type="number"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={servings}
                      onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                      className="w-20 text-center"
                      data-testid={`input-servings-${testId}`}
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground"
                    onClick={handleLog}
                    disabled={isLogging}
                    data-testid={`button-log-detailed-${testId}`}
                  >
                    {isLogging ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-plus mr-2"></i>
                    )}
                    {isLogging ? 'Toevoegen...' : 'Toevoegen aan Dagboek'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            className="flex-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:opacity-90 transition-opacity"
            onClick={() => onLog(1)}
            disabled={isLogging}
            data-testid={`button-log-${testId}`}
          >
            {isLogging ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-plus mr-2"></i>
            )}
            {isLogging ? 'Toevoegen...' : 'Log Maaltijd'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
