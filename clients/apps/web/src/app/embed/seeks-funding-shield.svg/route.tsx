import { SeeksFundingShield } from '@/components/Embed/SeeksFundingShield'
import { getServerSideAPI } from '@/utils/client/serverside'
import { getStorefrontOrNotFound } from '@/utils/storefront'
import { Client, unwrap } from '@polar-sh/client'
const { default: satori } = require('satori')

export const runtime = 'edge'

const getData = async (
  api: Client,
  organizationSlug: string,
  repositoryName: string | undefined,
) => {
  const { organization } = await getStorefrontOrNotFound(api, organizationSlug)

  const {
    pagination: { total_count },
  } = await unwrap(
    api.GET('/v1/issues/', {
      params: {
        query: {
          organization_id: organization.id,
          sorting: ['-funding_goal', '-positive_reactions'],
          is_badged: true,
          ...(repositoryName ? { repository_name: repositoryName } : {}),
        },
      },
    }),
  )
  return total_count
}

const renderBadge = async (count: number) => {
  const inter = await fetch(
    new URL('../../../assets/fonts/Inter-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return await satori(<SeeksFundingShield count={count} />, {
    fonts: [
      {
        name: 'Inter',
        data: inter,
        weight: 500,
        style: 'normal',
      },
    ],
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const org = searchParams.get('org')
  const repo = searchParams.get('repo')

  if (!org) {
    return new Response('No org provided', { status: 400 })
  }

  const api = getServerSideAPI()

  try {
    const data = await getData(api, org, repo || undefined)
    const svg = await renderBadge(data)

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    // Return 1x1 pixel SVG to prevent image-not-found issues in browsers
    return new Response(
      '<svg width="1" height="1" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache',
        },
        status: 400,
      },
    )
  }
}
