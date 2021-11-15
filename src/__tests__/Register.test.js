import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { createMemoryHistory } from "history";
import { SnackbarProvider } from "notistack";
import { Route, Router } from "react-router";
import { config } from "../App";
import Register from "../components/Register";

jest.mock("axios");

describe("Register Page", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });

    const history = createMemoryHistory();

    render(
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        preventDuplicate
      >
        <Router history={history}>
          <Register />
          <Route path="/login">
            <p>Login Page Mock</p>
          </Route>
          <Route path="/">
            <p>Products Page Mock</p>
          </Route>
        </Router>
      </SnackbarProvider>
    );
  });

  //Login Form Has Heading
  it("should have a Register form title", () => {
    const heading = screen.getByRole("heading", { name: "Register" });
    expect(heading).toBeInTheDocument();
  });

  it("should have a header has logo with Link", () => {
    const images = screen.getAllByRole("img");
    const logo = images.find(
      (img) => img.getAttribute("src") === "logo_dark.svg"
    );
    expect(logo).toBeInTheDocument();
  });

  //Header has back to explore button
  it("should have header with 'back to explore' button", () => {
    const exploreButton = screen.getByRole("button", {
      name: /back to explore/i,
    });
    expect(exploreButton).toBeInTheDocument();
  });

  it("'back to explore' button should route to products", async () => {
    const exploreButton = screen.getByRole("button", {
      name: /back to explore/i,
    });
    userEvent.click(exploreButton);

    const productPage = await screen.findByText(/products page mock/i);
    expect(productPage).toBeInTheDocument();
  });

  it("should have 'login here' link", () => {
    const loginHere = screen.getByRole("link", { name: /login/i });
    expect(loginHere).toBeInTheDocument();
  });

  it("should throw error if username empty", async () => {
    const [passwordInput] = screen.getAllByLabelText(/password/i);

    userEvent.type(passwordInput, "learnbydoing");

    expect(passwordInput).toHaveValue("learnbydoing");

    userEvent.click(screen.getByRole("button", { name: /register/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/required/i);
  });

  it("should throw error if password empty", async () => {
    const usernameInput = screen.getByLabelText(/username/i);

    userEvent.type(usernameInput, "crio.do");

    expect(usernameInput).toHaveValue("crio.do");

    userEvent.click(screen.getByRole("button", { name: /register/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/required/i);
  });

  it("should throw error if password or username < 6 chars long", async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const [passwordInput] = screen.getAllByLabelText(/password/i);

    userEvent.type(usernameInput, "kwe");
    userEvent.type(passwordInput, "lea");

    userEvent.click(screen.getByRole("button", { name: /register/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/6/i);
  });

  it("should throw error if password and confirm password are not same", async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const [passwordInput, confirmPassword] =
      screen.getAllByLabelText(/password/i);

    userEvent.type(usernameInput, "crio.do");
    userEvent.type(passwordInput, "Hello!Password");
    userEvent.type(confirmPassword, "Password");

    userEvent.click(screen.getByRole("button", { name: /register/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/do not match/i);
  });

  const inputFormAndButtonClick = (req) => {
    const response = {
      data: {
        success: true,
      },
      status: 200,
    };

    const promise = Promise.resolve(response);
    axios.post.mockImplementationOnce(() => promise);

    const usernameInput = screen.getByLabelText(/username/i);
    const [passwordInput, confirmPassword] =
      screen.getAllByLabelText(/password/i);

    userEvent.type(usernameInput, req.username);
    userEvent.type(passwordInput, req.password);
    userEvent.type(confirmPassword, req.password);

    expect(usernameInput).toHaveValue(req.username);
    expect(passwordInput).toHaveValue(req.password);
    expect(confirmPassword).toHaveValue(req.password);

    userEvent.click(screen.getByRole("button", { name: /register/i }));

    return promise;
  };

  it("should send a POST request with axios", async () => {
    const request = {
      username: "crio.do",
      password: "learnbydoing",
    };

    const promise = inputFormAndButtonClick(request);

    //Waiting for the promise to be resolved before actually testing it.
    //Ref: https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    await act(() => promise);

    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("should send a POST request to server with correct arguments", async () => {
    const request = {
      username: "crio.do",
      password: "learnbydoing",
    };

    const promise = inputFormAndButtonClick(request);

    //Waiting for the promise to be resolved before actually testing it.
    //Ref: https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
    await act(() => promise);

    expect(axios.post).toHaveBeenCalledWith(
      `${config.endpoint}/auth/register`,
      request
    );
  });

  it("should show success alert if request succeeds", async () => {
    const request = {
      username: "crio.do",
      password: "learnbydoing",
    };

    const promise = inputFormAndButtonClick(request);

    await act(() => promise);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/success/i);
  });

});
