"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, User, Loader2, Send } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { aiMedicationInsights } from '@/ai/flows/ai-powered-medication-insights';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDataContext } from '@/context/data-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

type Inputs = {
  query: string;
};

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setFocus } = useForm<Inputs>();
  const { logs } = useDataContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
     // Keep the input focused
    setFocus('query');
  }, [messages, isLoading, setFocus]);

   useEffect(() => {
    // Set initial greeting from the bot
    setMessages([
      {
        role: 'bot',
        content: 'Hello! How can I help you with your medication adherence today?',
      },
    ]);
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!data.query.trim()) return;

    const userMessage: Message = { role: 'user', content: data.query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    reset();

    try {
      const formattedLogs = logs.map(log => ({
        ...log,
        takenAt: log.takenAt.toISOString(),
      }));
      
      const result = await aiMedicationInsights({
        userId: 'user-123',
        query: data.query,
        medicationLogs: formattedLogs,
      });

      const botMessage: Message = { role: 'bot', content: result.insights };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error fetching AI insights:', error);
      const errorMessage: Message = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4 bg-background/50">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto pr-4 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn('flex items-start gap-3', {
                'justify-end': message.role === 'user',
              })}
            >
              {message.role === 'bot' && (
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn('p-3 rounded-lg max-w-lg shadow-md', {
                  'bg-card text-card-foreground': message.role === 'bot',
                  'bg-primary text-primary-foreground': message.role === 'user',
                })}
              >
                <p className="text-base">{message.content}</p>
              </div>
               {message.role === 'user' && (
                <Avatar className="h-8 w-8 bg-accent text-accent-foreground flex-shrink-0">
                   <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
           {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                     <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg max-w-sm bg-card text-card-foreground shadow-md flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Thinking...</span>
                  </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-card border-t shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Textarea
            {...register('query', { required: true })}
            placeholder="Type your question..."
            className="flex-1 resize-none"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading} aria-label="Send message">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
