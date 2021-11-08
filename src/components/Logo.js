import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router";

const Logo = ({ variant }) => {
  const history = useHistory();

  const routeToRoot = () => {
    history.push("/");
  };

  return (
    <Box className="header-title" onClick={routeToRoot}>
      <img
        src={variant === "light" ? "logo_light.svg" : "logo_dark.svg"}
        alt="QKart-icon"
      ></img>
    </Box>
  );
};

export default Logo;
