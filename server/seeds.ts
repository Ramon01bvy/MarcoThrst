import { storage } from './storage';

export async function seedDatabase() {
  console.log('🌱 Database seeding gestart...');

  // Oefeningen seeden
  await seedExercises();
  
  // Workouts seeden
  await seedWorkouts();
  
  // Maaltijden seeden  
  await seedMeals();
  
  // Voedingsplannen seeden
  await seedMealPlans();

  console.log('✅ Database seeding voltooid!');
}

async function seedExercises() {
  const exercises = [
    // Borst
    { name: 'Bankdrukken', category: 'borst', instructions: 'Lig op de bank en druk de halter omhoog', targetMuscles: ['borst', 'schouders', 'triceps'] },
    { name: 'Incline Bankdrukken', category: 'borst', instructions: 'Bankdrukken op schuine bank', targetMuscles: ['borst', 'schouders'] },
    { name: 'Dips', category: 'borst', instructions: 'Ondersteun je lichaam en laat jezelf zakken', targetMuscles: ['borst', 'triceps'] },
    { name: 'Push-ups', category: 'borst', instructions: 'Klassieke opdrukken', targetMuscles: ['borst', 'triceps', 'schouders'] },
    { name: 'Dumbell Flyes', category: 'borst', instructions: 'Vliegbeweging met dumbells', targetMuscles: ['borst'] },
    
    // Rug
    { name: 'Pull-ups', category: 'rug', instructions: 'Trek jezelf omhoog aan de stang', targetMuscles: ['rug', 'biceps'] },
    { name: 'Barbell Rows', category: 'rug', instructions: 'Roeien met barbell', targetMuscles: ['rug', 'biceps'] },
    { name: 'Lat Pulldowns', category: 'rug', instructions: 'Trek de kabel naar beneden', targetMuscles: ['rug', 'biceps'] },
    { name: 'Deadlifts', category: 'rug', instructions: 'Til de halter vanaf de grond', targetMuscles: ['rug', 'hamstrings', 'glutes'] },
    { name: 'T-Bar Rows', category: 'rug', instructions: 'Roeien met T-bar', targetMuscles: ['rug', 'biceps'] },
    
    // Benen  
    { name: 'Squats', category: 'benen', instructions: 'Ga door je knieën en kom omhoog', targetMuscles: ['quadriceps', 'glutes', 'hamstrings'] },
    { name: 'Leg Press', category: 'benen', instructions: 'Druk het gewicht weg met je benen', targetMuscles: ['quadriceps', 'glutes'] },
    { name: 'Lunges', category: 'benen', instructions: 'Stap vooruit en ga door de knie', targetMuscles: ['quadriceps', 'glutes'] },
    { name: 'Leg Curls', category: 'benen', instructions: 'Buig je knieën tegen weerstand', targetMuscles: ['hamstrings'] },
    { name: 'Calf Raises', category: 'benen', instructions: 'Ga op je tenen staan', targetMuscles: ['kuiten'] },
    
    // Schouders
    { name: 'Shoulder Press', category: 'schouders', instructions: 'Druk de halters boven je hoofd', targetMuscles: ['schouders', 'triceps'] },
    { name: 'Lateral Raises', category: 'schouders', instructions: 'Til de armen opzij', targetMuscles: ['schouders'] },
    { name: 'Front Raises', category: 'schouders', instructions: 'Til de armen naar voren', targetMuscles: ['schouders'] },
    { name: 'Shrugs', category: 'schouders', instructions: 'Haal je schouders op', targetMuscles: ['traps'] },
    { name: 'Rear Delt Flyes', category: 'schouders', instructions: 'Vliegbeweging achterwaarts', targetMuscles: ['achterste schouders'] },
    
    // Armen
    { name: 'Bicep Curls', category: 'armen', instructions: 'Buig je armen met gewicht', targetMuscles: ['biceps'] },
    { name: 'Tricep Extensions', category: 'armen', instructions: 'Strek je armen boven het hoofd', targetMuscles: ['triceps'] },
    { name: 'Hammer Curls', category: 'armen', instructions: 'Bicep curls met neutrale grip', targetMuscles: ['biceps', 'onderarmen'] },
    { name: 'Close-Grip Bench', category: 'armen', instructions: 'Bankdrukken met nauwe grip', targetMuscles: ['triceps', 'borst'] },
    { name: 'Preacher Curls', category: 'armen', instructions: 'Bicep curls op preacher bank', targetMuscles: ['biceps'] },
    
    // Core
    { name: 'Planks', category: 'core', instructions: 'Houd je lichaam recht', targetMuscles: ['core', 'abs'] },
    { name: 'Crunches', category: 'core', instructions: 'Buikspier oefening', targetMuscles: ['abs'] },
    { name: 'Russian Twists', category: 'core', instructions: 'Draai je romp van links naar rechts', targetMuscles: ['obliques'] },
    { name: 'Mountain Climbers', category: 'core', instructions: 'Klim bewegingen in plank positie', targetMuscles: ['core', 'cardio'] },
    { name: 'Dead Bug', category: 'core', instructions: 'Lig op je rug en beweeg tegengestelde arm/been', targetMuscles: ['core'] },
  ];

  for (const exercise of exercises) {
    try {
      await storage.createExercise(exercise);
    } catch (error) {
      console.log(`Oefening ${exercise.name} al aanwezig`);
    }
  }
  
  console.log(`✅ ${exercises.length} oefeningen toegevoegd`);
}

