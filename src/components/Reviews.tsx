import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Graduate Student",
    content: "Splan has revolutionized my study routine. The flashcard feature is incredibly effective for memorization.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Medical Student",
    content: "The quiz generation tool helps me prepare for exams efficiently. It's like having a personal tutor.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Undergraduate",
    content: "The summary feature saves me so much time when reviewing lengthy research papers.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

interface ReviewsProps {
  theme: 'light' | 'dark';
}

export function Reviews({ theme }: ReviewsProps) {
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`
                p-6 rounded-xl transition-all duration-500 transform
                hover:scale-105 hover:shadow-xl
                ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'}
                backdrop-blur-sm shadow-lg
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-6">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full mr-4 border-2 border-amber-200 dark:border-amber-800"
                />
                <div>
                  <h3 className={`font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {review.name}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {review.role}
                  </p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                "{review.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}