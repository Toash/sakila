import { useState, useEffect } from "react";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";
import randomColor from "randomcolor";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const FilmPage = () => {
  const [placeHolderBG, setPlaceHolderBG] = useState(randomColor());
  const [placeHolderText, setPlaceHolderText] = useState(randomColor());
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceHolderBG(randomColor());
      setPlaceHolderText(randomColor());
    }, 700);

    return () => clearInterval(interval); // cleanup function
  }, []);
  let { title } = useParams();
  const getFilmFromTitle = async () => {
    const response = await api.get("/films/title/" + encodeURIComponent(title));
    return response.data;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["film: " + title],
    queryFn: getFilmFromTitle,
  });

  if (isLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        mt: "6rem",

        mr: "2rem",
        ml: "2rem",
      }}
    >
      <Typography variant="h1" fontWeight={"bold"}>
        {data.title}
      </Typography>
      <Typography sx={{ fontSize: "1.5rem" }}>- {data.description}</Typography>

      <img
        width={"80%"}
        src={simpleSvgPlaceholder({
          text: data.title,
          bgColor: placeHolderBG,
          textColor: placeHolderText,
        })}
      ></img>

      <Typography sx={{ fontSize: "1.5rem" }}>
        Release year: {data.release_year}
      </Typography>
      <Typography sx={{ fontSize: "1.5rem" }}>
        Length: {data.length} Minutes
      </Typography>
      <Typography sx={{ fontSize: "1.5rem" }}>
        Replacement Cost: {data.replacement_cost}
      </Typography>
      <Typography sx={{ fontSize: "1.5rem" }}>Rating: {data.rating}</Typography>
    </Box>
  );
};
