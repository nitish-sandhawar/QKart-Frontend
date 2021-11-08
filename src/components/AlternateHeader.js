import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router";
import "./Header.css";
import Logo from "./Logo";

const AlternateHeader = ({ children }) => {
  const history = useHistory();

  const routeToExplore = () => {
    history.push("/");
  };

  return (
    <Box className="header">
      {/* FIXME - Can we have the <Layout> component defined here instead of a separate component? */}
      <Logo variant="light" />
      {children}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={routeToExplore}
      >
        Back to explore
      </Button>
    </Box>
  );
};

export default AlternateHeader;
