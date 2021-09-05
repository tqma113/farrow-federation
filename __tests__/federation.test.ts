import { Http } from 'farrow-http'
import { service as foo } from './fixtures/foo'
import { service as bar } from './fixtures/bar'
import { services as baz } from './fixtures/baz'
import { createFederationServices } from '../src'
import supertest, { Response } from 'supertest'

describe('farrow-federation', () => {
  const http = Http()

  http.route('/foo').use(foo)
  http.route('/bar').use(bar)
  http.use(baz)

  it('base usage', async () => {
    const federationService = await createFederationServices(
      [
        {
          url: '/foo',
          namespace: 'foo',
        },
        {
          url: '/bar',
          namespace: 'bar',
        },
        {
          url: '/greet',
          namespace: 'greet',
        },
        {
          url: '/todo',
          namespace: 'todo',
        },
      ],
      {
        // @ts-ignore
        fetch: async (input, init) => {
          const getRes = () =>
            new Promise<Response>((resolve) =>
              supertest(http.server())
                .post(input as string)
                .send(JSON.parse(init!.body! as any))
                .then(resolve),
            )
          const res = await getRes()
          return {
            json() {
              return JSON.parse(res.text)
            },
          }
        },
      },
    )

    const server = Http()

    server.use(federationService)

    const res = await supertest(server.handle).post('/').send({
      type: 'Introspection',
    })

    expect(res.body).toMatchSnapshot()
  })
})
