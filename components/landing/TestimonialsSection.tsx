'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Testimonial {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
  role: string;
  company: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    text: "ResumeAI helped me land my dream job at Google! The AI suggestions were spot-on and the templates are beautiful. Highly recommended!",
    imageSrc: '/image/avatar-1.png',
    name: 'Sarah Johnson',
    username: '@sarahjdev',
    role: 'Software Engineer',
    company: 'Google',
    rating: 5,
  },
  {
    text: "I was skeptical about AI-generated content, but this tool exceeded my expectations. Got 3 interview calls in the first week!",
    imageSrc: '/image/avatar-2.png',
    name: 'Michael Chen',
    username: '@mchen_pm',
    role: 'Product Manager',
    company: 'Microsoft',
    rating: 5,
  },
  {
    text: "The template designs are gorgeous and the ATS optimization feature is a game-changer. Worth every penny!",
    imageSrc: '/image/avatar-3.png',
    name: 'Emily Rodriguez',
    username: '@emilyux',
    role: 'UX Designer',
    company: 'Adobe',
    rating: 5,
  },
  {
    text: "Best resume builder I've used. The analytics feature helped me understand which version performed better.",
    imageSrc: '/image/avatar-4.png',
    name: 'David Park',
    username: '@davidparkdata',
    role: 'Data Scientist',
    company: 'Amazon',
    rating: 5,
  },
  {
    text: "Created my resume in under 10 minutes! The AI writing assistant is incredibly helpful and saves so much time.",
    imageSrc: '/image/avatar-6.png',
    name: 'Jessica Williams',
    username: '@jesswilliams',
    role: 'Marketing Manager',
    company: 'Apple',
    rating: 5,
  },
  {
    text: "The application tracking feature is brilliant. I can manage all my job applications in one place now.",
    imageSrc: '/image/avatar-2.png',
    name: 'Alex Turner',
    username: '@alexcodes',
    role: 'Full Stack Developer',
    company: 'Meta',
    rating: 5,
  },
  {
    text: "The real-time collaboration features have made working with my career coach so much easier and more productive.",
    imageSrc: '/image/avatar-4.png',
    name: 'Priya Sharma',
    username: '@priyasharma',
    role: 'Business Analyst',
    company: 'Deloitte',
    rating: 5,
  },
  {
    text: "I've tried many resume builders, but ResumeAI stands out with its intelligent keyword optimization and modern designs.",
    imageSrc: '/image/avatar-5.png',
    name: 'James Liu',
    username: '@jamesliu_tech',
    role: 'AI Researcher',
    company: 'OpenAI',
    rating: 5,
  },
  {
    text: "The customer support is exceptional. They helped me customize my resume for different job applications quickly.",
    imageSrc: '/image/avatar-6.png',
    name: 'Sophia Martinez',
    username: '@sophiam_bio',
    role: 'Research Scientist',
    company: 'Pfizer',
    rating: 5,
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  className?: string;
  duration?: number;
  reverse?: boolean;
}

const TestimonialsColumn: React.FC<TestimonialsColumnProps> = ({ 
  testimonials, 
  className = '', 
  duration = 20,
  reverse = false
}) => {
  // Create enough copies to ensure seamless looping
  const repeatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <div className={cn("relative shrink-0 w-full sm:w-[350px]", className)}>
      <div 
        className={cn(
          "flex flex-col gap-4",
          reverse ? "animate-scroll-up" : "animate-scroll-down"
        )}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {repeatedTestimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm select-none"
          >
            <div className="absolute top-6 right-6 opacity-10">
              <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>

            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>

            <p className="text-sm sm:text-base text-gray-300 mb-6 relative z-10 leading-relaxed">
              &ldquo;{testimonial.text}&rdquo;
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                <Image src={testimonial.imageSrc} alt={testimonial.name} width={48} height={48} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-semibold text-white truncate">
                  {testimonial.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {testimonial.role} at {testimonial.company}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {testimonial.username}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section className="py-12 relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 border border-white/10 mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-medium text-white">Version 2.0 is here</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 sm:mb-6 px-4">
            What our{' '}
            <span className="bg-linear-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              users say
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            From intuitive design to powerful features, our app has become an essential tool for users around the world.
          </p>
        </div>

        <div 
          className="flex justify-start sm:justify-center gap-4 sm:gap-6 max-h-[600px] sm:max-h-[738px] overflow-hidden pb-4 sm:pb-0 mask-[linear-linear(to_bottom,transparent,black_10%,black_90%,transparent)] pointer-events-none"
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          <TestimonialsColumn 
            testimonials={firstColumn} 
            duration={25}
            reverse={false}
            className="hidden lg:flex"
          />
          <TestimonialsColumn 
            testimonials={secondColumn} 
            duration={30}
            reverse={true}
            className="flex"
          />
          <TestimonialsColumn 
            testimonials={thirdColumn} 
            duration={28}
            reverse={false}
            className="hidden md:flex"
          />
        </div>

      </div>
    </section>
  );
}