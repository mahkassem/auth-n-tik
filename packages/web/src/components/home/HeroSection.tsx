interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}
