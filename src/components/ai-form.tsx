"use client";

import { useState } from 'react';
import { Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { aiMedicationInsights } from '@/ai/flows/ai-powered-medication-insights';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDataContext } from '@/context/data-context';

type Inputs = {
  query: string;
};

export function AIForm() {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const { logs } = useDataContext();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setInsight(null);
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
      setInsight(result.insights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setInsight('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Ask Pill Pal AI
          </CardTitle>
          <CardDescription>
            Example: "How have I been doing with my morning doses this week?"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              {...register('query', { required: true })}
              placeholder="Type your question here..."
              className="min-h-[100px] text-base"
              disabled={isLoading}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Get Insights'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {insight && (
        <Card className="mt-6 shadow-lg animate-in fade-in">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              AI Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none text-foreground">
                <p>{insight}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
