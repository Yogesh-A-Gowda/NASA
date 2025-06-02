export interface EpicImage {
  image: string;
  caption?: string;
  url: string;
  date: string;
}
export async function fetchEpicImage() {
  const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
  const apiUrl = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();

    if (data.length === 0) throw new Error('No images found');

    const image = data[0];
    const dateStr = image.date.split(' ')[0]; // e.g., "2024-10-05 08:24:19" → "2024-10-05"
    const [year, month, day] = dateStr.split('-');

    return {
      url: `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${image.image}.png?api_key=${NASA_API_KEY}`,
      caption: image.caption,
      date: image.date,
    };
  } catch (error) {
    console.error('Failed to fetch EPIC image:', error);
    return null;
  }
}