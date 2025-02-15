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

export const ActorCard = ({ data }) => {
  let navigate = useNavigate();
  return (
    <HoverCard
      onClick={() => navigate("/actor/id/" + encodeURIComponent(data.actor_id))}
      sx={{ cursor: "pointer", backgroundColor: "#1E1E1E", minWidth: 275 }}
    >
      <CardContent>
        <Typography
          fontSize="1.5rem"
          textAlign="center"
          sx={{ color: "white" }}
        >
          {data.first_name} {data.last_name}
        </Typography>
        <img
          src={simpleSvgPlaceholder({
            //bgColor: randomColor(),
            //textColor: randomColor(),
            height: 400,
            text: data.first_name,
            fontSize: "1.5rem",
          })}
        ></img>
      </CardContent>
    </HoverCard>
  );
};
