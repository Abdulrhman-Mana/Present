import { NextResponse } from 'next/server';
import { generatePresentation } from '@/lib/ai';
import { searchImages } from '@/lib/search';
import { createPowerPoint } from '@/lib/presentation';

export async function POST(req: Request) {
  try {
    const { research, template } = await req.json();
    
    // Generate presentation structure
    const presentation = await generatePresentation(research, template);
    
    // Add images to slides
    for (const slide of presentation.slides) {
      if (slide.imagePrompt) {
        slide.imageUrl = await searchImages(slide.imagePrompt);
      }
    }
    
    // Generate PowerPoint
    const pptx = await createPowerPoint(presentation.slides);
    const buffer = await pptx.write('base64');
    
    return NextResponse.json({ 
      presentation,
      pptxBase64: buffer
    });
  } catch (error) {
    console.error('Presentation generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate presentation' },
      { status: 500 }
    );
  }
}