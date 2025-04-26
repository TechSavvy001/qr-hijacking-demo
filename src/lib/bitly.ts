// lib/bitly.ts
export async function fetchBitlyData(bitlink: string) {
    const BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN;
  
    if (!BITLY_ACCESS_TOKEN) {
      throw new Error('BITLY_ACCESS_TOKEN not set');
    }
  
    const url = `https://api-ssl.bitly.com/v4/bitlinks/${bitlink}/clicks/summary`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Bitly API Error:', errorData);
      throw new Error('Failed to fetch Bitly data');
    }
  
    const data = await response.json();
    return data;
  }
  