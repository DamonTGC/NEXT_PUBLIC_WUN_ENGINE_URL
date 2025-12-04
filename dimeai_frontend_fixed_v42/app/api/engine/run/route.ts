import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_WUN_ENGINE_URL || 'https://wun-engine-production.up.railway.app';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const prompt = url.searchParams.get('prompt') || '';

    const res = await fetch(`${BASE_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      console.error('WUN Engine /run error', res.status);
      return NextResponse.json({ error: 'Engine error' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Engine route exception', err);
    return NextResponse.json({ error: 'Engine exception' }, { status: 500 });
  }
}
