import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 })
  }

  // Hotlinking / Origin Protection:
  // Validate referer or origin header
  const referer = req.headers.get('referer')
  const host = req.headers.get('host')

  if (process.env.NODE_ENV === 'production' && referer) {
    try {
      const refererUrl = new URL(referer)
      const hostWithoutPort = host?.split(':')[0] || ''
      const refererHostWithoutPort = refererUrl.hostname || ''
      
      // Allow same domain (ignore port differences in development)
      if (hostWithoutPort && refererHostWithoutPort && !refererHostWithoutPort.includes(hostWithoutPort)) {
        return new NextResponse('Forbidden: Hotlinking is not allowed', { status: 403 })
      }
    } catch {
      // Invalid referer format, but don't block — just skip check
    }
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'OSIS-Web-Image-Proxy',
      },
    })

    if (!response.ok) {
      return new NextResponse('Failed to fetch image', { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        // Instruct browser not to offer direct download easily
        'Content-Disposition': 'inline',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
