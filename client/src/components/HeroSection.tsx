import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6">
              <span className="text-gradient">Snap, Share</span><br />
              and <span className="text-gradient">Shine</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Discover your platform for sharing and connecting. Every moment is an opportunity to captivate and shine, 
              whether it's showcasing your talents or sharing laughter. Join our vibrant community and let your brilliance illuminate the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#download">
                <Button className="px-8 py-4 bg-gradient-primary hover-glow">
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={onGetStarted}
                className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="animate-float">
              {/* Custom SVG Illustration */}
              <div className="w-full max-w-lg mx-auto">
                <svg className="w-full h-auto" viewBox="0 0 400 500" fill="none">
                  {/* Phone Frame */}
                  <rect x="80" y="50" width="240" height="400" rx="30" fill="url(#phoneGradient)" stroke="#E2E8F0" strokeWidth="2"/>
                  {/* Screen */}
                  <rect x="95" y="80" width="210" height="340" rx="15" fill="#1E293B"/>
                  {/* Status Bar */}
                  <rect x="105" y="90" width="190" height="20" rx="10" fill="#374151"/>
                  {/* Content Cards */}
                  <rect x="105" y="120" width="190" height="80" rx="10" fill="url(#cardGradient1)"/>
                  <rect x="105" y="210" width="190" height="80" rx="10" fill="url(#cardGradient2)"/>
                  <rect x="105" y="300" width="190" height="80" rx="10" fill="url(#cardGradient3)"/>
                  {/* Floating Elements */}
                  <circle cx="350" cy="150" r="30" fill="url(#floatingGradient1)" className="animate-bounce-slow"/>
                  <circle cx="30" cy="300" r="20" fill="url(#floatingGradient2)" className="animate-pulse-slow"/>
                  <circle cx="370" cy="400" r="25" fill="url(#floatingGradient3)" className="animate-bounce-slow"/>
                  
                  <defs>
                    <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F8FAFC"/>
                      <stop offset="100%" stopColor="#E2E8F0"/>
                    </linearGradient>
                    <linearGradient id="cardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1"/>
                      <stop offset="100%" stopColor="#8B5CF6"/>
                    </linearGradient>
                    <linearGradient id="cardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B"/>
                      <stop offset="100%" stopColor="#EF4444"/>
                    </linearGradient>
                    <linearGradient id="cardGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981"/>
                      <stop offset="100%" stopColor="#3B82F6"/>
                    </linearGradient>
                    <linearGradient id="floatingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="floatingGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1"/>
                    </linearGradient>
                    <linearGradient id="floatingGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
