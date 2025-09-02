import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                <i className="fas fa-dumbbell text-accent-foreground text-sm"></i>
              </div>
              <span className="text-xl font-bold text-gradient">Marco Donato</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#programmas" className="text-muted-foreground hover:text-foreground transition-colors">Programma's</a>
              <a href="#voeding" className="text-muted-foreground hover:text-foreground transition-colors">Voeding</a>
              <a href="#voortgang" className="text-muted-foreground hover:text-foreground transition-colors">Voortgang</a>
              <a href="#prijzen" className="text-muted-foreground hover:text-foreground transition-colors">Prijzen</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-login"
              >
                Inloggen
              </button>
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                data-testid="button-signup"
              >
                Nu Starten
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.1),transparent)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full border border-border">
                  <span className="text-accent text-sm font-medium">✨ Exclusieve luxe fitness ervaring</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight" data-testid="heading-main">
                  De app die uw 
                  <span className="text-gradient">lichaam</span> 
                  transformeert
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
                  Persoonlijke begeleiding van wereldklasse. Ontgrendel uw volledige potentieel met onze exclusieve trainingsbibliotheek en voedingsexpertise.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
                  data-testid="button-start-now"
                >
                  Nu Beginnen
                </button>
                <button 
                  onClick={() => document.getElementById('programmas')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-border text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition-colors"
                  data-testid="button-discover-programs"
                >
                  Ontdek Programma's
                </button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent" data-testid="stat-programs">30+</div>
                  <div className="text-sm text-muted-foreground">Programma's</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent" data-testid="stat-nutrition">200+</div>
                  <div className="text-sm text-muted-foreground">Voedingsplannen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent" data-testid="stat-success">98%</div>
                  <div className="text-sm text-muted-foreground">Succesvol</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                  alt="Premium fitness equipment in luxury gym environment" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  data-testid="img-hero-fitness"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent to-accent/80 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/20 rounded-full opacity-30 blur-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section id="programmas" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold" data-testid="heading-programs">
              Ontgrendel onze persoonlijke 
              <span className="text-gradient">trainingsbibliotheek</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-programs-description">
              Meer dan 30 bewezen programma's ontwikkeld door Marco Donato. Selecteer uw focus en transformeer uw lichaam met onze wetenschappelijk onderbouwde methoden.
            </p>
          </div>
          
          {/* Program Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-lg font-medium transition-all" data-testid="tab-full-body">
              Volledige Lichaam
            </button>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all" data-testid="tab-hybrid">
              Hybride Training
            </button>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all" data-testid="tab-strength">
              Kracht & Massa
            </button>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all" data-testid="tab-weight-loss">
              Gewichtsverlies
            </button>
          </div>
          
          {/* Featured Program */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Premium gym environment with luxury fitness equipment" 
                className="rounded-2xl shadow-xl w-full h-auto"
                data-testid="img-featured-program"
              />
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                ⭐ NIEUW
              </div>
              
              <h3 className="text-3xl font-bold" data-testid="heading-featured-program">Upper / Lower Elite</h3>
              
              <p className="text-muted-foreground leading-relaxed" data-testid="text-featured-description">
                De Upper/Lower split is een van de meest optimale schema's die u kunt kiezen om algehele groei te maximaliseren terwijl vermoeidheid wordt geminimaliseerd. Elke spiergroep wordt minimaal twee keer per week getraind.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Dag 1: Upper A</span>
                  <i className="fas fa-play text-accent"></i>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Dag 2: Lower A</span>
                  <i className="fas fa-play text-accent"></i>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span>Dag 3: Upper B</span>
                  <i className="fas fa-play text-accent"></i>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>Dag 4: Rust (LISS)</span>
                  <i className="fas fa-moon text-muted-foreground"></i>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-start-program"
              >
                Start Programma
              </button>
            </div>
          </div>
          
          {/* Other Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-hover" data-testid="card-program-hybrid">
              <CardContent className="p-6">
                <img 
                  src="https://pixabay.com/get/g1f1f57394600958d28fe3f4704e75fd0b5bd26d8aedcad2f3203794b62cec37306f292edfa23ce149f385cf0d75297b52fa6791f11cad672e3dac1b74977d037_1280.jpg" 
                  alt="Fitness transformation results showing muscle development" 
                  className="rounded-lg w-full h-48 object-cover mb-4"
                  data-testid="img-program-hybrid"
                />
                
                <h4 className="text-xl font-bold mb-2" data-testid="heading-program-hybrid">Hybride Atleet Challenge</h4>
                <p className="text-muted-foreground text-sm mb-4" data-testid="text-program-hybrid-description">
                  Combineer kracht, uithoudingsvermogen en conditie in één uitdagend programma. Perfect voor veelzijdige fitnessdoelen.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-accent font-medium" data-testid="text-program-hybrid-duration">7 dagen schema</span>
                  <button className="text-accent hover:text-accent/80 transition-colors" data-testid="button-view-hybrid">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover" data-testid="card-program-strength">
              <CardContent className="p-6">
                <img 
                  src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200" 
                  alt="Professional strength training with luxury gym equipment" 
                  className="rounded-lg w-full h-48 object-cover mb-4"
                  data-testid="img-program-strength"
                />
                
                <h4 className="text-xl font-bold mb-2" data-testid="heading-program-strength">Elite Kracht 5x5</h4>
                <p className="text-muted-foreground text-sm mb-4" data-testid="text-program-strength-description">
                  Het legendarische 5x5 schema voor maximale kracht en massa ontwikkeling. Drie compound oefeningen per sessie.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-accent font-medium" data-testid="text-program-strength-duration">5 dagen schema</span>
                  <button className="text-accent hover:text-accent/80 transition-colors" data-testid="button-view-strength">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover" data-testid="card-program-shredder">
              <CardContent className="p-6">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200" 
                  alt="Premium fitness transformation results in luxury gym setting" 
                  className="rounded-lg w-full h-48 object-cover mb-4"
                  data-testid="img-program-shredder"
                />
                
                <h4 className="text-xl font-bold mb-2" data-testid="heading-program-shredder">Zomer Shredder</h4>
                <p className="text-muted-foreground text-sm mb-4" data-testid="text-program-shredder-description">
                  Speciaal ontworpen voor vetverlies en spierbehoud. Perfect voor een gedefinieerd zomerlichaam.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-accent font-medium" data-testid="text-program-shredder-duration">5 dagen schema</span>
                  <button className="text-accent hover:text-accent/80 transition-colors" data-testid="button-view-shredder">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nutrition Section */}
      <section id="voeding" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold" data-testid="heading-nutrition">
                Geen stress meer over 
                <span className="text-gradient">voeding</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-nutrition-description">
                U hoeft niet meer te googelen naar "eiwitrijke maaltijden" en calorieën op te tellen. Met onze voedingsbibliotheek vindt u 200+ maaltijden met stap-voor-stap bereidingsmethoden.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
                  <span>200+ maaltijden voor Vegan, Vegetarisch & Standaard diëten</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
                  <span>Eenvoudig wisselen tussen maaltijden naar uw smaak</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
                  <span>Personaliseer en voeg favoriete dagelijkse maaltijden toe</span>
                </div>
              </div>
              
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-discover-nutrition"
              >
                Ontdek Voedingsplannen
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <img 
                src="https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300" 
                alt="Healthy gourmet meal with premium ingredients and plating" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-nutrition-1"
              />
              
              <img 
                src="https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300" 
                alt="Nutritious breakfast bowl with fresh berries and healthy ingredients" 
                className="rounded-xl shadow-lg w-full h-auto mt-8"
                data-testid="img-nutrition-2"
              />
              
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300" 
                alt="Premium protein-rich meal with gourmet presentation" 
                className="rounded-xl shadow-lg w-full h-auto -mt-8"
                data-testid="img-nutrition-3"
              />
              
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300" 
                alt="Healthy gourmet salad with premium fresh ingredients" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-nutrition-4"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section id="voortgang" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold" data-testid="heading-progress">
              Transformeer uw training met ons 
              <span className="text-gradient">persoonlijke dashboard</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-progress-description">
              Onze krachtige voortgangsanalyse geeft u de uitgebreide inzichten die u nodig heeft om werkelijk controle te nemen en meer te bereiken.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Card 1 */}
            <Card className="card-hover" data-testid="card-progress-records">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200" 
                  alt="Professional workout tracking in premium gym environment" 
                  className="rounded-lg w-full h-48 object-cover mb-6"
                  data-testid="img-progress-records"
                />
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold" data-testid="heading-progress-records">Persoonlijke Records Bijhouden</h3>
                  <p className="text-muted-foreground" data-testid="text-progress-records-description">
                    Volg uw PR's per week, maand of all-time bij elke oefening met al uw prestaties op één plek.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bankdrukken</span>
                      <span className="font-bold text-accent" data-testid="stat-bench-press">120kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Squats</span>
                      <span className="font-bold text-accent" data-testid="stat-squats">150kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Deadlift</span>
                      <span className="font-bold text-accent" data-testid="stat-deadlift">180kg</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Progress Card 2 */}
            <Card className="card-hover" data-testid="card-progress-stats">
              <CardContent className="p-8">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=200" 
                  alt="Advanced fitness analytics in luxury gym setting" 
                  className="rounded-lg w-full h-48 object-cover mb-6"
                  data-testid="img-progress-stats"
                />
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold" data-testid="heading-progress-stats">Gedetailleerde Statistieken</h3>
                  <p className="text-muted-foreground" data-testid="text-progress-stats-description">
                    Blijf bovenop uw spel met gedetailleerde inzichten in uw workout prestaties.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-accent" data-testid="stat-goal-achieved">87%</div>
                      <div className="text-xs text-muted-foreground">Doel Bereikt</div>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold text-accent" data-testid="stat-sessions-month">12</div>
                      <div className="text-xs text-muted-foreground">Sessies Deze Maand</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Progress Card 3 */}
            <Card className="card-hover" data-testid="card-progress-visualization">
              <CardContent className="p-8">
                <img 
                  src="https://pixabay.com/get/gd996380feb800d22cc92170ce0efeda38fc81593155a6f0826c94fcf45b27a91212542da6c6e410b43e24273994b658ac60ed1bf33549c0282be291c0fd3d4ab_1280.jpg" 
                  alt="Fitness transformation progress visualization" 
                  className="rounded-lg w-full h-48 object-cover mb-6"
                  data-testid="img-progress-visualization"
                />
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold" data-testid="heading-progress-visualization">Visualiseer Uw Voortgang</h3>
                  <p className="text-muted-foreground" data-testid="text-progress-visualization-description">
                    Bekijk uw gewichtsveranderingen, zie uw transformatie ontvouwen en blijf gemotiveerd.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gewichtsverlies</span>
                      <span className="font-bold text-green-400" data-testid="stat-weight-loss">-8.5kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spiermassa</span>
                      <span className="font-bold text-accent" data-testid="stat-muscle-gain">+3.2kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vetpercentage</span>
                      <span className="font-bold text-green-400" data-testid="stat-body-fat">-6.8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="prijzen" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold" data-testid="heading-pricing">
              Exclusieve 
              <span className="text-gradient">Programma's</span>
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-pricing-description">
              Investeer in uzelf met een van onze op maat gemaakte trainingsprogramma's
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Essential Plan */}
            <Card className="card-hover" data-testid="card-plan-essential">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" data-testid="heading-plan-essential">Essentieel</h3>
                    <p className="text-muted-foreground" data-testid="text-plan-essential-description">Ideaal voor wie de basis wil leggen voor een gezondere levensstijl</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold" data-testid="price-essential">€149<span className="text-lg text-muted-foreground">/maand</span></div>
                    <div className="text-sm text-muted-foreground">Populair bij beginners</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Toegang tot alle trainingsprogramma's</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Basis voedingsplannen</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Voortgang tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Mobile app toegang</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="button-subscribe-essential"
                  >
                    Start Nu
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Elite Plan */}
            <Card className="card-hover relative border-2 border-accent" data-testid="card-plan-elite">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Meest Populair
                </span>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" data-testid="heading-plan-elite">Elite</h3>
                    <p className="text-muted-foreground" data-testid="text-plan-elite-description">Complete transformatie voor wie serieus is over resultaten</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold" data-testid="price-elite">€299<span className="text-lg text-muted-foreground">/maand</span></div>
                    <div className="text-sm text-muted-foreground">Best value voor geavanceerde gebruikers</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Alles uit Essentieel</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Persoonlijke coaching sessies</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Geavanceerde voedingsplannen</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">24/7 WhatsApp ondersteuning</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Wekelijkse voortgangsgesprekken</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:opacity-90"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="button-subscribe-elite"
                  >
                    Start Nu
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Executive Plan */}
            <Card className="card-hover" data-testid="card-plan-executive">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2" data-testid="heading-plan-executive">Executive</h3>
                    <p className="text-muted-foreground" data-testid="text-plan-executive-description">Alles-in-één programma voor de meest veeleisende cliënten</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold" data-testid="price-executive">Op aanvraag</div>
                    <div className="text-sm text-muted-foreground">Volledig gepersonaliseerd</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Alles uit Elite</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Persoonlijke chef-kok</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Thuistraining mogelijk</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">24/7 persoonlijke assistentie</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-check text-accent w-4"></i>
                      <span className="text-sm">Complete lifestyle management</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="button-contact-executive"
                  >
                    Contact Opnemen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold" data-testid="heading-cta">
              Neem controle met de 
              <span className="text-gradient">Marco Donato App</span>
            </h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-cta-description">
              Het leven is beter wanneer u in topvorm bent. U bent zelfverzekerder, succesvoller en straalt een rust uit die geld niet kan kopen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
                data-testid="button-start-today"
              >
                Start Vandaag
              </button>
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="border border-border text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary transition-colors"
                data-testid="button-view-demo"
              >
                Bekijk Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Marco Donato BV Fitness. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
