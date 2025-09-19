import { RoboResponse } from '@robojs/server'
import { logger } from 'robo.js'
import type { RoboRequest } from '@robojs/server'

interface RequestBody {
	code: string
}

/**
 * This API handler is called when `/api/token` is requested by the client.
 * Do this on the backend to keep your Discord Client Secret secure.
 *
 * Learn more:
 * https://robojs.dev/discord-activities/authentication
 */
export default async (req: RoboRequest) => {
	logger.event('Exchanging Discord code for access token')
	const { code } = (await req.json()) as RequestBody

	// Exchange the code for an access_token
	const response = await fetch(`https://discord.com/api/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: process.env.VITE_DISCORD_CLIENT_ID!,
			client_secret: process.env.DISCORD_CLIENT_SECRET!,
			grant_type: 'authorization_code',
			code: code
		})
	})
	const { access_token } = await response.json()
	logger.debug('Access token exchanged', response.ok ? 'successfully ✅' : 'unsuccessfully ❌')

	return RoboResponse.json(
		{ access_token },
		{
			status: response.status
		}
	)
}
