import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";
import { generateCartItemsFrom } from "./Products";


const Checkout = () => {


  return (
    <>
      <Header />
      <Grid container>
        <Grid
          item
        >
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
               <Typography my="1rem">
                 No addresses found for this account. Please add one to proceed
               </Typography>
            </Box>


            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />


            <Button
              startIcon={<CreditCard />}
              variant="contained"
            >
              Make Payment
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
