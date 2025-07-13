'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your intelligent Tata vehicle assistant powered by advanced AI. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const commonResponses = {
    'maintenance': 'For optimal performance, I recommend following the Tata service schedule. Your vehicle should be serviced every 10,000 km or 6 months. Would you like me to check your specific model\'s requirements?',
    'warranty': 'Tata vehicles come with comprehensive warranty coverage. I can help you check your warranty status and coverage details. Please share your vehicle registration number.',
    'service center': 'I can locate the nearest authorized Tata service center for you. Please share your current location or preferred area.',
    'emergency': 'For emergency roadside assistance, please call Tata Motors 24/7 helpline: 1800-209-7979. I can also guide you through basic troubleshooting steps.',
    'default': 'I\'m here to assist with vehicle maintenance, service schedules, troubleshooting, warranty information, and connecting you with service centers. What specific help do you need today?'
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('maintenance') || message.includes('service')) {
      return commonResponses.maintenance;
    }
    if (message.includes('warranty') || message.includes('guarantee')) {
      return commonResponses.warranty;
    }
    if (message.includes('service center') || message.includes('mechanic') || message.includes('repair')) {
      return commonResponses['service center'];
    }
    if (message.includes('emergency') || message.includes('breakdown') || message.includes('help')) {
      return commonResponses.emergency;
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m your AI-powered Tata assistant. I can help with maintenance schedules, troubleshooting, service centers, and warranty information. What would you like to know?';
    }
    if (message.includes('thank')) {
      return 'You\'re welcome! I\'m always here to help with your Tata vehicle needs. Feel free to ask me anything else!';
    }
    
    return commonResponses.default;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-100 shadow-xl">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Tata AI Assistant</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <p className="text-xs text-blue-100 font-normal">Powered by Advanced AI</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="w-8 h-8 border-2 border-blue-200">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="w-8 h-8 border-2 border-purple-200">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 text-sm border border-gray-200 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-gray-500 text-xs">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-gray-50/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              placeholder="Ask me about your Tata vehicle..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-white/80 backdrop-blur-sm"
              disabled={isTyping}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl px-6 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI-powered assistance for your Tata vehicle
          </p>
        </div>
      </CardContent>
    </Card>
  );
}