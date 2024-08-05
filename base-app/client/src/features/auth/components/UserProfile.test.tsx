import { render, screen } from "../../../test-utils"
import { UserProfile } from "./UserProfile"

const testUser = {
  email: "test@test.com",
}

it("should say hi to the user", () => {
  render(<UserProfile />, {
    preloadedState: { user: { userDetails: testUser } },
  })
  expect(screen.getByText(/hi, test@test.com/i)).toBeInTheDocument()
})

it("should redirect if user is falsy", () => {
  render(<UserProfile />)
  expect(screen.queryByText(/hi/i)).not.toBeInTheDocument()
})
