import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ScreenshotsSection from "@/components/ScreenshotsSection";
import ContactSection from "@/components/ContactSection";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/coins");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <TestimonialsSection />
        <ScreenshotsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
