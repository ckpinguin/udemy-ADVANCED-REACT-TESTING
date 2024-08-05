import { render, screen } from "@testing-library/react"

import { UserProfile } from "./UserProfile"

it("should say hi to the user", () => {
  render(<UserProfile />)
  expect(screen.getByText(/hi/i)).toBeInTheDocument()
})
