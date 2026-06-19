import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse(
    'b06e7218e1a01124400bdafc6dfe2eb03595af0ee8ffd776c64c5976d023d2465ea1f3ccc1dd5211a91943e06d36b7e23db5721a69019712d9b51db6721ee49a',
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  )
}
