import { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Divider } from "@mui/material";
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
    queryKey: ["film" + title],
    queryFn: getFilmFromTitle,
  });

  const { data: rental_count, isLoading: rentalCountIsLoading } = useQuery({
    queryKey: ["rental_count", title],
    queryFn: async () => {
      const response = await api.get(
        "/films/rental_count/title/" + encodeURIComponent(title)
      );
      return response.data;
    },
  });

  if (isLoading || rentalCountIsLoading) {
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

      <Box width="70%">
        <img
          width={"100%"}
          src={simpleSvgPlaceholder({
            text: data.title,
            fontSize: "1rem",
            bgColor: placeHolderBG,
            textColor: placeHolderText,
          })}
        ></img>
        <Typography sx={{ mb: "2rem", fontSize: "1.5rem" }}>
          - {data.description}
        </Typography>

        <Divider></Divider>

        <Box display="flex" justifyContent={"space-between"}>
          <Box>
            <Typography alignSelf={"flex-start"} sx={{ fontSize: "1.5rem" }}>
              Rental Rate: {data.rental_rate}
            </Typography>
            <Typography sx={{ fontSize: "1.5rem" }}>
              Release year: {data.release_year}
            </Typography>
            <Typography sx={{ fontSize: "1.5rem" }}>
              Length: {data.length} Minutes
            </Typography>

            <Typography sx={{ fontSize: "1.5rem" }}>
              Rating: {data.rating}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "1.5rem" }}>
              {rental_count.rental_count} Rentals
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
