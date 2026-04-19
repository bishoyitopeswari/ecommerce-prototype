import { HttpResponse, http } from 'msw'
import { dummyCredentials, tokenFixture, userFixture } from '../data/users'

type LoginBody = {
  username: string
  password: string
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginBody

    if (
      body.username !== dummyCredentials.username ||
      body.password !== dummyCredentials.password
    ) {
      return HttpResponse.json(
        {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid username or password.',
          details: null,
        },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      token: tokenFixture,
      user: userFixture,
    })
  }),
]
