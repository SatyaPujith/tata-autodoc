'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { processVoiceToText, formatIssueWithAI } from '@/lib/ai-processor';
import { commonIssues } from '@/lib/tata-models';

interface IssueFormProps {
  vehicleModel: string;
  onSubmit: (issue: any) => void;
}

export default function IssueForm({ vehicleModel, onSubmit }: IssueFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setIsProcessing(true);
        
        try {
          const transcribedText = await processVoiceToText(audioBlob);
          setIssueText(transcribedText);
          const aiResult = await formatIssueWithAI(transcribedText, vehicleModel);
          setAiSuggestions(aiResult);
        } catch (error) {
          console.error('Voice processing failed:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!issueText.trim()) return;
    
    setIsProcessing(true);
    try {
      const aiResult = await formatIssueWithAI(issueText, vehicleModel);
      setAiSuggestions(aiResult);
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitIssue = async () => {
    const issueData = {
      description: aiSuggestions?.formattedIssue || issueText,
      category: aiSuggestions?.category || selectedCategory,
      severity: aiSuggestions?.severity || 'medium',
      suggestedActions: aiSuggestions?.suggestedActions || [],
      vehicleModel,
      status: 'open',
      createdAt: new Date(),
    };

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });

      if (response.ok) {
        const savedIssue = await response.json();
        onSubmit(savedIssue);
        setIssueText('');
        setAiSuggestions(null);
        setSelectedCategory('');
      }
    } catch (error) {
      console.error('Failed to submit issue:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report New Issue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Describe your issue</Label>
          <div className="flex gap-2 mt-2">
            <Textarea
              placeholder="Describe the issue with your vehicle..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              className="flex-1"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleTextSubmit}
                disabled={!issueText.trim() || isProcessing}
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            Recording... Click stop when done
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI is processing your input...
          </div>
        )}

        <div>
          <Label>Quick Issue Categories</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonIssues.map((issue) => (
              <Badge
                key={issue}
                variant={selectedCategory === issue ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(issue)}
              >
                {issue}
              </Badge>
            ))}
          </div>
        </div>

        {aiSuggestions && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-xs">Formatted Issue:</Label>
                <p className="text-sm">{aiSuggestions.formattedIssue}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label className="text-xs">Category:</Label>
                  <Badge variant="secondary">{aiSuggestions.category}</Badge>
                </div>
                <div>
                  <Label className="text-xs">Severity:</Label>
                  <Badge variant={aiSuggestions.severity === 'high' ? 'destructive' : aiSuggestions.severity === 'medium' ? 'default' : 'secondary'}>
                    {aiSuggestions.severity}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs">Suggested Actions:</Label>
                <ul className="text-xs list-disc list-inside space-y-1">
                  {aiSuggestions.suggestedActions.map((action: string, index: number) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <Button 
          onClick={submitIssue} 
          className="w-full" 
          disabled={!issueText.trim() || isProcessing}
        >
          Submit Issue
        </Button>
      </CardContent>
    </Card>
  );
}