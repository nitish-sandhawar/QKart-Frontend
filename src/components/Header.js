import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {Link} from "react-router-dom";
import { useState } from "react";
import { Search } from "@mui/icons-material";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const getUserInfo = () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const balance = localStorage.getItem("balance");
    if (username) {
      return {
        username: username,
        token: token,
        balance: balance
      };
    } 
    return false;
  }
  const [isLoggedIn, setIsLoggedIn] = useState(getUserInfo() || false);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false)
  }


    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {children && 
            <TextField
              className="search-desktop"
              size="small"
              value={children.searchInput}
              onChange={(e) => children.debounceSearch(e, 1000) }
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
        }
        {(hasHiddenAuthButtons) ?
          <Link to="/" className="link">
            <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            >
              Back to explore
              </Button>
            </Link>
          : ((isLoggedIn) ?
            <Box>
              <Button>
                <Avatar alt={isLoggedIn.username} src="avatar.png" />
                &nbsp;&nbsp;{isLoggedIn.username}
              </Button>
              <Button variant="text" onClick={logout}>
                <Link to="/" className="link"> Logout </Link>
              </Button>
            </Box>
            :
            <Box>
                <Link to="/login" className="link">
                  <Button variant = "text">
                    Login
                  </Button>&nbsp;&nbsp;
                </Link>
                <Link to="/register" className="link">
                  <Button variant="contained">
                    Register
                  </Button>
                </Link>
           </Box>)
        }
      </Box>
    );
};

export default Header;
