import React, { useState } from 'react';
import { Bot, User, FileText, Trash2, ChevronDown, ChevronUp, Copy, FolderOpen, RotateCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '../types';
import { useChatStore } from '../store/chatStore';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const isBot = message.role === 'assistant';
  const isFile = message.type === 'file';
  const removeMessage = useChatStore((state) => state.removeMessage);
  const selectedTool = useChatStore((state) => state.selectedTool);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF();
      let yOffset = 10;
      const lineHeight = 7;
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.width - 2 * margin;

      const addText = (text: string) => {
        const lines = text.split('\n');
        lines.forEach(line => {
          if (line.startsWith('#')) {
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            yOffset += lineHeight;
          } else if (line.startsWith('###')) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            yOffset += lineHeight;
          } else {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
          }

          if (yOffset > pdf.internal.pageSize.height - margin) {
            pdf.addPage();
            yOffset = margin;
          }

          const words = line.split(' ');
          let currentLine = '';
          words.forEach(word => {
            const testLine = currentLine + ' ' + word;
            const testWidth = pdf.getStringUnitWidth(testLine) * pdf.getFontSize();
            if (testWidth > pageWidth) {
              pdf.text(currentLine, margin, yOffset);
              yOffset += lineHeight;
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
          
          if (currentLine.trim()) {
            pdf.text(currentLine.trim(), margin, yOffset);
            yOffset += lineHeight;
          }
        });
        yOffset += lineHeight;
      };

      addText(message.content);
      
      const fileName = `${selectedTool}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getToolColor = () => {
    switch (selectedTool) {
      case 'summarize': return 'from-blue-50/50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30';
      case 'flashcards': return 'from-purple-50/50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/30';
      case 'quiz': return 'from-green-50/50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/30';
      default: return 'from-gray-50/50 to-gray-100/50 dark:from-gray-950/30 dark:to-gray-900/30';
    }
  };

  const getToolAccentColor = () => {
    switch (selectedTool) {
      case 'summarize': return 'text-blue-600 dark:text-blue-400';
      case 'flashcards': return 'text-purple-600 dark:text-purple-400';
      case 'quiz': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const extractTopics = (content: string): string[] => {
    const topics = new Set<string>();
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.startsWith('### Topic:')) {
        topics.add(line.replace('### Topic:', '').trim());
      }
    });
    
    return Array.from(topics);
  };

  const extractFlashcards = (content: string): { front: string; back: string }[] => {
    const cards: { front: string; back: string }[] = [];
    const lines = content.split('\n');
    let currentFront = '';
    let currentBack = '';

    lines.forEach(line => {
      if (line.startsWith('**Front:**')) {
        currentFront = line.replace('**Front:**', '').trim();
      } else if (line.startsWith('**Back:**')) {
        currentBack = line.replace('**Back:**', '').trim();
        if (currentFront && currentBack) {
          cards.push({ front: currentFront, back: currentBack });
          currentFront = '';
          currentBack = '';
        }
      }
    });

    return cards;
  };

  const extractQuizQuestions = (content: string): {
    question: string;
    options?: string[];
    answer: string;
  }[] => {
    const questions: { question: string; options?: string[]; answer: string }[] = [];
    const sections = content.split('### Question');
    
    sections.slice(1).forEach(section => {
      const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
      const question = lines[0].replace(/^\d+/, '').trim();
      const answerLine = lines.find(line => line.startsWith('**Correct Answer:**') || line.startsWith('**Answer:**'));
      const answer = answerLine?.replace(/\*\*(Correct )?Answer:\*\*/, '').trim() || '';
      
      const options = lines
        .filter(line => /^[a-z]\)/.test(line))
        .map(line => line.replace(/^[a-z]\)/, '').trim());

      questions.push({
        question,
        options: options.length > 0 ? options : undefined,
        answer
      });
    });

    return questions;
  };

  const filterContentByTopic = (content: string, topic: string | null) => {
    if (!topic) return content;
    
    const sections = content.split('---');
    return sections
      .filter(section => section.includes(`### Topic: ${topic}`))
      .join('---');
  };

  const topics = isBot && selectedTool === 'flashcards' ? extractTopics(message.content) : [];
  const flashcards = isBot && selectedTool === 'flashcards' ? extractFlashcards(message.content) : [];
  const quizQuestions = isBot && selectedTool === 'quiz' ? extractQuizQuestions(message.content) : [];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 200);
  };

  const renderContent = () => {
    if (selectedTool === 'flashcards' && flashcards.length > 0) {
      return (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center mb-4">
            <h2 className={`text-xl font-semibold ${getToolAccentColor()}`}>
              Flashcard {currentCard + 1} of {flashcards.length}
            </h2>
          </div>

          <motion.div
            className={`
              w-full max-w-2xl aspect-[3/2] perspective-1000
              cursor-pointer transition-transform duration-500
              ${isFlipped ? 'rotate-y-180' : ''}
            `}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="relative w-full h-full">
              <div
                className={`
                  absolute inset-0 backface-hidden
                  ${isFlipped ? 'opacity-0' : 'opacity-100'}
                  bg-white dark:bg-gray-800 rounded-xl p-8
                  flex items-center justify-center text-center
                  shadow-lg transform transition-all duration-500
                `}
              >
                <p className="text-xl text-gray-800 dark:text-gray-200">
                  {flashcards[currentCard].front}
                </p>
              </div>
              <div
                className={`
                  absolute inset-0 backface-hidden
                  ${isFlipped ? 'opacity-100 rotate-y-180' : 'opacity-0'}
                  bg-purple-100 dark:bg-purple-900 rounded-xl p-8
                  flex items-center justify-center text-center
                  shadow-lg transform transition-all duration-500
                `}
              >
                <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
                  {flashcards[currentCard].back}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevCard}
              className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextCard}
              className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      );
    } else if (selectedTool === 'quiz' && quizQuestions.length > 0) {
      return (
        <div className="space-y-8">
          {quizQuestions.map((q, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Question {idx + 1}
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{q.question}</p>
              
              {q.options ? (
                <div className="space-y-3">
                  {q.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        setSelectedAnswers(prev => ({ ...prev, [idx]: option }));
                        setShowAnswers(prev => ({ ...prev, [idx]: true }));
                      }}
                      className={`
                        w-full p-4 rounded-lg text-left transition-all duration-300
                        ${selectedAnswers[idx] === option
                          ? showAnswers[idx]
                            ? option === q.answer
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your answer"
                    className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget.value;
                        setSelectedAnswers(prev => ({ ...prev, [idx]: input }));
                        setShowAnswers(prev => ({ ...prev, [idx]: true }));
                      }
                    }}
                  />
                </div>
              )}

              {showAnswers[idx] && (
                <div className={`
                  mt-4 p-4 rounded-lg
                  ${selectedAnswers[idx] === q.answer
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }
                `}>
                  <p className="font-medium">
                    {selectedAnswers[idx] === q.answer ? 'Correct!' : 'Incorrect!'}
                  </p>
                  <p>The correct answer is: {q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className={`text-3xl font-bold mb-6 pb-3 border-b ${
                selectedTool === 'summarize' ? 'text-blue-800 border-blue-200 dark:text-blue-300 dark:border-blue-800' :
                selectedTool === 'flashcards' ? 'text-purple-800 border-purple-200 dark:text-purple-300 dark:border-purple-800' :
                'text-green-800 border-green-200 dark:text-green-300 dark:border-green-800'
              }`}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{children}</h2>
            ),
            h3: ({ children }) => {
              const text = children as string;
              if (text.startsWith('Topic:')) {
                return (
                  <h3 className={`text-xl font-medium mb-4 ${getToolAccentColor()} 
                    bg-opacity-10 px-4 py-2 rounded-lg inline-block
                    ${selectedTool === 'summarize' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      selectedTool === 'flashcards' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-green-100 dark:bg-green-900/30'}`}
                  >
                    {text.replace('Topic:', '').trim()}
                  </h3>
                );
              }
              return (
                <h3 className={`text-xl font-medium mb-4 ${getToolAccentColor()}`}>
                  {children}
                </h3>
              );
            },
            p: ({ children }) => {
              const text = children as string;
              if (typeof text === 'string' && text.includes('CRITICAL:')) {
                return (
                  <p className="text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4 shadow-sm">
                    {text}
                  </p>
                );
              }
              if (typeof text === 'string' && text.includes('HIGHLIGHT:')) {
                return (
                  <p className="text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4 shadow-sm">
                    {text}
                  </p>
                );
              }
              return (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {children}
                </p>
              );
            },
            ul: ({ children }) => (
              <ul className="space-y-3 mb-6">{children}</ul>
            ),
            li: ({ children }) => {
              const text = children as string;
              let bgColor = '';
              let textColor = '';
              let borderColor = '';
              
              if (typeof text === 'string') {
                if (text.includes('CRITICAL:')) {
                  bgColor = 'bg-red-50 dark:bg-red-900/20';
                  textColor = 'text-red-700 dark:text-red-300';
                  borderColor = 'border-red-200 dark:border-red-800';
                } else if (text.includes('HIGHLIGHT:')) {
                  bgColor = 'bg-yellow-50 dark:bg-yellow-900/20';
                  textColor = 'text-yellow-700 dark:text-yellow-300';
                  borderColor = 'border-yellow-200 dark:border-yellow-800';
                } else if (text.includes('IMPORTANT:')) {
                  bgColor = 'bg-blue-50 dark:bg-blue-900/20';
                  textColor = 'text-blue-700 dark:text-blue-300';
                  borderColor = 'border-blue-200 dark:border-blue-800';
                }
              }
              
              return (
                <li className={`flex items-start gap-3 ${bgColor} ${textColor} rounded-lg p-4 border ${borderColor} shadow-sm`}>
                  <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    selectedTool === 'summarize' ? 'bg-blue-500 dark:bg-blue-400' :
                    selectedTool === 'flashcards' ? 'bg-purple-500 dark:bg-purple-400' :
                    'bg-green-500 dark:bg-green-400'
                  }`} />
                  <span className="flex-1">{children}</span>
                </li>
              );
            },
            hr: () => (
              <hr className={`my-8 border-t-2 ${
                selectedTool === 'summarize' ? 'border-blue-100 dark:border-blue-900/30' :
                selectedTool === 'flashcards' ? 'border-purple-100 dark:border-purple-900/30' :
                'border-green-100 dark:border-green-900/30'
              }`} />
            ),
            strong: ({ children }) => (
              <strong className={`font-bold ${getToolAccentColor()}`}>
                {children}
              </strong>
            ),
          }}
        >
          {selectedTool === 'flashcards' ? filterContentByTopic(message.content, selectedTopic) : message.content}
        </ReactMarkdown>
      );
    }
  };

  return (
    <div className={`
      message-animation relative group p-6
      ${isBot ? `bg-gradient-to-r ${getToolColor()}` : 'bg-white/50 dark:bg-gray-800/50'}
      hover:shadow-lg transition-all duration-300 ease-in-out
      border-b border-gray-100 dark:border-gray-800
    `}>
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isBot && (
          <>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 tooltip-container"
            >
              <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className="tooltip">
                {copied ? 'Copied!' : 'Copy content'}
              </span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 tooltip-container"
            >
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="tooltip">Download PDF</span>
            </button>
          </>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 tooltip-container"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="tooltip">Collapse</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="tooltip">Expand</span>
            </>
          )}
        </button>
        <button
          onClick={() => removeMessage(message.id!)}
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 tooltip-container"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span className="tooltip">Delete message</span>
        </button>
      </div>

      <div className="flex gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center shrink-0
          ${isBot
            ? `bg-gradient-to-br ${
                selectedTool === 'summarize' ? 'from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/50' :
                selectedTool === 'flashcards' ? 'from-purple-500 to-purple-600 shadow-purple-200 dark:shadow-purple-900/50' :
                'from-green-500 to-green-600 shadow-green-200 dark:shadow-green-900/50'
              } text-white shadow-lg`
            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300'
          }
          transform transition-transform duration-300 group-hover:scale-110
        `}>
          {isBot ? <Bot className="w-7 h-7" /> : <User className="w-7 h-7" />}
        </div>

        <div className="flex-1 space-y-4 pr-20">
          {isFile && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-lg inline-block">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{message.fileName}</span>
            </div>
          )}

          {isBot && selectedTool === 'flashcards' && topics.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className={`w-5 h-5 ${getToolAccentColor()}`} />
                <span className="font-medium text-gray-700 dark:text-gray-300">Topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedTopic === null
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/50'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}
                >
                  All Topics
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedTopic === topic
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/50'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className={`prose prose-lg max-w-none transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-50 max-h-20 overflow-hidden'
          }`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}