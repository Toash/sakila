import { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Film } from "../Film";
const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchTop5Films = async () => {
  const response = await api.get("/films/top5");
  return response.data;
};

export const Films = () => {
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
    <Box display="flex" gap="2rem">
      {console.log(data)}
      {data?.map((film, i) => {
        return <Film key={i} title={film.title}></Film>;
      })}
    </Box>
  );
};
