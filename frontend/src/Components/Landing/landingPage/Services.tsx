import React from "react";
import { cn } from "../../../lib/utils";

const FeaturesSectionDemo = () => {
  const features = [
    {
      title: "Built for developers",
      description:
        "Built for engineers, developers, dreamers, thinkers and doers.",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconTerminal2 }))),
    },
    {
      title: "Ease of use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconEaseInOut }))),
    },
    {
      title: "Pricing like no other",
      description:
        "Our prices are best in the market. No cap, no lock, no credit card required.",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconCurrencyDollar }))),
    },
    {
      title: "100% Uptime guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconCloud }))),
    },
    {
      title: "Multi-tenant Architecture",
      description: "You can simply share passwords instead of buying new seats",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconRouteAltLeft }))),
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available a 100% of the time. At least our AI Agents are.",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconHelp }))),
    },
    {
      title: "Money back guarantee",
      description:
        "If you do not like EveryAI, we will convince you to like us.",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconAdjustmentsBolt }))),
    },
    {
      title: "And everything else",
      description:
        "I just ran out of copy ideas. Accept my sincere apologies",
      icon: React.lazy(() => import("@tabler/icons-react").then(module => ({ default: module.IconHeart }))),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
};

const Feature = React.memo(({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.LazyExoticComponent<React.FC>;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800 shadow-lg hover:shadow-blue-500 transition-shadow duration-300",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        <React.Suspense fallback={<div>Loading...</div>}>
          <Icon />
        </React.Suspense>
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
});

// Exporting the component as default
export default FeaturesSectionDemo;
