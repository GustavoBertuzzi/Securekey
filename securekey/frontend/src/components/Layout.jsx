import React, { useState } from 'react';
import { 
  AppBar, Toolbar, IconButton, Drawer, 
  List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  Box, Divider, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Home, Settings, Lock, ExitToApp, AccountCircle
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

export function Layout({ children, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { text: "Senhas", icon: <Home className="text-gray-700" />, path: "/senhas" },
    { text: "Cofre", icon: <Lock className="text-gray-700" />, path: "/cofre" },
    { text: "Configurações", icon: <Settings className="text-gray-700" />, path: "/configuracoes" },
  ];

  // Funções de controle do menu de perfil
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);



  // Funções de logout
  const openLogoutDialog = () => {
    setLogoutOpen(true);
    handleProfileMenuClose();
  };

  const confirmLogout = () => {
    onLogout(); // Função passada via props para limpar autenticação
    navigate("/"); // Redireciona para a página de login
    setLogoutOpen(false);
  };

  const cancelLogout = () => {
    setLogoutOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Diálogo de Logout Personalizado */}
      <Dialog open={logoutOpen} onClose={cancelLogout}>
        <Box className="p-4">
        <DialogTitle className="flex items-center">
          <ExitToApp className="text-red-500 mr-2" />
          Confirmar Saída
        </DialogTitle>
          <DialogContent>
            <Typography>Você realmente deseja sair do sistema?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelLogout} variant="outlined" className="mr-2">
              Cancelar
            </Button>
            <Button 
              onClick={confirmLogout} 
              variant="contained" 
              color="error"
              startIcon={<ExitToApp />}
            >
              Confirmar Saída
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Navbar */}
      <AppBar position="static" className="bg-white shadow-sm border-b border-gray-200">
        <Toolbar className="flex justify-between items-center p-2">
          <IconButton
            edge="start"
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-800 hover:bg-transparent"
          >
            <MenuIcon />
          </IconButton>

          <div className="flex-grow text-center">
            <Link to="/senhas" className="text-xl font-bold text-black hover:text-blue-500 no-underline inline-block p-0 m-0 leading-none hover:bg-transparent">
              SecureKey
            </Link>
          </div>

          <div>
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              className="text-gray-800 hover:bg-transparent"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              className="mt-2 min-w-[200px] shadow-lg"
            >
              <MenuItem onClick={() => { navigate("/configuracoes"); handleProfileMenuClose(); }} className="hover:bg-gray-100">
                <ListItemIcon>
                  <Settings className="text-gray-700" />
                </ListItemIcon>
                Configurações
              </MenuItem>
              <Divider />
              <MenuItem onClick={openLogoutDialog} className="text-red-500 hover:bg-red-50">
                <ListItemIcon>
                  <ExitToApp className="text-red-500" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Layout Principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        >
          <Box className="h-full flex flex-col w-64">
            <List className="flex-grow">
              {sidebarItems.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    className="hover:bg-gray-100 text-gray-800 no-underline"
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              
              ))}
            </List>
            <div className="p-2 border-t">
            <ListItem disablePadding>
              <ListItemButton
                onClick={openLogoutDialog}
                className="text-red-500 hover:bg-red-50"
              >
                <ListItemIcon>
                  <ExitToApp className="text-red-500" />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
            </div>
          </Box>
        </Drawer>

        {/* Área de Conteúdo */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}