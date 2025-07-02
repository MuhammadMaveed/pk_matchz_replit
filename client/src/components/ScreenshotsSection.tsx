import { Star, Video, Users, MessageCircle } from "lucide-react";

export default function ScreenshotsSection() {
  const screenshots = [
    { icon: Star, gradient: "bg-gradient-primary" },
    { icon: Video, gradient: "bg-gradient-secondary" },
    { icon: Users, gradient: "bg-gradient-accent" },
    { icon: MessageCircle, gradient: "bg-gradient-to-br from-pink-500 to-red-500" },
  ];

  return (
    <section id="screenshots" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Amazing <span className="text-gradient">Interface</span>
          </h2>
          <p className="text-xl text-slate-600">
            Capture a glimpse of excellence through our compelling screenshots, revealing the app's essence in vivid detail
          </p>
        </div>
        
        <div className="relative">
          {/* Central Feature Phone */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Custom SVG Phone Mockup */}
              <svg className="w-80 h-auto" viewBox="0 0 300 600" fill="none">
                {/* Phone Frame */}
                <rect x="20" y="20" width="260" height="560" rx="40" fill="url(#phoneMainGradient)" stroke="#E2E8F0" strokeWidth="3"/>
                {/* Screen */}
                <rect x="35" y="60" width="230" height="480" rx="25" fill="#1E293B"/>
                {/* Status Bar */}
                <rect x="50" y="80" width="200" height="30" rx="15" fill="#374151"/>
                {/* App Interface */}
                <rect x="50" y="120" width="200" height="100" rx="15" fill="url(#screenGradient1)"/>
                <rect x="50" y="240" width="200" height="100" rx="15" fill="url(#screenGradient2)"/>
                <rect x="50" y="360" width="200" height="100" rx="15" fill="url(#screenGradient3)"/>
                {/* Home Indicator */}
                <rect x="130" y="520" width="40" height="4" rx="2" fill="#9CA3AF"/>
                
                <defs>
                  <linearGradient id="phoneMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F8FAFC"/>
                    <stop offset="100%" stopColor="#E2E8F0"/>
                  </linearGradient>
                  <linearGradient id="screenGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1"/>
                    <stop offset="100%" stopColor="#8B5CF6"/>
                  </linearGradient>
                  <linearGradient id="screenGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B"/>
                    <stop offset="100%" stopColor="#EF4444"/>
                  </linearGradient>
                  <linearGradient id="screenGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981"/>
                    <stop offset="100%" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          {/* Screenshot Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {screenshots.map((screenshot, index) => {
              const Icon = screenshot.icon;
              return (
                <div key={index} className="group">
                  <div className={`w-full h-48 ${screenshot.gradient} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-16 h-16 text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
