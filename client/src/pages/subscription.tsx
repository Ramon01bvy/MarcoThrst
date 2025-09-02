import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Subscription() {
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

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-accent">Laden...</div>
    </div>;
  }

  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch subscription status
  const { data: subscriptionData } = useQuery({
    queryKey: ['/api/user/subscription'],
    enabled: !!isAuthenticated,
  });

  // Fetch subscription plans
  const { data: subscriptionPlans } = useQuery({
    queryKey: ['/api/subscription-plans'],
  });

  const currentPlan = subscriptionData?.plan || "free";
  const expiryDate = subscriptionData?.expiresAt ? new Date(subscriptionData.expiresAt) : null;
  const subscriptionStatus = subscriptionData?.status || "inactive";

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest(`/api/create-payment`, {
        method: 'POST',
        body: { plan: planId },
      });
      return response;
    },
    onSuccess: (data) => {
      // Redirect to Mollie payment page
      window.location.href = data.paymentUrl;
    },
    onError: (error) => {
      console.error('Payment creation error:', error);
      toast({
        title: "Betalingsfout",
        description: "Er is een fout opgetreden bij het verwerken van uw betaling. Probeer het opnieuw.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });

  const plans = [
    {
      id: "essentieel",
      name: "Essentieel",
      price: subscriptionPlans?.essentieel ? `€${subscriptionPlans.essentieel.price}` : "€29.99",
      period: "/maand",
      description: "Ideaal voor wie de basis wil leggen voor een gezondere levensstijl",
      features: [
        "Toegang tot alle trainingsprogramma's",
        "Basis voedingsplannen",
        "Voortgang tracking",
        "Mobile app toegang",
        "E-mail ondersteuning"
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Premium", 
      price: subscriptionPlans?.premium ? `€${subscriptionPlans.premium.price}` : "€49.99",
      period: "/maand",
      description: "Complete transformatie voor wie serieus is over resultaten",
      features: [
        "Alles uit Essentieel",
        "Persoonlijke coaching sessies",
        "Geavanceerde voedingsplannen", 
        "24/7 WhatsApp ondersteuning",
        "Wekelijkse voortgangsgesprekken",
        "Exclusieve workout variaties",
        "Prioriteit klantenservice"
      ],
      popular: true,
    },
    {
      id: "elite",
      name: "Elite",
      price: subscriptionPlans?.elite ? `€${subscriptionPlans.elite.price}` : "€79.99",
      period: "",
      description: "Alles-in-één programma voor de meest veeleisende cliënten",
      features: [
        "Alles uit Elite",
        "Persoonlijke chef-kok service",
        "Thuistraining mogelijk",
        "24/7 persoonlijke assistentie",
        "Complete lifestyle management",
        "Maandelijkse medische check-ups",
        "Exclusive events toegang"
      ],
      popular: false,
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    toast({
      title: "Betaling Voorbereiden",
      description: "U wordt doorgestuurd naar de beveiligde betalingspagina van Mollie...",
    });
    
    try {
      await createPaymentMutation.mutateAsync(planId);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const handleContactForExecutive = () => {
    toast({
      title: "Contact Aanvraag",
      description: "Onze specialist neemt binnen 24 uur contact met u op.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold" data-testid="heading-subscription">
                Uw <span className="text-gradient">Abonnement</span>
              </h1>
              <p className="text-xl text-muted-foreground" data-testid="text-subscription-description">
                Beheer uw abonnement en upgrade naar meer exclusieve mogelijkheden
              </p>
            </div>
          </section>

          {/* Current Subscription Status */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20" data-testid="card-current-subscription">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" data-testid="title-current-subscription">
                  <span>Huidige Abonnement</span>
                  <Badge className="bg-accent text-accent-foreground" data-testid="badge-current-plan">
                    {currentPlan === "free" ? "Gratis" : 
                     currentPlan === "essentieel" ? "Essentieel" :
                     currentPlan === "premium" ? "Premium" : "Elite"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2" data-testid="heading-subscription-details">Abonnement Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-accent font-medium" data-testid="status-subscription">
                          {subscriptionStatus === 'active' ? "Actief" : subscriptionStatus === 'expired' ? "Verlopen" : "Inactief"}
                        </span>
                      </div>
                      {expiryDate && (
                        <div className="flex justify-between">
                          <span>Verloopt op:</span>
                          <span data-testid="expiry-date">{expiryDate.toLocaleDateString('nl-NL')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Factuuradres:</span>
                        <span data-testid="billing-email">{user?.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Huidige Voordelen</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {currentPlan === "free" ? (
                        <div data-testid="free-features">
                          <p>• Beperkte toegang tot programma's</p>
                          <p>• Basis voortgang tracking</p>
                        </div>
                      ) : currentPlan === "essentieel" ? (
                        <div data-testid="essentieel-features">
                          <p>• Volledige toegang tot programma's</p>
                          <p>• Basis voedingsplannen</p>
                          <p>• Voortgang tracking</p>
                        </div>
                      ) : currentPlan === "premium" ? (
                        <div data-testid="premium-features">
                          <p>• Uitgebreide trainingen</p>
                          <p>• Voedingsplannen en tracking</p>
                          <p>• Progress monitoring</p>
                        </div>
                      ) : currentPlan === "elite" ? (
                        <div data-testid="elite-features">
                          <p>• Persoonlijke coaching</p>
                          <p>• Premium content</p>
                          <p>• 24/7 ondersteuning</p>
                        </div>
                      ) : (
                        <div data-testid="executive-features">
                          <p>• Volledige lifestyle management</p>
                          <p>• Persoonlijke assistentie</p>
                          <p>• Premium ondersteuning</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Upgrade Options */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4" data-testid="heading-upgrade-options">
                Upgrade Opties
              </h2>
              <p className="text-muted-foreground" data-testid="text-upgrade-description">
                Kies het plan dat het beste bij uw doelen past
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={plan.id} 
                  className={`card-hover h-full ${plan.popular ? 'border-2 border-accent relative' : ''}`}
                  data-testid={`card-plan-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
                        Meest Populair
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl" data-testid={`title-plan-${plan.id}`}>
                      {plan.name}
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold" data-testid={`price-plan-${plan.id}`}>
                        {plan.price}
                        <span className="text-lg text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground text-sm" data-testid={`description-plan-${plan.id}`}>
                        {plan.description}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <i className="fas fa-check text-accent w-4 mt-0.5"></i>
                          <span className="text-sm" data-testid={`feature-${plan.id}-${featureIndex}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      {currentPlan === plan.id ? (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          disabled
                          data-testid={`button-current-${plan.id}`}
                        >
                          <i className="fas fa-check mr-2"></i>
                          Huidige Plan
                        </Button>
                      ) : plan.id === "elite" && plan.price.includes("Op aanvraag") ? (
                        <Button 
                          variant="outline" 
                          className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                          onClick={handleContactForExecutive}
                          data-testid={`button-contact-${plan.id}`}
                        >
                          Contact Opnemen
                        </Button>
                      ) : (
                        <Button 
                          className={`w-full ${plan.popular 
                            ? 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:opacity-90' 
                            : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isProcessing}
                          data-testid={`button-upgrade-${plan.id}`}
                        >
                          {isProcessing ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Verwerken...
                            </>
                          ) : (
                            `Upgrade naar ${plan.name}`
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Billing History */}
          <section className="mt-12">
            <Card data-testid="card-billing-history">
              <CardHeader>
                <CardTitle data-testid="heading-billing-history">
                  <i className="fas fa-receipt text-accent mr-2"></i>
                  Factuurgeschiedenis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground" data-testid="no-billing-history">
                  <i className="fas fa-file-invoice text-4xl mb-4"></i>
                  <p>Geen factuurgeschiedenis beschikbaar</p>
                  <p className="text-sm">Facturen verschijnen hier na uw eerste betaling</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
