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
      sx={{ display: "flex", flexDirection: "column", gap: "2rem", mt: "4rem" }}
    >
      <Typography variant="h1" fontWeight={"bold"}>
        {data.title}
      </Typography>
      <Typography sx={{ fontSize: "2rem" }}>- {data.description}</Typography>

      <img
        width={"100%"}
        height={"auto"}
        src={simpleSvgPlaceholder({
          text: data.title,
          bgColor: randomColor(),
          textColor: randomColor(),
        })}
      ></img>

      <Typography>Release year: {data.release_year}</Typography>
      <Typography>Length: {data.length} Minutes</Typography>
      <Typography>Replacement Cost: {data.replacement_cost}</Typography>
      <Typography>Rating: {data.rating}</Typography>
    </Box>
  );
};
