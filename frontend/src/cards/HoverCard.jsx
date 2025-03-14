import { styled, Card } from "@mui/material";

// taken straight from stack overflow >:)
const HoverCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.15s ease-in-out",
  "&:hover": { transform: "scale3d(1.1, 1.1, 1)" },
}));

export default HoverCard;
