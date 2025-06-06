import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import type { Joke } from "../types";
import { useAppDispatch } from "../store/hooks";
import { addRandomJoke, refreshJoke, removeJoke } from "../store/jokesStore";
import { useEffect, useState } from "react";

type JokeCardProps = {
  joke: Joke;
};

export default function JokeCard({ joke }: JokeCardProps) {
  const dispatch = useAppDispatch();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDelete = () => {
    dispatch(removeJoke(joke.id));
  };

  const handleAdd = () => {
    dispatch(addRandomJoke());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(refreshJoke(joke.id));
  };

  useEffect(() => {
    setIsRefreshing(false);
  }, [joke]);

  return (
    <Card
      sx={{
        backgroundColor: "#d3d3d3",
        color: "#333",
        borderRadius: 2,
        boxShadow: 3,
        height: "100%",
        minHeight: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {isRefreshing ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                Type: {joke.type}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" color="primary">
                ID #{joke.id}
              </Typography>
            </Box>

            <Typography variant="subtitle2" fontWeight="bold">
              Setup:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {joke.setup}
            </Typography>

            <Typography variant="subtitle2" fontWeight="bold">
              Punchline:
            </Typography>
            <Typography variant="body2">{joke.punchline}</Typography>
          </>
        )}
      </CardContent>

      <Box display="flex" justifyContent="space-between" px={2} pb={2}>
        <Button
          size="small"
          color="error"
          variant="contained"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          size="small"
          color="success"
          variant="contained"
          onClick={handleAdd}
        >
          Add
        </Button>
        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      </Box>
    </Card>
  );
}
