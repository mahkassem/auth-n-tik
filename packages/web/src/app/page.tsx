"use client";

import { useSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import { 
  HeroSection, 
  LoadingSpinner, 
  WelcomeCard, 
  AuthActions, 
  FeaturesGrid 
} from "@/components/home";

export default function Home() {
  const { data: session, status } = useSession();

  const renderContent = () => {
    if (status === "loading") {
      return <LoadingSpinner />;
    }

    if (session) {
      return (
        <WelcomeCard 
          userName={session.user?.name} 
          userEmail={session.user?.email} 
        />
      );
    }

    return <AuthActions />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <HeroSection 
          title="Welcome to Auth-N-Tik"
          subtitle="A modern authentication system built with Next.js and NestJS"
        />

        <div className="mt-16">
          {renderContent()}
        </div>

        <div className="mt-16">
          <FeaturesGrid />
        </div>
      </div>
    </div>
  );
}
