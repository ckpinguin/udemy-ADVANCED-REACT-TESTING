import { rest } from "msw"

import { showsUrl } from "../features/tickets/redux/showApi"
import { bandUrl } from "../features/band/redux/bandApi"
import { shows, bands } from "../test-utils/fake-data"

export const handlers = [
  rest.get(showsUrl, (req, res, ctx) => {
    return res(ctx.json({ shows }))
  }),
  rest.get(`${bandUrl}/:bandId`, (req, res, ctx) => {
    const { bandId } = req.params // client req params

    return res(ctx.json({ band: bands[bandId] }))
  }),
  rest.get(`${showsUrl}/:showId`, (req, res, ctx) => {
    const { showId } = req.params
    return res(ctx.json({ show: shows[showId] }))
  }),
]
