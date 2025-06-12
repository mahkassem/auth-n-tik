import { LockIcon, CheckCircleIcon, BoltIcon } from "@/components/icons";
import FeatureCard from "./FeatureCard";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <LockIcon className="h-8 w-8" />,
      title: "Secure Authentication",
      description: "JWT Based",
      iconColor: "text-blue-600"
    },
    {
      icon: <CheckCircleIcon className="h-8 w-8" />,
      title: "Form Validation",
      description: "Zod Schema",
      iconColor: "text-green-600"
    },
    {
      icon: <BoltIcon className="h-8 w-8" />,
      title: "Modern Stack",
      description: "Next.js + NestJS",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          iconColor={feature.iconColor}
        />
      ))}
    </div>
  );
}
