import axios from "axios";
import { useEffect } from "react";
import "./App.css";
import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { Films } from "./films/Films";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  // call the api for top 5 movies on mount

  return (
    <QueryClientProvider client={queryClient}>
      <AppBar>
        <Toolbar>
          <Typography>Milestone 2</Typography>
        </Toolbar>
      </AppBar>
      <Box>
        <Typography>Top 5 Films</Typography>
        <Films></Films>
      </Box>
    </QueryClientProvider>
  );
}

export default App;
