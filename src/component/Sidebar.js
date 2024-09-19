import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { format } from "date-fns";
import image3 from "../assets/img3.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
 import "../css/sidebar.css"; 
import Axios from "../Axios";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Swal from 'sweetalert2';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleListItemClick = (index, path, id) => {
    setActiveItem(index); 
    localStorage.setItem("activeMenuIndex", index); 
    path = "/EventsList";
    console.log("Clicked index:", index);
    console.log("Clicked id:", id);
    navigate(path, { state: { id: id, activeIndex: index } });

    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("/events");
        console.log("Fetched data:", response.data);
        if (response.data && Array.isArray(response.data.events)) {
          setSidebarItems(response.data.events);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    const savedActiveItemIndex = localStorage.getItem("activeMenuIndex");
    if (savedActiveItemIndex !== null) {
      setActiveItem(parseInt(savedActiveItemIndex, 10));
    } else {
      setActiveItem(0); 
      localStorage.setItem("activeMenuIndex", 0); 
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.activeIndex !== undefined) {
      setActiveItem(location.state.activeIndex);
    }
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'No, stay'
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.clear();

        // Swal.fire(
        //   'Logged out!',
        //   'You have been logged out successfully.',
        //   'success'
        // );

        navigate("/");
      }
    });
  };

  const goBack = () => {
    window.history.back();
  };

  const currentDate = new Date();
  const upcomingItems = Array.isArray(sidebarItems)
    ? sidebarItems.filter((item) => new Date(item.event_date) >= currentDate)
    : [];
  const sortedUpcomingItems = upcomingItems
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);
  const pastItems = Array.isArray(sidebarItems)
    ? sidebarItems.filter((item) => new Date(item.event_date) < currentDate)
    : [];

  const quotes = [
    {
      id: 1,
      category: "Company Tools",
      // text: "Success is not the key ",
    },
    // {
    //   id: 1,
    //   category: "Company Celebration",
    //   text: "Success is not the key ",
    // },
    // {
    //   id: 2,
    //   category: "General",
    //   text: "The best way to predict ",
    // },
    // {
    //   id: 3,
    //   category: "Business",
    //   text: "Success is not the key ",
    // },
    
   
  ];

  const drawer = (
    <div>
      <Toolbar />
      <Divider />     
      <>
      {isMobile ? null : ( // Render nothing for mobile size
        <IconButton className="icon-btn"  onClick={handleSidebarToggle}>
          {sidebarExpanded ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      )}
    </>
      {sidebarExpanded && (
        <>
          <p
            className="upcome"
          >
            Upcoming Festivals
          </p>
          <List>
            {sortedUpcomingItems.map((item, index) => (
              <ListItem
              className={`list ${activeItem === index ? 'list-active' : 'list-inactive'}`}
              button
              key={item.id}
              selected={activeItem === index}
              onClick={() => handleListItemClick(index, item.path, item.id)}
            >
               <ListItemText
                  className="list.text"
                  primary={item.title}
                  secondary={format(new Date(item.event_date), "EEEE, dd MMMM")}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: activeItem === index ? "#fff" : "#000",
                      padding: '0 5px',
                      fontFamily: 'Montserrat Alternates'
                    },
                    "& .MuiListItemText-secondary": {
                      color: activeItem === index ? "#fff" : "#000",
                      padding: '0 5px',
                       fontFamily: 'Montserrat Alternates'
                    },
                  }}
                />
                <KeyboardDoubleArrowRightIcon
                  sx={{ color: activeItem === index ? "#000" : "#fff" }}
                />
              </ListItem>
            ))}
          </List>

          <Divider />
          <p
            className="upcome1"
          >
            Others
          </p>

              <List sx={{ maxHeight: "calc(100vh - 400px)" }} className="quotes">
          {quotes.map((quote, index) => (
          <ListItem
          className={`list quotes-item ${activeItem === index + sortedUpcomingItems.length ? 'quotes-active' : 'quotes-inactive'}`}
          button
          key={quote.id}
          selected={activeItem === index + sortedUpcomingItems.length}
          onClick={() => handleListItemClick(index + sortedUpcomingItems.length, quote.path, quote.id)}
          >
          <ListItemText
            className="quotes-item"
            primary={quote.category}
            secondary={quote.text}
            sx={{
          ".MuiListItemText-primary": {
            color: activeItem === index + sortedUpcomingItems.length ? "#fff" : "#000",
            padding: '0 5px',
             fontFamily: 'Montserrat Alternates'
          },
          ".MuiListItemText-secondary": {
            color: activeItem === index + sortedUpcomingItems.length ? "#fff" : "#000",
            padding: '0 5px',
             fontFamily: 'Montserrat Alternates'
          },
        }}
      />
      <KeyboardDoubleArrowRightIcon
        sx={{ color: activeItem === index + sortedUpcomingItems.length ? "#000" : "#fff" }}
      />
    </ListItem>
  ))}
</List>

        </>
      )}
    </div>
  );

  return (
    <Box sx={{ display: "flex"}}>
      <CssBaseline />
      <AppBar className="appbar" position="fixed">
        <Toolbar
        className="toolbar"
          sx={{
            background: "#7f223d",
            display: "flex",
            justifyContent: "space-evenly",
            zIndex: 0,
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" }}}
             
            >
              <MenuIcon />
            </IconButton>
          )}

          <div                
            onClick={goBack} 
          >
            <ArrowBackIosIcon   className="arrowback" sx={{fontSize:"20px"}}/>
          </div>

          <img
            src={image3}
            className="mainlogo"
            alt="Main Logo"
            style={{ cursor: "pointer", height: 50 }}
            onClick={() => Swal.fire("Welcome.", "Welcome to the Main Page!", "success")}
          />
          <div>
            <Button
              color="inherit"
              onClick={handleLogout}
              endIcon={
                <LogoutIcon
                className="logout"
                  sx={{
                    height: "30px",
                    width: "30px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    padding: "5px",
                  }}
                />
              }
              sx={{
                marginLeft: "auto",
                color: "#fff",
                textAlign: "end",
              }}
            >
              <span className="logout-text">Logout</span>
          
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: sidebarExpanded ? 240 : 72 },
          boxSizing: "border-box",
          backgroundColor: "#f3d3c0",
          color: "white",
          borderRight: "1px solid #000",
          zIndex: 1,
        }}
        aria-label="sidebar folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              backgroundColor: "#f3d3c0", // Ensure color is applied
              color: "#000",
              borderRight: "1px solid #000",
              zIndex: 1,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: sidebarExpanded ? 240 : 72,
              backgroundColor: "#f3d3c0", 
              color: "#000",
              borderRight: "1px solid #000",
              zIndex: 1,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Sidebar;
