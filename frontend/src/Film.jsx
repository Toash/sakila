import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";

export const Film = ({ title }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography>{title}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Details</Button>
      </CardActions>
    </Card>
  );
};
