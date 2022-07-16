import "@testing-library/jest-dom/extend-expect";
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { createMemoryHistory } from "history";
import { SnackbarProvider } from "notistack";
import { Router } from "react-router-dom";
import { config } from "../App";
import Products from "../components/Products";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const productsResponse = [
  {
    name: "Tan Leatherette Weekender Duffle",
    category: "Fashion",
    cost: 150,
    rating: 4,
    image:
      "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
    _id: "PmInA797xJhMIPti",
  },
  {
    name: "The Minimalist Slim Leather Watch",
    category: "Electronics",
    cost: 60,
    rating: 5,
    image:
      "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/5b478a4a-bf81-467c-964c-1881887799b7.png",
    _id: "TwMM4OAhmK0VQ93S",
  },
];

const cartResponse = [
  {
    productId: "PmInA797xJhMIPti",
    qty: 2,
  },
  {
    productId: "TwMM4OAhmK0VQ93S",
    qty: 1,
  },
];

mock.onGet(`${config.endpoint}/products`).reply(200, productsResponse);
mock.onGet(`${config.endpoint}/cart`).reply(200, cartResponse);

jest.useFakeTimers();

describe("Products Page - Header", () => {
  const history = createMemoryHistory();

  const ProductDOMTree = (history) => (
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      preventDuplicate
    >
      <Router history={history}>
        <Products />
      </Router>
    </SnackbarProvider>
    
  );

  beforeEach(async () => {
    mock.resetHistory();

    // https://github.com/clarkbw/jest-localstorage-mock/issues/125
    jest.clearAllMocks();

    await act(async () => {
      render(ProductDOMTree(history));
    });
  });

  it("should have a header with logo", async () => {
    const images = screen.getAllByRole("img");
    const logo = images.find(
      (img) => img.getAttribute("src") === "logo_dark.svg"
    );
    expect(logo).toBeInTheDocument();
  });

  it("should have login button on Header route to login page when logged out", async () => {
    const loginBtn = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginBtn);

    expect(history.location.pathname).toBe("/login");
  });

  it("should have register button on Header route to register page when logged out", async () => {
    const registerBtn = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerBtn);

    expect(history.location.pathname).toBe("/register");
  });

});

describe("Products Page - Header: Logged in", () => {
  const history = createMemoryHistory();

  const ProductDOMTree = (history) => (
    <SnackbarProvider
      maxSnack={1}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      preventDuplicate
    >
      <Router history={history}>
        <Products />
      </Router>
    </SnackbarProvider>
  );

  beforeEach(async () => {
    jest.clearAllMocks();

    localStorage.setItem("username", "crio.do");
    localStorage.setItem("token", "testtoken");

    await act(async () => {
      render(ProductDOMTree(history));
    });
  });

  it("should have username & avatar in header if logged in", () => {
    const avatar = screen.getByAltText(/crio.do/i);
    const username = screen.getByText(/crio.do/i);
    expect(avatar).toBeInTheDocument();
    expect(username).toBeInTheDocument();
  });

  it("should have logout button in header when logged in", () => {
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  it("logout button should clear localstorage items", async () => {
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    userEvent.click(logoutButton);

    expect(localStorage.getItem("username")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("balance")).toBeNull();
  });
});

