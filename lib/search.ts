const SERPER_API_KEY = process.env.SERPER_API_KEY;

export async function searchImages(query: string): Promise<string> {
  const response = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: 1,
    }),
  });

  const data = await response.json();
  return data.images?.[0]?.imageUrl || '';
}