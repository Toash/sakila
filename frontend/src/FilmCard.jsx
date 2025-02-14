import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";
import randomColor from "randomcolor";

export const Film = ({ data }) => {
  let navigate = useNavigate();
  return (
    <Card sx={{ backgroundColor: "#1E1E1E", minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ color: "white" }}>{data.title}</Typography>
        <img
          src={simpleSvgPlaceholder({
            bgColor: randomColor(),
            textColor: randomColor(),
            text: data.title,
          })}
        ></img>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            navigate("/film/title/" + encodeURIComponent(data.title));
          }}
        >
          Details
        </Button>
      </CardActions>
    </Card>
  );
};
