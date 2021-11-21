import "@testing-library/jest-dom/extend-expect";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { createMemoryHistory } from "history";
import { SnackbarProvider } from "notistack";
import { Router } from "react-router-dom";
import { config } from "../App";
import Login from "../components/Login";

jest.mock("axios");

describe("Login Page", () => {
  const history = createMemoryHistory();

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });

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
          <Login />
        </Router>
      </SnackbarProvider>
    );
  });

  //Login Form Has Heading
  it("should have a Login form title", () => {
    const heading = screen.getByRole("heading", { name: "Login" });
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
  it("should have header with back to explore button", () => {
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

    expect(history.location.pathname).toBe("/");
  });

  it("should have register now link", () => {
    const registerNow = screen.getByRole("link", { name: /register now/i });
    expect(registerNow).toBeInTheDocument();
  });

  it("should throw error if form fields are empty", async () => {
    const inputs = screen.getAllByRole("textbox");
    const usernameInput = inputs.find(
      (input) => input.getAttribute("name").toLowerCase() === "username"
    );

    userEvent.type(usernameInput, "crio.do");

    expect(usernameInput).toHaveValue("crio.do");

    userEvent.click(screen.getByText(/login to qkart/i));

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
  });

  const inputFormAndButtonClick = (req) => {
    const response = {
      data: {
        success: true,
        token: "testtoken",
        username: "crio.do",
        balance: 5000,
      },
      status: 200,
    };

    const promise = Promise.resolve(response);
    axios.post.mockImplementationOnce(() => promise);

    const inputs = screen.getAllByRole("textbox");
    const usernameInput = inputs.find(
      (input) => input.getAttribute("name").toLowerCase() === "username"
    );
    const passwordInput = screen.getByLabelText(/password/i);

    userEvent.type(usernameInput, req.username);
    userEvent.type(passwordInput, req.password);

    expect(usernameInput).toHaveValue(req.username);
    expect(passwordInput).toHaveValue(req.password);

    userEvent.click(screen.getByText(/login to qkart/i));

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
      `${config.endpoint}/auth/login`,
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
    expect(alert).toHaveTextContent(/logged in/i);
  });

  it("should store values in local storage if request succeeds", async () => {
    const request = {
      username: "crio.do",
      password: "learnbydoing",
    };

    const promise = inputFormAndButtonClick(request);

    await act(() => promise);

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(3);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "username",
      "crio.do"
    );
    expect(window.localStorage.setItem).toHaveBeenCalledWith("balance", 5000);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "token",
      "testtoken"
    );
  });

  it("should redirect to products page after success", async () => {
    const request = {
      username: "crio.do",
      password: "learnbydoing",
    };

    const promise = inputFormAndButtonClick(request);

    await act(() => promise);

    expect(history.location.pathname).toBe("/");
  });
});
