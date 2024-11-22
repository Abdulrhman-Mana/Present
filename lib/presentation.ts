import pptxgen from "pptxgenjs";

interface Slide {
  type: 'title' | 'content' | 'image' | 'quote';
  title: string;
  content?: string[];
  imageUrl?: string;
}

export async function createPowerPoint(slides: Slide[]) {
  const pres = new pptxgen();

  for (const slide of slides) {
    const pptSlide = pres.addSlide();

    switch (slide.type) {
      case 'title':
        pptSlide.addText(slide.title, {
          x: '10%',
          y: '40%',
          w: '80%',
          fontSize: 44,
          align: 'center',
        });
        break;

      case 'content':
        pptSlide.addText(slide.title, {
          x: '5%',
          y: '5%',
          fontSize: 32,
        });
        
        if (slide.content) {
          pptSlide.addText(slide.content.map(point => `• ${point}`).join('\n'), {
            x: '5%',
            y: '25%',
            w: '90%',
            fontSize: 18,
          });
        }
        break;

      case 'image':
        if (slide.imageUrl) {
          pptSlide.addImage({
            path: slide.imageUrl,
            x: '10%',
            y: '20%',
            w: '80%',
            h: '60%',
          });
        }
        break;
    }
  }

  return pres;
}