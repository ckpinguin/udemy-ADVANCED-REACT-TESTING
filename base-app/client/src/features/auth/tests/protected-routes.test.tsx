import userEvent from "@testing-library/user-event"
import { App } from "../../../App"
import { render, getByRole, screen, waitFor } from "../../../test-utils"
import { baseUrl, endpoints } from "../../../app/axios/constants"
import { server } from "../../../mocks/server"
import {
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from "msw"

test.each([
  { routeName: "Profile", routePath: "/profile" },
  { routeName: "Ticket 0", routePath: "/tickets/0" },
  { routeName: "Confirm 0", routePath: "/confirm/0" },
])("$routeName does redirect to login screen", ({ routePath }) => {
  const { history } = render(<App />, { routeHistory: [routePath] })

  const header = screen.getByRole("heading", { name: /sign/i })
  expect(header).toBeInTheDocument()
  expect(history.location.pathname).toBe("/signin")
})

test.each([
  { testName: "sign in", buttonName: /sign in/i },
  { testName: "sign up", buttonName: /sign up/i },
])("successful $testName flow", async ({ buttonName }) => {
  const { history } = render(<App />, { routeHistory: ["/tickets/1"] })

  // sign up (after redirect)
  const emailField = screen.getByLabelText(/email/i)
  userEvent.type(emailField, "test@test.com")

  const passwordField = screen.getByLabelText(/password/i)
  userEvent.type(passwordField, "pas1234")

  const signInForm = screen.getByTestId("sign-in-form") // workaround having more than 1 sign in buttons
  const signInBtn = getByRole(signInForm, "button", { name: buttonName })
  userEvent.click(signInBtn)

  // redirect back to protected page
  await waitFor(() => {
    expect(history.location.pathname).toBe("/tickets/1")
    expect(history.entries).toHaveLength(1)
  })
})

const signInFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => res(ctx.status(401))
const serverError = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => res(ctx.status(500))
const signUpFailure = (
  req: RestRequest<DefaultRequestBody, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext
) => res(ctx.status(400), ctx.json({ message: "Email is already in use" }))

test.each([
  {
    endpoint: endpoints.signIn,
    outcome: "auth failure",
    responseResolver: signInFailure,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signIn,
    outcome: "signin server error",
    responseResolver: serverError,
    buttonNameRegex: /sign in/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "signup failure",
    responseResolver: signUpFailure,
    buttonNameRegex: /sign up/i,
  },
  {
    endpoint: endpoints.signUp,
    outcome: "signup server error",
    responseResolver: serverError,
    buttonNameRegex: /sign up/i,
  },
])(
  "$outcome on $endpoint followed by success",
  async ({ responseResolver, endpoint, buttonNameRegex }) => {
    const errorHandler = rest.post(`${baseUrl}/${endpoint}`, responseResolver)
    server.resetHandlers(errorHandler)

    const { history } = render(<App />, { routeHistory: ["/tickets/1"] })

    const emailField = screen.getByLabelText(/email/i)
    userEvent.type(emailField, "booking@test.com")

    const passwordField = screen.getByLabelText(/password/i)
    userEvent.type(passwordField, "cheese123")

    const actionForm = screen.getByTestId("sign-in-form")
    const actionBtn = getByRole(actionForm, "button", { name: buttonNameRegex })
    userEvent.click(actionBtn)

    // Reset to standard OK mock responses
    server.resetHandlers()

    // Try to login again, this time it should be successful
    userEvent.click(actionBtn)

    await waitFor(() => {
      expect(history.location.pathname).toBe("/tickets/1")
      expect(history.entries).toHaveLength(1)
    })
  }
)
