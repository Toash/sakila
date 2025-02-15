import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Outlet, redirect } from "react-router";

const queryClient = new QueryClient();

function App() {
  // call the api for top 5 movies on mount
  const darkTheme = createTheme({
    typography: {
      h1: {
        color: "white",
      },
    },
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
      background: {
        default: "#121212",
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline></CssBaseline>
        <AppBar>
          <Toolbar>
            <Button
              sx={{ mr: "1rem" }}
              component={Link}
              to="/"
              variant="contained"
            >
              Landing Page
            </Button>
            <Button
              sx={{ mr: "1rem" }}
              component={Link}
              to="/"
              variant="contained"
            >
              Films
            </Button>
          </Toolbar>
        </AppBar>
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
