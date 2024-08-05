import { render, screen } from "../../../test-utils"
import { UserProfile } from "./UserProfile"
import { App } from "../../../App"

const testUser = {
  email: "test@test.com",
}

it("should say hi to the user", () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: testUser } },
  })
  expect(screen.getByText(/hi, test@test.com/i)).toBeInTheDocument()
})

it("should redirect to signin if user is falsy", () => {
  const { history } = render(<UserProfile />)
  expect(screen.queryByText(/hi/i)).not.toBeInTheDocument()
  expect(history.location.pathname).toBe("/signin")
})

// Behaviour test
test("view sign-in page when loading profile while not logged in", () => {
  render(<App />, { routeHistory: ["/profile"] })
  const heading = screen.getByRole("heading", {
    name: /Sign in to your account/i,
  })
  expect(heading).toBeInTheDocument()
})
