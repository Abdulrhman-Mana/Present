import { PresentationGenerator } from '@/components/presentation-generator';
import { ModeToggle } from '@/components/mode-toggle';
import { Presentation } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <Presentation className="h-6 w-6" />
            <span className="text-xl font-bold">PresentAI</span>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </nav>
      <div className="container px-4 py-8">
        <PresentationGenerator />
      </div>
    </main>
  );
}