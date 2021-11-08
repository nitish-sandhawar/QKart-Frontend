import { Box } from "@mui/system";
import React from "react";
import "./Footer.css";
import Logo from "./Logo";

const Footer = () => {
  return (
    <Box className="footer">
      <Logo variant="dark" />
      <p className="footer-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt.
      </p>
    </Box>
  );
};

export default Footer;
