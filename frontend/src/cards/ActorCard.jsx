import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";

import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";

export const ActorCard = ({ data }) => {
  let navigate = useNavigate();
  return (
    <Card sx={{ backgroundColor: "#1E1E1E", minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ color: "white" }}>
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
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            navigate("/actor/id/" + encodeURIComponent(data.actor_id));
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
};
