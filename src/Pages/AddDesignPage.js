import React, { useState } from "react";
import { AppBar, Toolbar, Button, CssBaseline, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Images3 from "../assets/img3.png";
import bg from "../assets/bg.png";
import AddDesigns from "../component/AddDesigns";
import MobileDrawer from "../component/MobileDrawer";
import { makeStyles } from "@material-ui/core/styles";
import "../index.css";

// const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  headerClass: {
    display: "block", // Ensure it is visible by default
    [theme.breakpoints.up("xs")]: {
      display: "none !important", // Hide on small screens and up (600px and larger)
    },
  },
}));

const ImageUploadPage = () => {
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
          marginTop: 8, // Adjusting to avoid overlapping with AppBar
          marginLeft: 0, // Adjusting to avoid overlapping with Drawer
          overflow: "auto", // To ensure main content is scrollable if needed
        }}
      >
         <AddDesigns />
       
      </Box>
    </Box>
    </>
  );
};

export default ImageUploadPage;
