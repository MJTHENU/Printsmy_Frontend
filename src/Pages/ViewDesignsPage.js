import React, { useState } from "react";
import { AppBar, Toolbar, Button, CssBaseline, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Images3 from "../assets/img3.png";
import bg from "../assets/bg.png";
import MobileDrawer from "../component/MobileDrawer";
import { makeStyles } from "@material-ui/core/styles";
import "../index.css";
import ViewDesigns from "../component/ViewDesigns";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  headerClass: {
    display: "block",
    [theme.breakpoints.up("xs")]: {
      display: "none !important",
    },
  },
}));

const AllDesignsPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("All User");

  const handleClick = () => {
    setOpen(!open);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const listItemStyle = {
    minHeight: "60px",
    padding: "20px 16px",
  };
  const listItemTextStyle = {
    fontSize: "25px",
    color: "#3a656c",
  };

  const getListItemStyles = (item) => ({
    ...listItemStyle,
    backgroundColor: activeItem === item ? "#3a656c" : "inherit",
    color: activeItem === item ? "white" : "inherit",
  });

  const getListItemTextStyles = (item) => ({
    ...listItemTextStyle,
    color: activeItem === item ? "white" : "#3a656c",
  });

  return (
    <>
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.headerClass}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1976d200",
        }}
      >
        <Toolbar className={classes.headerClass}>
          <img
            src={Images3}
            alt="Logo"
            style={{ height: 45, marginRight: "auto" }}
          />
          <Button
            color="inherit"
            endIcon={<LogoutIcon />}
            sx={{ marginLeft: "auto" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <MobileDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          backgroundImage: `url(${bg})`,
          backgroundColor: "#014550",
          marginTop: 8, 
          marginLeft: 0, 
          overflow: "auto",
        }}
      >
        
        <ViewDesigns/>
      </Box>
    </Box>
    </>
  );
};

export default AllDesignsPage;
