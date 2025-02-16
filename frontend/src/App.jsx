import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
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
        fontSize: "4rem",
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
            <Box width="100%" display="flex" alignItems={"center"} gap="2rem">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  component={Link}
                  to="/"
                  sx={{ fontSize: "2rem", fontWeight: "bold" }}
                >
                  SAKILA
                </Button>
              </Box>
              <Box>
                <Button
                  sx={{ mr: "1rem" }}
                  component={Link}
                  to="/films"
                  variant="contained"
                >
                  SEARCH FILMS
                </Button>
                <Button
                  sx={{ mr: "1rem" }}
                  component={Link}
                  to="/customers"
                  variant="contained"
                >
                  MANAGE CUSTOMERS
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
