"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { FilePresentation, RefreshCcw } from 'lucide-react';

export function ResearchDisplay({ research, onNext, onRegenerate }) {
  if (!research) return null;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">{research.title}</h3>
          <Button variant="outline" onClick={onRegenerate}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {research.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h4 className="text-xl font-semibold mb-4">{section.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="prose dark:prose-invert">
                  <p>{section.content}</p>
                </div>
                {section.imageUrl && (
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={section.imageUrl}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <Button className="w-full" onClick={onNext}>
          <FilePresentation className="mr-2 h-4 w-4" />
          Proceed to Template Selection
        </Button>
      </div>
    </Card>
  );
}