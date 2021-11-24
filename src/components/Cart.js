import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData 
 *      Array of objects with productId and quantity of products in cart
 * @param { Array.<{ productId: String, name: String, category: String, image: String, rating: Number, cost: Number}> } productsData
 *      Array of objects with complete data on all available products
 * 
 * @returns { Array.<{ productId: String, name: String, category: String, image: String, rating: Number, cost: Number}> } 
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<{ productId: String, name: String, category: String, image: String, rating: Number, cost: Number}> } 
 *    Array of objects with complete data on products added to the cart
 * 
 * @returns { Number } 
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
};

export const getTotalItems = (cart = []) => {
};

const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

const Cart = ({
  products,
  items = [],
  handleQuantity,
}) => {

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

      </Box>
    </>
  );
};

export default Cart;
