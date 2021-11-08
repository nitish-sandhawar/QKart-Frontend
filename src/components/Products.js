import {
  AddShoppingCartOutlined,
  Search,
  SentimentDissatisfied,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  InputAdornment,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";

const Products = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  /**
   * Perform the API call over the network and return the response
   *
   * @returns {Product[]|undefined}
   *    The response JSON object
   *
   * -    Set the isLoading state variable to true
   * -    Perform the API call via a fetch call: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * -    The call must be made asynchronously using Promises or async/await
   * -    The call must handle any errors thrown from the fetch call
   * -    Parse the result as JSON
   * -    Set the isLoading state variable to false once the call has completed
   * -    Call the validateResponse(errored, response) function defined previously
   * -    If response passes validation, return the response object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  useEffect(() => {
    // FIXME - Define performAPICall outside useEffect for better readability?
    const performAPICall = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${config.endpoint}/products`);

        setLoading(false);

        // FIXME - Do we need two product arrays now that we have search from backend?
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (e) {
        setLoading(false);

        if (e.response && e.response.status === 500) {
          enqueueSnackbar(e.response.data.message, { variant: "error" });
          return null;
        } else {
          enqueueSnackbar(
            "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
            {
              variant: "error",
            }
          );
        }
      }
    };

    performAPICall();

    if (localStorage.getItem("username") && localStorage.getItem("token")) {
      setLoggedIn(true);
    }

    // NOTE - What does adding [enqueueSnackbar] do here?
  }, [enqueueSnackbar]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement the search() method
  /**
   * Definition for search handler
   * This is the function that is called when the user clicks on the search button or the debounce timer is executed
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * -    Update filteredProducts state to show a filtered **subset of the products class property** based on the search text
   * -    The search filtering should be done on the name and category fields of the product
   * -    The search filtering should not take in to account the letter case of the search text or name/category fields
   */
  const search = async (text) => {
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement the debounceSearch() method
  /**
   * Definition for debounce handler
   * This is the function that is called whenever the user types or changes the text in the searchbar field
   * We need to make sure that the search handler isn't constantly called for every key press, so we debounce the logic
   * i.e. we make sure that only after a specific amount of time passes after the final keypress (with no other keypress event happening in between), we run the required function
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * -    Obtain the search query text from the JS event object
   * -    If the debounceTimeout class property is already set, use clearTimeout to remove the timer from memory: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout
   * -    Call setTimeout to start a new timer that calls below defined search() method after 300ms and store the return value in the debounceTimeout class property: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
   */
  const debounceSearch = (event) => {
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      </Header>

      {!isDesktop && (
        <TextField
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={debounceSearch}
        />
      )}

      <Grid container>
        <Grid item xs={12} md={isLoggedIn && products.length ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {isLoading ? (
            <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
          ) : (
            <Grid
              container
              marginY="1rem"
              paddingX="1rem"
              spacing={isDesktop ? 2 : 0}
            >
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item xs={6} md={3} key={product._id}>
                    {/* FIXME - Can move Product card to different component */}
                    <Card className="card">
                      <CardMedia
                        component="img"
                        alt={product.name}
                        image={product.image}
                      />
                      <CardContent>
                        <Typography>{product.name}</Typography>
                        <Typography paddingY="0.5rem" fontWeight="700">
                          ${product.cost}
                        </Typography>
                        <Rating
                          name="read-only"
                          value={product.rating}
                          precision={0.5}
                          readOnly
                        />
                      </CardContent>
                      <CardActions className="card-actions">
                        <Button
                          className="card-button"
                          fullWidth
                          variant="contained"
                          startIcon={<AddShoppingCartOutlined />}
                        >
                          Add to cart
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No products found</h4>
                </Box>
              )}
            </Grid>
          )}
        </Grid>

        {isLoggedIn && products.length && (
          <Grid item xs={12} md={3}>
            Cart Goes Here
          </Grid>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
