import "./App.css";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, redirect } from "react-router";

const queryClient = new QueryClient();

function App() {
  // call the api for top 5 movies on mount
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <AppBar>
          <Toolbar>
            <Button component={Link} to="/" variant="contained">
              Home
            </Button>
          </Toolbar>
        </AppBar>
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
