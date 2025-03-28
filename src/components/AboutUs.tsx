import React from 'react';
import { GraduationCap, Brain, Target, Bot } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const teamMembers = [
  {
    name: "Dr. Alex Thompson",
    role: "Founder & CEO",
    description: "Former professor with 15+ years in EdTech",
    icon: GraduationCap
  },
  {
    name: "Lisa Wang",
    role: "Head of AI",
    description: "AI researcher specializing in NLP",
    icon: Brain
  },
  {
    name: "Marcus Foster",
    role: "Lead Developer",
    description: "Full-stack developer & UX specialist",
    icon: Target
  }
];

interface AboutUsProps {
  theme: 'light' | 'dark';
}

export function AboutUs({ theme }: AboutUsProps) {
  const { elementRef, isVisible } = useIntersectionObserver();

  return (
    <div 
      ref={elementRef}
      className={`
        transform transition-all duration-1000 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're a passionate team of educators, AI researchers, and developers on a mission to revolutionize learning.
            By combining cutting-edge AI with proven educational methods, we're making studying more efficient,
            engaging, and accessible for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`
                p-6 rounded-xl transition-all duration-500 transform 
                hover:scale-105 hover:shadow-xl
                ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'}
                backdrop-blur-sm shadow-lg
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-all duration-300">
                <member.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 text-center ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {member.name}
              </h3>
              <div className={`text-sm font-medium mb-3 text-center ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {member.role}
              </div>
              <p className={`text-sm text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}