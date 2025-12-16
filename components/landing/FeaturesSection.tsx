import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
}

// Custom SVG Icons with proper paths
const SparklesIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.5 7.5L17 5L15 10L21 9L17 13L23 15L17 17L21 21L15 19L17 24L13.5 19.5L12 24L10.5 19.5L7 24L9 19L3 21L7 17L1 15L7 13L3 9L9 10L7 5L10.5 7.5L12 2Z" fill="currentColor"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12.5L10.5 15L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TargetIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

const DollarIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <SparklesIcon />,
      title: "A draft in 10 mins",
      description: "The AI builder is 10x faster than doing on your own.",
      iconColor: "text-amber-400",
      iconBgColor: "bg-amber-400/10"
    },
    {
      icon: <CheckCircleIcon />,
      title: "Zero mistakes",
      description: "Don't stress over typos; you'll sound great!",
      iconColor: "text-emerald-400",
      iconBgColor: "bg-emerald-400/10"
    },
    {
      icon: <TargetIcon />,
      title: "ATS templates",
      description: "Your resume will be 100% compliant. Recruiters will see you.",
      iconColor: "text-blue-400",
      iconBgColor: "bg-blue-400/10"
    },
    {
      icon: <DollarIcon />,
      title: "Get paid 7% more",
      description: "We can help you negotiate a higher starting salary...",
      iconColor: "text-green-400",
      iconBgColor: "bg-green-400/10"
    }
  ];

  return (
    <section className="w-full py-8 md:py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative -py-6 border border-white/5 bg-white/2 backdrop-blur-sm hover:bg-white/5 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/5"
            >
              <CardContent className="p-5 md:p-6 space-y-3 md:space-y-4">
                {/* Icon Container */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${feature.iconBgColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <div className={feature.iconColor}>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 rounded-lg bg-linear-to-br from-purple-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:via-purple-500/0 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}