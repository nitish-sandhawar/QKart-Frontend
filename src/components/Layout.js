import { Box } from "@mui/system";
import React from "react";
import Footer from "./Footer";

const Layout = ({ children, ...props }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
      {...props}
    >
      {children}
      <Footer />
    </Box>
  );
};

export default Layout;
