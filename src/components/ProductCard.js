import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, isLoggedIn, productInCart, productList }) => {
  return (
    <Card className="card">
       <CardMedia
        component="img"
        height="260"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="h5">
          &#36;{product.cost}
        </Typography><br/>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button variant="contained" startIcon={<AddShoppingCartOutlined />} onClick={()=>handleAddToCart(isLoggedIn,productInCart,productList,product["_id"],1,{preventDuplicate:true})} fullWidth>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
