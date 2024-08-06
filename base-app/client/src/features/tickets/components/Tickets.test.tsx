import { App } from "../../../App"
import { fireEvent, render, screen } from "../../../test-utils"

test("ticket page shows the band name for the corresponding :showId", async () => {
  render(<App />, {
    routeHistory: ["/tickets/0"],
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
  })

  const heading = await screen.findByRole("heading", {
    name: /avalanche of cheese/i,
  })
  expect(heading).toBeInTheDocument()
})

test('"purchase" button pushes the correct URL', async () => {
  const { history } = render(<App />, {
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
    routeHistory: ["/tickets/0"],
  })

  const purchaseBtn = await screen.findByRole("button", { name: /purchase/i })
  fireEvent.click(purchaseBtn)

  expect(history.location.pathname).toBe("/confirm/0")
  const searchRegex = expect.stringMatching(/holdId=\d+&seatCount=2/)
  expect(history.location.search).toEqual(searchRegex)
})

test("redirects to /tickets/:showId if seatCount is missing", () => {
  const { history } = render(<App />, {
    preloadedState: { user: { userDetails: { email: "test@test.com" } } },
    routeHistory: ["/confirm/0/?holdId=12345"],
  })

  expect(history.location.pathname).toBe("/tickets/0")
})
