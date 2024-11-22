import { NextResponse } from 'next/server';
import { generateResearch } from '@/lib/ai';
import { searchImages } from '@/lib/search';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    
    // Generate research content
    const research = await generateResearch(topic);
    
    // Add images to each section
    for (const section of research.sections) {
      const imageUrl = await searchImages(section.imagePrompt);
      section.imageUrl = imageUrl;
    }

    return NextResponse.json(research);
  } catch (error) {
    console.error('Research generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate research' },
      { status: 500 }
    );
  }
}