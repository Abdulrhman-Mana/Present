"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Search,
  FilePresentation,
  Download,
  Loader2,
  RefreshCcw,
  Save,
} from 'lucide-react';
import { TemplateSelector } from '@/components/template-selector';
import { ResearchDisplay } from '@/components/research-display';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PresentationGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('research');
  const [research, setResearch] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [savedPresentations, setSavedPresentations] = useLocalStorage('saved-presentations', []);
  const [audience, setAudience] = useState('general');
  const [duration, setDuration] = useState('15');

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic for your presentation');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: prompt,
          audience,
          duration: parseInt(duration),
        }),
      });

      if (!response.ok) throw new Error('Research generation failed');

      const data = await response.json();
      setResearch(data);
      setStep('template');
      toast.success('Research completed!');
    } catch (error) {
      toast.error('Failed to generate research');
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleGeneratePresentation = async (template) => {
    setStep('generating');
    setLoading(true);
    
    try {
      const response = await fetch('/api/presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          research, 
          template: template.id,
          audience,
          duration: parseInt(duration),
        }),
      });

      if (!response.ok) throw new Error('Presentation generation failed');

      const data = await response.json();
      setPresentation(data);
      
      // Save presentation
      const presentationData = {
        id: Date.now(),
        topic: prompt,
        research,
        template,
        date: new Date().toISOString(),
        pptxBase64: data.pptxBase64,
      };
      setSavedPresentations(prev => [...prev, presentationData]);
      
      // Download PowerPoint
      downloadPresentation(data.pptxBase64);
      toast.success('Presentation generated successfully!');
    } catch (error) {
      toast.error('Failed to generate presentation');
    } finally {
      setLoading(false);
    }
  };

  const downloadPresentation = (base64Data) => {
    const blob = new Blob([Buffer.from(base64Data, 'base64')], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prompt.slice(0, 30)}-presentation.pptx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const regenerateResearch = async () => {
    setStep('research');
    await handleSubmit();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Generate AI Presentation</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your presentation topic or requirements..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <select
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="general">General Audience</option>
                <option value="technical">Technical Professionals</option>
                <option value="executive">Executive/Business</option>
                <option value="academic">Academic/Educational</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Start Research
              </>
            )}
          </Button>
        </div>
      </Card>

      {(loading || research) && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Progress</h3>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </Card>
      )}

      {research && (
        <Tabs value={step} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="research">
              Research Results
            </TabsTrigger>
            <TabsTrigger value="template">
              Choose Template
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="research">
            <ResearchDisplay 
              research={research} 
              onNext={() => setStep('template')}
              onRegenerate={regenerateResearch}
            />
          </TabsContent>
          
          <TabsContent value="template">
            <TemplateSelector 
              onSelect={handleGeneratePresentation}
              savedPresentations={savedPresentations}
              onLoadSaved={(saved) => {
                setPrompt(saved.topic);
                setResearch(saved.research);
                downloadPresentation(saved.pptxBase64);
              }}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}