import { FEATURES, CONNECTION_FEATURES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Video, 
  Users, 
  MessageCircle, 
  Grid3X3, 
  Shield, 
  User,
  Download,
  RefreshCw
} from "lucide-react";

const iconMap = {
  beauty: Star,
  stream: Video,
  followers: Users,
  comments: MessageCircle,
  engagement: Grid3X3,
  security: Shield,
  personalization: User,
};

export default function FeaturesSection() {
  return (
    <>
      {/* Connection Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {CONNECTION_FEATURES.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div key={feature.id} className="text-center group">
                  <div className={`w-20 h-20 mx-auto mb-6 ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tailored Content Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Custom SVG Content Illustration */}
              <div className="relative">
                <svg className="w-full h-auto max-w-lg" viewBox="0 0 500 400" fill="none">
                  {/* Background */}
                  <rect width="500" height="400" rx="20" fill="url(#contentGradient)"/>
                  {/* Content Cards */}
                  <rect x="50" y="50" width="400" height="80" rx="10" fill="white" fillOpacity="0.9"/>
                  <rect x="50" y="150" width="400" height="80" rx="10" fill="white" fillOpacity="0.9"/>
                  <rect x="50" y="250" width="400" height="80" rx="10" fill="white" fillOpacity="0.9"/>
                  {/* Interactive Elements */}
                  <circle cx="100" cy="90" r="15" fill="#6366F1"/>
                  <circle cx="100" cy="190" r="15" fill="#F59E0B"/>
                  <circle cx="100" cy="290" r="15" fill="#10B981"/>
                  {/* Floating Icons */}
                  <g className="animate-float">
                    <circle cx="450" cy="100" r="20" fill="#8B5CF6" fillOpacity="0.3"/>
                    <circle cx="430" cy="300" r="15" fill="#EF4444" fillOpacity="0.3"/>
                  </g>
                  
                  <defs>
                    <linearGradient id="contentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Tailored Content <span className="text-gradient">Curation</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Discover endless entertainment tailored just for you. Our personalized recommendations algorithm ensures that 
                every scroll brings you closer to content that resonates with your interests.
              </p>
              <a href="#download">
                <Button className="px-8 py-4 bg-gradient-primary hover-glow">
                  Download Now
                  <RefreshCw className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Amazing Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Amazing <span className="text-gradient">Features</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Dive into a world of endless creativity with Pk Matchz's intuitive features. From seamless navigation to powerful editing tools, 
              unlock new possibilities and express yourself like never before.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap];
              return (
                <div key={feature.id} className="text-center group">
                  <div className={`w-24 h-24 mx-auto mb-6 ${feature.gradient} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
