import { Typography, Box, CircularProgress, Paper } from "@mui/material";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const ActorPage = () => {
  let { id } = useParams();
  const getActor = async () => {
    const response = await api.get("/actors/id/" + encodeURIComponent(id));
    return response.data;
  };

  const getFilmCount = async () => {
    const response = await api.get(
      "/actors/film_count/id/" + encodeURIComponent(id)
    );
    return response.data;
  };

  const getFilmsFromActor = async () => {
    const response = await api.get(
      "/actors/top5films/id/" + encodeURIComponent(id)
    );
    return response.data;
  };
  const { data, isLoading: actorIsLoading } = useQuery({
    queryKey: ["actor: " + id],
    queryFn: getActor,
  });

  const { data: film_count, isLoading: countIsLoading } = useQuery({
    queryKey: ["film_count: " + id],
    queryFn: getFilmCount,
  });
  const { data: films, isLoading: filmsIsLoading } = useQuery({
    queryKey: ["actor_top5film: " + id],
    queryFn: getFilmsFromActor,
  });

  if (actorIsLoading || countIsLoading || filmsIsLoading) {
    return <CircularProgress></CircularProgress>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "6rem",
        mt: "6rem",
      }}
    >
      <Box display={"flex"} flexDirection={"column"} gap="2rem">
        <Box>
          <Typography variant="h1" fontWeight={"bold"}>
            {data.first_name} {data.last_name}
          </Typography>

          <Typography textAlign={"left"} fontSize={"2rem"} fontWeight={"bold"}>
            - Film count: {film_count.film_count}
          </Typography>
        </Box>

        <Box>
          <Typography
            mb="1rem"
            textAlign="left"
            variant="h2"
            fontWeight={"bold"}
          >
            Top 5 films
          </Typography>
          {films.map((e, i) => {
            return (
              <Typography textAlign="left" key={i}>
                {e.title}
              </Typography>
            );
          })}
        </Box>
      </Box>

      <img
        src={simpleSvgPlaceholder({
          text: data.first_name,
          height: 800,
          width: 600,
        })}
      />
    </Box>
  );
};
