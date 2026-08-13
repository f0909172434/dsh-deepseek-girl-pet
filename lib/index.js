/** Host half: serve the immutable pet atlas through one exact route. */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const ATLAS_PATH = fileURLToPath(new URL('../assets/spritesheet.webp', import.meta.url))

export const name = 'dsh-deepseek-girl-pet'
export const inject = ['webServer']

export function apply(ctx) {
  const route = {
    kind: 'exact',
    path: '/deepseek-girl-pet/spritesheet.webp',
    handler: async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { allow: 'GET, HEAD' })
        res.end()
        return
      }
      const body = await readFile(ATLAS_PATH)
      res.writeHead(200, {
        'cache-control': 'public, max-age=3600, immutable',
        'content-length': String(body.byteLength),
        'content-type': 'image/webp',
      })
      res.end(req.method === 'HEAD' ? undefined : body)
    },
  }
  ctx.effect(() => ctx.webServer.register(route), 'deepseek-pet: atlas route')
}
