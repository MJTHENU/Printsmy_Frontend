import * as React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import Images3 from '../assets/img3.png';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import '../css/admin.css';

const drawerWidth = 240;

function MobileDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
        navigate("/");
      }
    });
  };

  const getIcon = (text) => {
    switch (text) {
      case 'All Users':
        return <AccountBoxIcon className='icon_eli' />;
      case 'Add User':
        return <PersonAddIcon className='icon_eli' />;
      case 'View Events':
        return <EventIcon className='icon_eli' />;
      default:
        return <AddPhotoAlternateRoundedIcon className='icon_eli' />;
    }
  };

  const drawerItems = [
    { text: "Add User", to: "/new-user" },
    { text: "All Users", to: "/all-users" },
    { text: "View Events", to: "/view-events" },
    { text: "View Designs", to: "/view-designs" }
  ];

  const drawer = (
    <div>
      <div style={{ textAlign: 'center', paddingTop: '5px' }}>
        <Typography variant="h6" noWrap component="div">
          <img
            src={Images3}
            alt="Logo"
            style={{ height: 50, marginRight: 'auto', padding: '8px' }}
          />
        </Typography>
      </div>

      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              className={location.pathname === item.to ? "selecteditem" : ""}
              style={{
                backgroundColor: location.pathname === item.to ? 'orange' : 'transparent',
                color: location.pathname === item.to ? '#fff' : '#000',
              }}
            >
              <ListItemIcon>
                {getIcon(item.text)}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

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
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

MobileDrawer.propTypes = {
  window: PropTypes.func,
};

export default MobileDrawer;
