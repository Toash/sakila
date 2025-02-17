import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";
import HoverCard from "./HoverCard";

export const FilmCard = ({ data }) => {
  let navigate = useNavigate();

  return (
    <HoverCard
      onClick={() => navigate("/film/title/" + encodeURIComponent(data.title))}
      sx={{ cursor: "pointer", backgroundColor: "#1E1E1E", minWidth: 275 }}
    >
      <CardContent>
        <Typography
          fontSize="1.5rem"
          textAlign="center"
          sx={{ color: "white", fontWeight: "bold" }}
        >
          {data.title}
        </Typography>

        <img
          src={simpleSvgPlaceholder({
            //bgColor: randomColor(),
            //textColor: randomColor(),
            height: 400,
            text: data.title,
            fontSize: "1.5rem",
          })}
        ></img>
        <Typography textAlign={"center"}>{data.rented} Rentals</Typography>
      </CardContent>
    </HoverCard>
  );
};
