import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FileUpload } from './components/FileUpload';
import { ToolSelector } from './components/ToolSelector';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { TimelineGuide } from './components/TimelineGuide';
import { FAQ } from './components/FAQ';
import { AboutUs } from './components/AboutUs';
import { Reviews } from './components/Reviews';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Bot, Moon, Sun, Sparkles, HelpCircle, BookOpen, Brain, ListChecks, ArrowRight, Home } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useChatStore } from './store/chatStore';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [showTools, setShowTools] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { setInputText, selectedTool, inputText } = useChatStore();
  const [showMainContent, setShowMainContent] = useState(false);

  const tools = [
    {
      id: 'summarize',
      name: 'Summarize',
      icon: BookOpen,
      description: 'Generate concise summaries',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: Brain,
      description: 'Create study flashcards',
      gradient: 'from-pink-500 via-red-500 to-yellow-500',
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: ListChecks,
      description: 'Generate practice questions',
      gradient: 'from-green-400 via-cyan-500 to-blue-500',
    },
  ];

  const handleTextConfirm = () => {
    setShowConfirmation(false);
    setShowTools(true);
  };

  const handleTextInput = (text: string) => {
    setInputText(text);
    setShowConfirmation(true);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const MainContent = () => (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white' 
        : 'bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 text-gray-900'
    }`}>
      <div className={`max-w-6xl mx-auto backdrop-blur-sm min-h-screen shadow-2xl flex flex-col ${
        theme === 'dark' ? 'bg-gray-900/60' : 'bg-white/60'
      }`}>
        {!showMainContent ? (
          <>
            <header className="flex justify-between items-center p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Splan
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => scrollToSection('tutorial-section')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-200'
                      : 'bg-white/60 hover:bg-white/80 text-gray-600'
                  }`}
                >
                  Tutorial
                </button>
                <button
                  onClick={() => scrollToSection('about-section')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-200'
                      : 'bg-white/60 hover:bg-white/80 text-gray-600'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('reviews-section')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-200'
                      : 'bg-white/60 hover:bg-white/80 text-gray-600'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-200'
                      : 'bg-white/60 hover:bg-white/80 text-gray-600'
                  }`}
                >
                  FAQs
                </button>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-yellow-400'
                      : 'bg-white/60 hover:bg-white/80 text-gray-600'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-8 max-w-2xl">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform transition-all duration-700 hover:scale-110 animate-float">
                      <Bot className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-float">
                    Welcome to Splan
                  </h1>
                  
                  <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Your AI-powered study companion that transforms any text into interactive learning materials
                  </p>

                  <button
                    onClick={() => setShowMainContent(true)}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-medium 
                      shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto
                      hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-3 gap-6 mt-16">
                    {tools.map((tool) => (
                      <div
                        key={tool.id}
                        className={`p-6 rounded-xl transition-all duration-300 ${
                          theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'
                        } backdrop-blur-sm shadow-lg hover:shadow-xl group hover:scale-105`}
                      >
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${tool.gradient} 
                          flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 group-hover:text-xl ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {tool.name}
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {tool.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div id="tutorial-section" className="py-16 px-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className={`text-3xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>
                    How to Use Splan
                  </h2>
                  <TimelineGuide theme={theme} />
                </div>
              </div>

              <div className="space-y-16 px-8">
                <div id="about-section">
                  <AboutUs theme={theme} />
                </div>
                <div id="reviews-section">
                  <Reviews theme={theme} />
                </div>
                <div id="faq-section" className="pb-16">
                  <FAQ />
                </div>
              </div>
            </main>
          </>
        ) : (
          <>
            <header className={`flex flex-col items-center gap-4 p-6 border-b ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMainContent(false)}
                    className="flex items-center gap-3 transition-transform hover:scale-105"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Splan
                      </h1>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Study Smart
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMainContent(false)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-200'
                        : 'bg-white/60 hover:bg-white/80 text-gray-600'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-800/60 hover:bg-gray-700/60 text-yellow-400'
                        : 'bg-white/60 hover:bg-white/80 text-gray-600'
                    }`}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-float">
                    Your Learning Assistant
                  </h2>
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-float" />
                </div>
                <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transform any text into interactive study materials
                </p>
              </div>
            </header>
            
            <main className="flex-1 flex flex-col">
              <div id="input-section" className="border-t border-gray-200/50 dark:border-gray-700/50">
                {!showConfirmation && !showTools ? (
                  <div className="flex-1 grid md:grid-cols-2 gap-8 p-8 animate-fade-in">
                    <div className="space-y-4">
                      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Enter Your Text
                      </h2>
                      <textarea
                        className={`w-full h-64 p-4 rounded-xl border-2 transition-all duration-300 resize-none ${
                          theme === 'dark'
                            ? 'bg-gray-800/60 border-gray-700/50 text-gray-200 focus:border-purple-500'
                            : 'bg-white/60 border-gray-200/50 text-gray-800 focus:border-purple-500'
                        }`}
                        placeholder="Paste your study material here..."
                        onChange={(e) => {
                          const text = e.target.value.trim();
                          if (text.length > 0) {
                            handleTextInput(text);
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Upload PDF or Image
                      </h2>
                      <div className="h-64">
                        <FileUpload onFileProcessed={handleTextInput} />
                      </div>
                    </div>
                  </div>
                ) : showConfirmation ? (
                  <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
                    <div className={`max-w-2xl w-full p-6 rounded-xl shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800/60' : 'bg-white/60'
                    } backdrop-blur-sm`}>
                      <h2 className={`text-2xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        Confirm Your Text
                      </h2>
                      <div className={`p-4 rounded-lg mb-6 max-h-60 overflow-y-auto ${
                        theme === 'dark' ? 'bg-gray-700/60 text-gray-300' : 'bg-gray-50/60 text-gray-700'
                      }`}>
                        {inputText}
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gray-700/60 hover:bg-gray-600/60 text-gray-200'
                              : 'bg-gray-100/60 hover:bg-gray-200/60 text-gray-700'
                          }`}
                        >
                          Edit Text
                        </button>
                        <button
                          onClick={handleTextConfirm}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex">
                    <div className={`w-1/4 border-r overflow-y-auto transition-all duration-500 ${
                      theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
                    } ${selectedTool ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                      <ToolSelector />
                    </div>

                    <div className="flex-1 flex flex-col">
                      {!selectedTool ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                          <div className="text-center space-y-8 animate-fade-in">
                            <h2 className={`text-2xl font-bold ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              Choose Your Learning Tool
                            </h2>
                            <div className="grid grid-cols-3 gap-8 max-w-4xl">
                              {tools.map((tool) => (
                                <button
                                  key={tool.id}
                                  onClick={() => useChatStore.getState().setSelectedTool(tool.id)}
                                  className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                                    theme === 'dark' ? 'bg-gray-800/40' : 'bg-white/40'
                                  } backdrop-blur-sm shadow-lg hover:shadow-xl`}
                                >
                                  <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${tool.gradient} 
                                    flex items-center justify-center mb-4 transition-transform duration-300 
                                    group-hover:scale-110 shadow-lg`}>
                                    <tool.icon className="w-8 h-8 text-white" />
                                  </div>
                                  <div className={`text-lg font-semibold mb-2 transition-all duration-300 group-hover:text-xl ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                  }`}>
                                    {tool.name}
                                  </div>
                                  <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {tool.description}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 overflow-y-auto">
                            <ChatWindow />
                          </div>
                          <ChatInput />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;