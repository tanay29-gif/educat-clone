import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(1), width: 'auto' }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '20ch' }
  }
}));

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we can go back
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${searchQuery}`);
      setSearchQuery('');
    }
  };{canGoBack && (
            <IconButton 
              size="large" 
              edge="start" 
              color="inherit" 
              sx={{ mr: 1 }}
              onClick={() => navigate(-1)}
              title="Go Back"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1, fontWeight: 'bold' }}
          >
            EduStore
          </Typography>

          <Search component="form" onSubmit={handleSearch}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search courses..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>

          <Button color="inherit" component={RouterLink} to="/courses" sx={{ ml: 2 }}>
            Explore
          </Button>

          {!user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/login" sx={{ ml: 2 }}>
                Sign In
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  ml: 2,
                  border: '1px solid white',
                  borderRadius: '4px',
                  px: 2
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ ml: 2 }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    bgcolor: '#764ba2'
                  }}
                  src={user.avatar}
                  alt={user.username}
                >
                  {user.fullName?.charAt(0) || user.username?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>{user.fullName}</MenuItem>
                <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                  My Profile
                </MenuItem>
                {user.role === 'instructor' && (
                  <>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/dashboard">
                      My Courses
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/create-course">
                      Create Course
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
