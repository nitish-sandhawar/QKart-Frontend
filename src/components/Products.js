import { SettingsApplications } from "@mui/icons-material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [productList, setProductList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [apiResponseStatus, setApiResponseStatus] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);           //if logged in then save the token else false 
  const [productInCart, setProductInCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if(token!==null)
      setIsLoggedIn(token)
  },[])


  /**
   * trigger when logout button is clicked and set the login status *isLoggedIn* false
   * It disables the cart view
   */
  const loginStatus = () => {
    setIsLoggedIn(false)
  }
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
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
 
  const performAPICall = async () => {
    setisLoading(true)
    let response;                      //for showing circular progress bar
    try {
      response = await axios.get(`${config.endpoint}/products`)
      setProductList(response.data)
      // fetchCart(localStorage.getItem("token"),response.data) //requesting cart items
      setApiResponseStatus(response.status)         //for no products found screen
    } catch (err) {
      setApiResponseStatus(err.response.status)
      if (err.response.status === 500) {
        enqueueSnackbar(err.response.data.message, { variant: 'error',autoHideDuration: 3000 })
      }
    }
    setisLoading(false)                      //deactivating circular progress bar
    return response.data
  };


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setisLoading(true)                       //for showing circular progress bar
    try {
      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setProductList(response.data)
      setApiResponseStatus(response.status)      //for no products found screen
    } catch (err) {
      setApiResponseStatus(err.response.status)
    }
    setisLoading(false)                    //deactivating circular progress bar
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeoutLocal) => {
    setSearchInput(event.target.value);
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    // call
    const newTimeout = setTimeout(() => performSearch(event.target.value), debounceTimeoutLocal);
    setDebounceTimeout(newTimeout);
  };


   /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   * 
   * @param {array} productlist- used for passing as argument in generateCartItemFrom()
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
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
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token,response) => {   //response as a productList
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const product = await axios.get(`${config.endpoint}/cart`, {
        headers:
          { Authorization: `Bearer ${token}` }
      });

      const productInCartList = generateCartItemsFrom(product.data, response)
      return productInCartList
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
            autoHideDuration: 3000 
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      const productList = await performAPICall();
      const productInCartList = await fetchCart(localStorage.getItem("token"), productList)
      setProductInCart(productInCartList)
    }
    getProducts();
  }, []);

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    if (!items) return false;
      for (let i = 0; i < items.length; i++){
        if (items[i].productId === productId) {
          return true;
        }
      }
    return false; 
  };
  
  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false, type: undefined }
  ) => { 
    if (token) {
      try {
        if (options.preventDuplicate === true) {             //add to cart button
          if (isItemInCart(items, productId)) {
            enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item", {variant: "warning", autoHideDuration: 3000 });
          } else {
            const headerData = {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
            const productData = {
              "productId": productId,
              "qty":qty
            }
            const postProductToCart = await axios.post(`${config.endpoint}/cart`, { ...productData }, { ...headerData })
            const generatedCartItems = generateCartItemsFrom(postProductToCart.data, products)
            setProductInCart(generatedCartItems)
            enqueueSnackbar("Item added into cart successfully", {variant: "success", autoHideDuration: 3000 });
          }
        } else if(options.preventDuplicate === false) {                                     //side bar + - buttons 
            const headerData = {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
            }
            const productData = {
                "productId": productId,
                "qty":qty
            }
            const postProductToCart = await axios.post(`${config.endpoint}/cart`, { ...productData }, { ...headerData })
            const generatedCartItems = generateCartItemsFrom(postProductToCart.data, products)
            setProductInCart(generatedCartItems)
        }
        
      } catch (err) {
        if (err.response.status === 404)
          enqueueSnackbar(err.response.data.message, {variant: "error", autoHideDuration: 3000 });
      } 
    
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {variant: "warning", autoHideDuration: 3000 });
    }
  };


  return (
    <div>
      <Header loginStatus={loginStatus}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
              className="search-desktop"
              size="small"
              value={searchInput}
              onChange={(e) => debounceSearch(e, 1000) }
              InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
          />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        value={searchInput}
        onChange={(e)=>debounceSearch(e,1000)}
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
      />
        {isLoggedIn ?                                           //login view <product grid with cart>
          <Grid container>
            <Grid container item xs={12} md={9} spacing={2}>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box> 
              </Grid>
            {
              (isLoading === true) ?
                <Grid item className="product-grid">
                  <Box className = "loading">
                  <CircularProgress color="success" />
                  <Typography>Loading Products</Typography>
                  </Box>
                </Grid>
                
              :
                (apiResponseStatus !== 200) ? <Grid item className="product-grid">
                  <Box className = "loading">
                    <SentimentDissatisfied />
                    <Typography>No Products Found</Typography>
                  </Box>
                </Grid>
                  :
                productList.map((products) => {                              //product grid
                  const { id } = products;
                  return (
                    <Grid item xs={6} md={3} key={id} className="product-grid">
                      <ProductCard product={products}              
                        handleAddToCart={addToCart}
                        isLoggedIn={isLoggedIn}
                        productList={productList}
                        productInCart={productInCart}
                      />
                    </Grid>
                  )
                })
              }
            </Grid>
            <Grid item xs={12} md={3} className = "cart-place">          {/*cart items*/}
            <Cart items={productInCart} products={productList} isLoggedIn={isLoggedIn} handleQuantity={addToCart} />
            </Grid>
          </Grid>
        :                                                                //logout section                                    
          <Grid container spacing = {2}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
              </Box> 
            </Grid>
            {
            (isLoading === true) ?
              <Grid item className="product-grid">
                <Box className = "loading">
                <CircularProgress color="success" />
                <Typography>Loading Products</Typography>
                </Box>
              </Grid>
              
            :
              (apiResponseStatus !== 200) ? <Grid item className="product-grid">
                <Box className = "loading">
                  <SentimentDissatisfied />
                  <Typography>No Products Found</Typography>
                </Box>
              </Grid>
                :
              productList.map((products) => {                                //product grid lo
                const { id } = products;
                return (
                  <Grid item xs={6} md={3} key={id} className="product-grid">
                    <ProductCard product={products}
                     handleAddToCart={addToCart}
                     isLoggedIn={isLoggedIn}
                     productInCart={productInCart}
                    />
                  </Grid>
                )
              })
            }
          </Grid>
        }
        
      
      
      <Footer />
    </div>
  );
};

export default Products;
