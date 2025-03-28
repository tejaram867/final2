import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-accent-50 via-primary-50/30 to-success-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8 glass-card rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-success-500 flex items-center justify-center shadow-glow-accent mb-4 transform hover:scale-110 transition-all duration-300">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-600 via-primary-500 to-success-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join us and start your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 rounded-xl"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 rounded-xl"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-12 py-2 rounded-xl"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-accent-600 shadow-sm focus:border-accent-300 focus:ring focus:ring-accent-200 focus:ring-opacity-50"
              required
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I agree to the{' '}
              <Link
                to="/terms"
                className="text-accent-600 hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-accent-600 hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Privacy Policy
              </Link>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent-500 to-success-500 hover:from-accent-600 hover:to-success-600 text-white font-medium py-2 px-4 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-glow-accent"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-accent-600 hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}