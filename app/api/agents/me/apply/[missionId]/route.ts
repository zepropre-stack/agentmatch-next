import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { missionId: string } }) {
  return new Response('OK')
}
