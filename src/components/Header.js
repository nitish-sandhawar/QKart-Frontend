import { Avatar, Button, Stack, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router";
import "./Header.css";
import Logo from "./Logo";

const Header = ({ children }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const history = useHistory();

  const routeToRegister = () => {
    history.push("/register");
  };

  const routeToLogin = () => {
    history.push("/login");
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    history.push("/");
    // NOTE - Why only reload here but not ini routeToRegister/Login?
    window.location.reload();
  };

  return (
    <Box className="header">
      <Logo variant="light" />
      {children}
      <Stack direction="row" spacing={1} alignItems="center">
        {localStorage.getItem("username") ? (
          <>
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username") || "profile"}
            />

            {isDesktop && <Box>{localStorage.getItem("username")}</Box>}

            <Button type="primary" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button onClick={routeToLogin}>Login</Button>

            <Button variant="contained" onClick={routeToRegister}>
              Register
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Header;
