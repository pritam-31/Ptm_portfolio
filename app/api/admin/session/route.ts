import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET() {
  const loggedIn = await getAdminSession()
  return NextResponse.json({ loggedIn })
}
