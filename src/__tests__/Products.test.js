import "@testing-library/jest-dom/extend-expect";
import {
  act,
  render,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { createMemoryHistory } from "history";
import { SnackbarProvider } from "notistack";
import { Router } from "react-router-dom";
import { config } from "../App";
import Products from "../components/Products";

jest.mock("axios");
jest.useFakeTimers();

describe("Products Page", () => {
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
    // https://github.com/clarkbw/jest-localstorage-mock/issues/125
    jest.clearAllMocks();

    const response = {
      data: [
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
      ],
      status: 200,
    };

    const promise = Promise.resolve(response);
    axios.get.mockImplementationOnce(() => promise);

    await act(() => promise);

    act(() => {
      render(ProductDOMTree(history));
    });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should have a header has logo with Link", async () => {
    const images = screen.getAllByRole("img");
    const logo = images.find(
      (img) => img.getAttribute("src") === "logo_dark.svg"
    );
    expect(logo).toBeInTheDocument();
  });

  it("should have login button route to login page", async () => {
    const loginBtn = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginBtn);

    expect(history.location.pathname).toBe("/login");
  });

  it("should have register button route to register page", async () => {
    const registerBtn = screen.getByRole("button", { name: /register/i });
    userEvent.click(registerBtn);

    expect(history.location.pathname).toBe("/register");
  });

  it("should have a search bar", () => {
    const searchInput = screen.getAllByPlaceholderText(/search/i)[0];
    expect(searchInput).toBeInTheDocument();
  });

  it("shows items on the products page load", async () => {
    expect(axios.get).toHaveBeenCalledTimes(1);

    const addToCartBtn = screen.queryAllByRole("button", {
      name: /add to cart/i,
    });
    const cardImages = screen
      .queryAllByRole("img")
      .map((image) => image.getAttribute("src"))
      .filter((src) => src !== null)
      .filter((src) => src.match(/https/i));
    const stars = screen
      .queryAllByRole("img")
      .map((img) => img.getAttribute("aria-label"))
      .filter((label) => label !== null)
      .filter((label) => label.match(/stars/i));

    expect(stars.length).toBeGreaterThanOrEqual(2);
    expect(cardImages.length).toBeGreaterThanOrEqual(2);
    expect(addToCartBtn.length).toBeGreaterThanOrEqual(2);
  });

  it("should make a GET request to search", async () => {
    const response = {
      data: [
        {
          name: "YONEX Smash Badminton Racquet",
          category: "Sports",
          cost: 100,
          rating: 5,
          image:
            "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/64b930f7-3c82-4a29-a433-dbc6f1493578.png",
          _id: "KCRwjF7lN97HnEaY",
        },
      ],
      status: 200,
    };

    const promise = Promise.resolve(response);
    axios.get.mockImplementationOnce(() => promise);

    const search = screen.getAllByPlaceholderText(/search/i)[0];

    userEvent.type(search, "smash");

    expect(search).toHaveValue("smash");

    jest.runAllTimers();
    await act(() => promise);

    expect(axios.get).toHaveBeenCalledWith(
      `${config.endpoint}/products/search?value=smash`
    );
  });

  it("should show all products if search empty", async () => {
    const search = screen.getAllByPlaceholderText(/search/i)[0];

    userEvent.type(search, "");

    jest.runAllTimers();

    const addToCartBtn = screen.queryAllByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCartBtn.length).toBeGreaterThanOrEqual(2);
  });

  it("should show matching products if found", async () => {
    const response = {
      data: [
        {
          name: "YONEX Smash Badminton Racquet",
          category: "Sports",
          cost: 100,
          rating: 5,
          image:
            "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/64b930f7-3c82-4a29-a433-dbc6f1493578.png",
          _id: "KCRwjF7lN97HnEaY",
        },
      ],
      status: 200,
    };

    const promise = Promise.resolve(response);
    axios.get.mockImplementationOnce(() => promise);

    const search = screen.getAllByPlaceholderText(/search/i)[0];

    userEvent.type(search, "smash");

    jest.runAllTimers();
    await act(() => promise);

    const text = screen.getByText(/YONEX Smash Badminton Racquet/);
    const addToCartBtn = screen.queryAllByRole("button", {
      name: /add to cart/i,
    });

    expect(text).toBeInTheDocument();
    expect(addToCartBtn.length).toEqual(1);
  });

  it("should 'No Products Found' if search string does get any items", async () => {
    const response = {
      data: [],
      status: 400,
    };

    const promise = Promise.resolve(response);
    axios.get.mockImplementationOnce(() => promise);

    const search = screen.getAllByPlaceholderText(/search/i)[0];

    userEvent.type(search, "smasher");

    jest.runAllTimers();
    await act(() => promise);

    const text = screen.getByText(/No products found/i);
    const addToCartBtn = screen.queryAllByRole("button", {
      name: /add to cart/i,
    });

    expect(text).toBeInTheDocument();
    expect(addToCartBtn.length).toEqual(0);
  });

  it("updates search items as search string updates", async () => {
    const response1 = {
      data: [
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
      ],
      status: 200,
    };

    const promise1 = Promise.resolve(response1);
    axios.get.mockImplementationOnce(() => promise1);

    const search = screen.getAllByPlaceholderText(/search/i)[0];

    userEvent.type(search, "leather");

    jest.runAllTimers();
    await act(() => promise1);

    const addToCartBtn = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    expect(addToCartBtn.length).toEqual(2);

    const text1 = screen.getByText(/Tan Leatherette Weekender Duffle/i);
    const text2 = screen.getByText(/The Minimalist Slim Leather Watch/i);
    expect(text1).toBeInTheDocument();
    expect(text2).toBeInTheDocument();

    const response2 = {
      data: [
        {
          name: "Tan Leatherette Weekender Duffle",
          category: "Fashion",
          cost: 150,
          rating: 4,
          image:
            "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
          _id: "PmInA797xJhMIPti",
        },
      ],
      status: 200,
    };

    const promise2 = Promise.resolve(response2);
    axios.get.mockImplementationOnce(() => promise2);

    userEvent.type(search, "e");
    expect(search).toHaveValue("leathere");

    jest.runAllTimers();
    await act(() => promise2);

    const updatedAddToCartBtns = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    expect(text2).not.toBeInTheDocument();
    expect(updatedAddToCartBtns.length).toEqual(1);
  });
});

describe("Products Page: Logged in", () => {
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

    const response = {
      data: [
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
      ],
      status: 200,
    };

    const promise = Promise.resolve(response);
    axios.get.mockImplementationOnce(() => promise);

    localStorage.setItem("username", "crio.do");
    localStorage.setItem("token", "testtoken");
    await act(() => promise);

    act(() => {
      render(ProductDOMTree(history));
    });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it("should have username & avatar in header", () => {
    const avatar = screen.getByAltText(/crio.do/i);
    const username = screen.getByText(/crio.do/i);
    expect(avatar).toBeInTheDocument();
    expect(username).toBeInTheDocument();
  });

  it("should have logout button in header", () => {
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
