import { TrendingUp, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Crecimiento Estratégico",
    description:
      "Diseñamos planes de acción personalizados que impulsan el crecimiento sostenible de tu empresa.",
  },
  {
    icon: Shield,
    title: "Seguridad Garantizada",
    description:
      "Protegemos tus activos digitales con las mejores prácticas y tecnología de última generación.",
  },
  {
    icon: Zap,
    title: "Rendimiento Óptimo",
    description:
      "Optimizamos cada proceso para maximizar la eficiencia y reducir costos operativos.",
  },
  {
    icon: Users,
    title: "Equipo Experto",
    description:
      "Profesionales con años de experiencia listos para resolver cualquier desafío de tu negocio.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-3">
            Nuestros beneficios
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            ¿Por qué elegirnos?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-gold/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gold/15 transition-colors duration-500">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
