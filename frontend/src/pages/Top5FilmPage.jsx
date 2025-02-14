import { Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Film } from "../FilmCard";
const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchTop5Films = async () => {
  const response = await api.get("/films/top5");
  return response.data;
};

const Films = () => {
  const { data, isLoading } = useQuery({
    queryKey: "top5",
    queryFn: fetchTop5Films,
  });
  //const [films, setFilms] = useState({});

  useEffect(() => {}, []);

  if (isLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return (
    <Box display="flex" flexWrap="wrap" gap="2rem">
      {console.log(data)}
      {data?.map((film, i) => {
        return <Film key={i} data={film}></Film>;
      })}
    </Box>
  );
};

function Top5FilmPage() {
  return (
    <Box mt="4rem" display="flex" flexDirection="column" gap="2rem">
      <Typography variant="h1" fontWeight={"bold"}>
        Top 5 Films
      </Typography>
      <Films></Films>
    </Box>
  );
}

export default Top5FilmPage;
