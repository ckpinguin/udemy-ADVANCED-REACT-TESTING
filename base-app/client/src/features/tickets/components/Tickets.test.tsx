import { App } from "../../../App"
import { render, screen } from "../../../test-utils"

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