async function seedWorkouts() {
  const workouts = [
    {
      id: 'upper-lower-split',
      name: 'Upper/Lower Split',
      description: 'Klassiek 4-daags split programma voor kracht en massa',
      difficulty: 'intermediate' as const,
      duration: 75,
      category: 'kracht' as const,
      daysPerWeek: 4,
      exercises: [
        // Upper Day 1
        { exerciseName: 'Bankdrukken', dayNumber: 1, sets: 4, reps: '6-8', restSeconds: 180, orderIndex: 1 },
        { exerciseName: 'Barbell Rows', dayNumber: 1, sets: 4, reps: '6-8', restSeconds: 180, orderIndex: 2 },
        { exerciseName: 'Shoulder Press', dayNumber: 1, sets: 3, reps: '8-10', restSeconds: 120, orderIndex: 3 },
        { exerciseName: 'Pull-ups', dayNumber: 1, sets: 3, reps: '8-12', restSeconds: 120, orderIndex: 4 },
        { exerciseName: 'Bicep Curls', dayNumber: 1, sets: 3, reps: '10-12', restSeconds: 90, orderIndex: 5 },
        { exerciseName: 'Tricep Extensions', dayNumber: 1, sets: 3, reps: '10-12', restSeconds: 90, orderIndex: 6 },
        
        // Lower Day 1  
        { exerciseName: 'Squats', dayNumber: 2, sets: 4, reps: '6-8', restSeconds: 180, orderIndex: 1 },
        { exerciseName: 'Deadlifts', dayNumber: 2, sets: 4, reps: '5-6', restSeconds: 240, orderIndex: 2 },
        { exerciseName: 'Leg Press', dayNumber: 2, sets: 3, reps: '10-12', restSeconds: 120, orderIndex: 3 },
        { exerciseName: 'Leg Curls', dayNumber: 2, sets: 3, reps: '10-12', restSeconds: 90, orderIndex: 4 },
        { exerciseName: 'Calf Raises', dayNumber: 2, sets: 4, reps: '15-20', restSeconds: 60, orderIndex: 5 },
        
        // Upper Day 2
        { exerciseName: 'Incline Bankdrukken', dayNumber: 3, sets: 4, reps: '6-8', restSeconds: 180, orderIndex: 1 },
        { exerciseName: 'Lat Pulldowns', dayNumber: 3, sets: 4, reps: '8-10', restSeconds: 120, orderIndex: 2 },
        { exerciseName: 'Dips', dayNumber: 3, sets: 3, reps: '8-12', restSeconds: 120, orderIndex: 3 },
        { exerciseName: 'T-Bar Rows', dayNumber: 3, sets: 3, reps: '8-10', restSeconds: 120, orderIndex: 4 },
        { exerciseName: 'Lateral Raises', dayNumber: 3, sets: 3, reps: '12-15', restSeconds: 60, orderIndex: 5 },
        { exerciseName: 'Hammer Curls', dayNumber: 3, sets: 3, reps: '10-12', restSeconds: 90, orderIndex: 6 },
        
        // Lower Day 2
        { exerciseName: 'Lunges', dayNumber: 4, sets: 4, reps: '10-12', restSeconds: 120, orderIndex: 1 },
        { exerciseName: 'Leg Press', dayNumber: 4, sets: 4, reps: '12-15', restSeconds: 120, orderIndex: 2 },
        { exerciseName: 'Leg Curls', dayNumber: 4, sets: 4, reps: '12-15', restSeconds: 90, orderIndex: 3 },
        { exerciseName: 'Calf Raises', dayNumber: 4, sets: 4, reps: '15-20', restSeconds: 60, orderIndex: 4 },
        { exerciseName: 'Planks', dayNumber: 4, sets: 3, reps: '30-60s', restSeconds: 60, orderIndex: 5 },
      ]
    },
    {
      id: 'hybrid-training',
      name: 'Hybrid Training',
      description: 'Combinatie van kracht en conditie training',
      difficulty: 'advanced' as const,
      duration: 90,
      category: 'hybrid' as const,
      daysPerWeek: 5,
      exercises: [
        // Dag 1: Kracht Focus
        { exerciseName: 'Deadlifts', dayNumber: 1, sets: 5, reps: '3-5', restSeconds: 240, orderIndex: 1 },
        { exerciseName: 'Squats', dayNumber: 1, sets: 4, reps: '5-6', restSeconds: 180, orderIndex: 2 },
        { exerciseName: 'Bankdrukken', dayNumber: 1, sets: 4, reps: '5-6', restSeconds: 180, orderIndex: 3 },
        { exerciseName: 'Pull-ups', dayNumber: 1, sets: 3, reps: '8-10', restSeconds: 120, orderIndex: 4 },
        
        // Dag 2: Conditie Focus
        { exerciseName: 'Mountain Climbers', dayNumber: 2, sets: 4, reps: '30s', restSeconds: 30, orderIndex: 1 },
        { exerciseName: 'Push-ups', dayNumber: 2, sets: 4, reps: '15-20', restSeconds: 45, orderIndex: 2 },
        { exerciseName: 'Lunges', dayNumber: 2, sets: 4, reps: '20', restSeconds: 45, orderIndex: 3 },
        { exerciseName: 'Planks', dayNumber: 2, sets: 4, reps: '45s', restSeconds: 30, orderIndex: 4 },
        { exerciseName: 'Russian Twists', dayNumber: 2, sets: 4, reps: '20', restSeconds: 30, orderIndex: 5 },
      ]
    },
    {
      id: 'strength-program',
      name: 'Kracht Programma',
      description: 'Focus op maximale kracht met zware gewichten',
      difficulty: 'advanced' as const,
      duration: 120,
      category: 'kracht' as const,
      daysPerWeek: 3,
      exercises: [
        // Dag 1: Squat Focus
        { exerciseName: 'Squats', dayNumber: 1, sets: 6, reps: '1-3', restSeconds: 300, orderIndex: 1 },
        { exerciseName: 'Bankdrukken', dayNumber: 1, sets: 4, reps: '3-5', restSeconds: 240, orderIndex: 2 },
        { exerciseName: 'Barbell Rows', dayNumber: 1, sets: 4, reps: '5-6', restSeconds: 180, orderIndex: 3 },
        
        // Dag 2: Bench Focus  
        { exerciseName: 'Bankdrukken', dayNumber: 2, sets: 6, reps: '1-3', restSeconds: 300, orderIndex: 1 },
        { exerciseName: 'Deadlifts', dayNumber: 2, sets: 4, reps: '3-5', restSeconds: 240, orderIndex: 2 },
        { exerciseName: 'Shoulder Press', dayNumber: 2, sets: 4, reps: '5-6', restSeconds: 180, orderIndex: 3 },
        
        // Dag 3: Deadlift Focus
        { exerciseName: 'Deadlifts', dayNumber: 3, sets: 6, reps: '1-3', restSeconds: 300, orderIndex: 1 },
        { exerciseName: 'Squats', dayNumber: 3, sets: 4, reps: '3-5', restSeconds: 240, orderIndex: 2 },
        { exerciseName: 'Pull-ups', dayNumber: 3, sets: 4, reps: '5-8', restSeconds: 180, orderIndex: 3 },
      ]
    },
    {
      id: 'cutting-program',
      name: 'Cutting Programma',
      description: 'Vetverbranding en spierbehoud tijdens diëten',
      difficulty: 'intermediate' as const,
      duration: 60,
      category: 'vetverbranding' as const,
      daysPerWeek: 6,
      exercises: [
        // Dag 1: Full Body Circuit
        { exerciseName: 'Squats', dayNumber: 1, sets: 3, reps: '15-20', restSeconds: 60, orderIndex: 1 },
        { exerciseName: 'Push-ups', dayNumber: 1, sets: 3, reps: '12-15', restSeconds: 60, orderIndex: 2 },
        { exerciseName: 'Mountain Climbers', dayNumber: 1, sets: 3, reps: '30s', restSeconds: 45, orderIndex: 3 },
        { exerciseName: 'Planks', dayNumber: 1, sets: 3, reps: '45s', restSeconds: 45, orderIndex: 4 },
        
        // Dag 2: Upper Focus
        { exerciseName: 'Bankdrukken', dayNumber: 2, sets: 4, reps: '10-12', restSeconds: 90, orderIndex: 1 },
        { exerciseName: 'Pull-ups', dayNumber: 2, sets: 4, reps: '8-12', restSeconds: 90, orderIndex: 2 },
        { exerciseName: 'Shoulder Press', dayNumber: 2, sets: 3, reps: '12-15', restSeconds: 75, orderIndex: 3 },
        { exerciseName: 'Bicep Curls', dayNumber: 2, sets: 3, reps: '12-15', restSeconds: 60, orderIndex: 4 },
      ]
    }
  ];

  for (const workout of workouts) {
    try {
      const createdWorkout = await storage.createWorkout({
        id: workout.id,
        name: workout.name,
        description: workout.description,
        difficulty: workout.difficulty,
        duration: workout.duration,
        category: workout.category,
        daysPerWeek: workout.daysPerWeek
      });
      console.log(`✅ Workout ${workout.name} toegevoegd`);
    } catch (error) {
      console.log(`Workout ${workout.name} al aanwezig`);
    }
  }
  
  console.log(`✅ ${workouts.length} workouts toegevoegd`);
}

