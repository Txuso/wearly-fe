import { ShoppingBag, Check, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "€0",
      period: "/ month",
      cta: "Try Free",
      ctaVariant: "outline" as const,
      description: "",
      features: [
        "Limited access to outfit recommendations",
        "Limited number of product searches",
        "Basic virtual try-on (slow generation)",
        "Limited wardrobe memory",
        "Limited access to style insights",
      ],
    },
    {
      name: "Plus",
      price: "€9.99",
      period: "/ month",
      cta: "Get Plus",
      ctaVariant: "default" as const,
      badge: "✨ Everything in Free and:",
      features: [
        "Extended number of product searches",
        "Faster and higher-quality virtual try-on",
        "Access to more stores and brands",
        "Extended outfit recommendations (per item)",
        "Unlimited wishlists and saved looks",
        "Priority response speed",
      ],
    },
    {
      name: "Pro",
      price: "€23",
      period: "/ month",
      cta: "Get Pro",
      ctaVariant: "default" as const,
      badge: "✨ Everything in Plus and:",
      features: [
        "Advanced virtual try-on with poses and backgrounds",
        "Unlimited product searches",
        "Extended wardrobe memory & personalization",
        "Deeper AI style analysis and event-based outfits",
        "Complete look builder (full outfit generation)",
        "Early access to new features",
        "Creator tools (HD exports, social-ready formats)",
      ],
    },
    {
      name: "Business",
      price: "€79",
      period: "/ month (starting at)",
      cta: "Get Business",
      ctaVariant: "default" as const,
      badge: "👁️ Everything in Pro and:",
      features: [
        "Team dashboard & multi-user management",
        "Wearly API access (product search + try-on)",
        "Advanced scrapping across partner stores",
        "Trend, size, and customer preference analytics",
        "E-commerce integrations (Shopify, WooCommerce…)",
        "Priority support & SLAs",
        "Custom branding (logo, colors, domain)",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-hero rounded-xl shadow-card">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text tracking-tight">
                  Wearly
                </h1>
                <p className="text-xs font-medium text-muted-foreground">AI Fashion Assistant</p>
              </div>
            </NavLink>
            <nav className="flex items-center gap-6">
              <NavLink
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                Home
              </NavLink>
              <NavLink
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                Pricing
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Wearly Pricing</h1>
          <p className="text-muted-foreground text-center mb-16 text-lg">
            Choose the perfect plan for your style journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`
                  rounded-2xl border border-border/60 bg-card p-8 
                  shadow-soft hover:shadow-medium transition-all duration-300
                  flex flex-col
                  ${index === 1 ? "md:scale-105 border-primary/30" : ""}
                `}
              >
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta} →
                  </Button>
                </div>

                {/* Features */}
                <div className="flex-1">
                  {plan.badge && (
                    <div className="mb-4 pb-4 border-b border-border/40">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        {plan.badge}
                      </p>
                    </div>
                  )}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
