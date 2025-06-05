import { Box, Button, CircularProgress } from "@mui/material";
import JokeCard from "../ui/JokeCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { fetchInitialJokes, loadMoreJokes } from "../store/jokesStore";
import React from "react";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { jokes, status, error } = useSelector(
    (state: RootState) => state.jokes
  );

  //double req fix
  const initialFetchDone = React.useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      console.log("Dispatch fetchInitialJokes");
      dispatch(fetchInitialJokes());
      initialFetchDone.current = true;
    }
  }, [dispatch]);

  const onLoadMore = () => {
    dispatch(loadMoreJokes());
  };

  const isFetchInitialFail =
    status.fetchInitial !== "succeeded" &&
    !error &&
    status.loadMore !== "loading";

  return (
    <Box sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center" sx={{ px: 2 }}>
        {isFetchInitialFail && <CircularProgress />}
        {error && (
          <Box sx={{ color: "error.main", fontWeight: "bold" }}>
            Error: {error}
          </Box>
        )}
        {status.fetchInitial !== "loading" && !error && (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
            gap={2}
            maxWidth="1200px"
            width="100%"
          >
            {jokes.map((joke) => (
              <JokeCard key={joke.id} joke={joke} />
            ))}
          </Box>
        )}
      </Box>

      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          onClick={onLoadMore}
          disabled={status.loadMore === "loading"}
          size="large"
        >
          {status.loadMore === "loading" ? (
            <CircularProgress size={24} />
          ) : (
            "Load More"
          )}
        </Button>
      </Box>
    </Box>
  );
}
