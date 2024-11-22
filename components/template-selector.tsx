"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { FilePresentation, History, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design with bold typography',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and dynamic layout for engaging presentations',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional and sophisticated design for business presentations',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design focusing on content',
    thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal layout perfect for educational presentations',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
  },
];

export function TemplateSelector({ onSelect, savedPresentations, onLoadSaved }) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Choose a Template</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Presentation History</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {savedPresentations.map((saved) => (
                  <Card key={saved.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{saved.topic}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(saved.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onLoadSaved(saved)}
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <Button
                onClick={() => onSelect(template)}
                className="w-full"
                variant="secondary"
              >
                Use Template
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}