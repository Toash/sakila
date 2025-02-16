import { Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FilmCard } from "../cards/FilmCard";
import { ActorCard } from "../cards/ActorCard";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

const fetchTop5Films = async () => {
  const response = await api.get("/films/top5");
  return response.data;
};

const fetchTop5Actors = async () => {
  const response = await api.get("/actors/top5");
  return response.data;
};

const Films = () => {
  const { data, isLoading } = useQuery({
    queryKey: "top5films",
    queryFn: fetchTop5Films,
  });
  if (isLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return (
    <Box
      width="100%"
      display="flex"
      flexWrap="wrap"
      gap="2rem"
      justifyContent={"center"}
    >
      {data?.map((film, i) => {
        return <FilmCard key={i} data={film}></FilmCard>;
      })}
    </Box>
  );
};

const Actors = () => {
  const { data, isLoading } = useQuery({
    queryKey: "top5actors",
    queryFn: fetchTop5Actors,
  });

  if (isLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return (
    <Box display="flex" flexWrap="wrap" gap="2rem" justifyContent={"center"}>
      {data?.map((actor, i) => {
        return <ActorCard key={i} data={actor}></ActorCard>;
      })}
    </Box>
  );
};

function LandingPage() {
  return (
    <Box mt="6rem" display="flex" flexDirection="column" gap="4rem">
      <Box display="flex" flexDirection="column" gap="2rem">
        <Typography
          textAlign="center"
          variant="h1"
          fontSize={"4rem"}
          fontWeight={"bold"}
        >
          TOP 5 FILMS
        </Typography>
        <Films></Films>
      </Box>

      <Box display="flex" flexDirection="column" gap="2rem">
        <Typography
          textAlign="center"
          variant="h1"
          fontSize={"4rem"}
          fontWeight={"bold"}
        >
          TOP 5 ACTORS
        </Typography>
        <Actors></Actors>
      </Box>
    </Box>
  );
}

export default LandingPage;