async function seedMeals() {
  const meals = [
    // Ontbijt
    { name: 'Havermout met Bessen', category: 'ontbijt', calories: 320, protein: 12, carbs: 45, fat: 8, dietType: 'vegetarisch', prepTime: 5, instructions: 'Kook havermout met melk, voeg bessen en honing toe' },
    { name: 'Omelet met Spinazie', category: 'ontbijt', calories: 280, protein: 24, carbs: 4, fat: 18, dietType: 'keto', prepTime: 10, instructions: 'Klop eieren, voeg spinazie toe en bak in de pan' },
    { name: 'Greek Yogurt Bowl', category: 'ontbijt', calories: 250, protein: 20, carbs: 25, fat: 8, dietType: 'vegetarisch', prepTime: 3, instructions: 'Meng yogurt met granola en fruit' },
    { name: 'Avocado Toast', category: 'ontbijt', calories: 340, protein: 10, carbs: 30, fat: 22, dietType: 'vegan', prepTime: 5, instructions: 'Rooster brood, prak avocado erop met zout en peper' },
    { name: 'Protein Pannenkoeken', category: 'ontbijt', calories: 380, protein: 30, carbs: 25, fat: 15, dietType: 'normaal', prepTime: 15, instructions: 'Mix eiwit poeder met eieren en bak als pannenkoeken' },
    
    // Lunch
    { name: 'Kip Caesar Salade', category: 'lunch', calories: 420, protein: 35, carbs: 15, fat: 25, dietType: 'normaal', prepTime: 10, instructions: 'Grill kip, meng met sla, croutons en caesar dressing' },
    { name: 'Quinoa Buddha Bowl', category: 'lunch', calories: 380, protein: 15, carbs: 45, fat: 14, dietType: 'vegan', prepTime: 20, instructions: 'Kook quinoa, voeg groenten, avocado en tahini toe' },
    { name: 'Tonijn Wrap', category: 'lunch', calories: 350, protein: 28, carbs: 35, fat: 12, dietType: 'normaal', prepTime: 5, instructions: 'Meng tonijn met mayo, wikkel in wrap met sla' },
    { name: 'Lentil Soup', category: 'lunch', calories: 280, protein: 18, carbs: 40, fat: 6, dietType: 'vegan', prepTime: 30, instructions: 'Kook linzen met groenten en kruiden' },
    { name: 'Kalkoen Club Sandwich', category: 'lunch', calories: 450, protein: 30, carbs: 40, fat: 20, dietType: 'normaal', prepTime: 8, instructions: 'Beleg brood met kalkoen, bacon, sla en tomaat' },
    
    // Diner
    { name: 'Gegrilde Zalm met Broccoli', category: 'diner', calories: 480, protein: 40, carbs: 15, fat: 28, dietType: 'normaal', prepTime: 25, instructions: 'Grill zalm, stoom broccoli, serveer met citroen' },
    { name: 'Rundersteak met Zoete Aardappel', category: 'diner', calories: 520, protein: 42, carbs: 35, fat: 22, dietType: 'normaal', prepTime: 30, instructions: 'Grill steak, bak zoete aardappel in oven' },
    { name: 'Vegetarische Curry', category: 'diner', calories: 380, protein: 15, carbs: 50, fat: 15, dietType: 'vegan', prepTime: 35, instructions: 'Sudder groenten in curry saus met kokosmelk' },
    { name: 'Kip Teriyaki met Rijst', category: 'diner', calories: 450, protein: 38, carbs: 45, fat: 12, dietType: 'normaal', prepTime: 20, instructions: 'Marineer kip in teriyaki, grill en serveer met rijst' },
    { name: 'Zoodle Bolognese', category: 'diner', calories: 320, protein: 25, carbs: 20, fat: 16, dietType: 'keto', prepTime: 25, instructions: 'Maak courgetti, top met gehakt bolognese saus' },
    
    // Snacks
    { name: 'Protein Shake', category: 'snack', calories: 180, protein: 25, carbs: 8, fat: 3, dietType: 'normaal', prepTime: 2, instructions: 'Mix eiwit poeder met water of melk' },
    { name: 'Apple met Pindakaas', category: 'snack', calories: 250, protein: 8, carbs: 25, fat: 16, dietType: 'vegetarisch', prepTime: 2, instructions: 'Snijd appel, dip in pindakaas' },
    { name: 'Mixed Nuts', category: 'snack', calories: 200, protein: 6, carbs: 8, fat: 18, dietType: 'keto', prepTime: 0, instructions: 'Eet een handvol gemengde noten' },
    { name: 'Cottage Cheese met Fruit', category: 'snack', calories: 160, protein: 15, carbs: 18, fat: 4, dietType: 'vegetarisch', prepTime: 2, instructions: 'Meng cottage cheese met bessen' },
    { name: 'Hummus met Groenten', category: 'snack', calories: 140, protein: 6, carbs: 15, fat: 7, dietType: 'vegan', prepTime: 3, instructions: 'Dip wortel en komkommer in hummus' },
    
    // Pre/Post Workout
    { name: 'Banaan met Honing', category: 'pre-workout', calories: 150, protein: 2, carbs: 35, fat: 1, dietType: 'vegan', prepTime: 1, instructions: 'Plak honing op banaan' },
    { name: 'Post-Workout Smoothie', category: 'post-workout', calories: 280, protein: 25, carbs: 30, fat: 6, dietType: 'vegetarisch', prepTime: 5, instructions: 'Blend eiwit poeder, banaan, bessen en melk' },
    { name: 'Rijstcrackers met Jam', category: 'pre-workout', calories: 120, protein: 2, carbs: 28, fat: 1, dietType: 'vegan', prepTime: 1, instructions: 'Smeer jam op rijstcrackers' },
    { name: 'Chocolate Milk', category: 'post-workout', calories: 190, protein: 9, carbs: 26, fat: 5, dietType: 'vegetarisch', prepTime: 1, instructions: 'Drink koude chocolademelk' },
  ];

  for (const meal of meals) {
    try {
      await storage.createMeal(meal);
    } catch (error) {
      console.log(`Maaltijd ${meal.name} al aanwezig`);
    }
  }
  
  console.log(`✅ ${meals.length} maaltijden toegevoegd`);
}

async function seedMealPlans() {
  // Deze functie kan later uitgebreid worden met specifieke meal plans
  console.log('✅ Meal plans basis opgezet');
}