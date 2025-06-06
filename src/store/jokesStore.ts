import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ActionReducerMapBuilder, AsyncThunk, PayloadAction } from "@reduxjs/toolkit";


import jokesApi from "../api/getTenJokes";
import type { Joke, JokesState, StatusKey } from "../types";
import { localStorageUtils } from "../utils/localStorageUtils";

const initialState: JokesState = {
  jokes: [],
  status: {
    fetchInitial: "idle",   // 'idle' | 'loading' | 'succeeded' | 'failed'
    loadMore: "idle",
    add: "idle",
    refresh: "idle",
  },
  error: null,
};

export const fetchInitialJokes = createAsyncThunk(
  "jokes/fetchInitial",
  async (_, thunkAPI) => {
    try {
      const jokes = await jokesApi.getTenJokes();
      const savedJoke = localStorageUtils.get()

      const joined = [...savedJoke, ...jokes]

      if (savedJoke.length >= 10) {
        return savedJoke;
      }

      console.log(joined.slice(0, 10), "joined.slice(0, 10)")
      return joined.slice(0, 10);
      
    } catch  {
      return thunkAPI.rejectWithValue("Failed to load jokes");
    }
  }
);

export const loadMoreJokes = createAsyncThunk(
  "jokes/loadMore",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { jokes: JokesState };
    const existingIds = new Set(state.jokes.jokes.map((j) => j.id));
    let uniqueNewJokes: Joke[] = [];

    const tryLoad = async (): Promise<Joke[]> => {
      if (uniqueNewJokes.length >= 10) return uniqueNewJokes.slice(0, 10);

      const newBatch = await jokesApi.getTenJokes();
      const filtered = newBatch.filter(
        (joke) =>
          !existingIds.has(joke.id) &&
          !uniqueNewJokes.find((j) => j.id === joke.id)
      );
      uniqueNewJokes = [...uniqueNewJokes, ...filtered];
      return tryLoad();
    };

    try {
      const jokes = await tryLoad();
      console.log(jokes, "jokes");
      return jokes;
    } catch {
      return rejectWithValue("Failed to load more jokes");
    }
  }
);

export const addRandomJoke = createAsyncThunk<
  Joke,
  void,
  { rejectValue: string; state: { jokes: JokesState } }
>(
  "jokes/addRandom",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const existingIds = new Set(state.jokes.jokes.map(j => j.id));

    try {
      let joke: Joke | null = null;
      do {
        joke = await jokesApi.getRandomJoke();
      } while (existingIds.has(joke.id));

      console.log(joke, "joke");
      localStorageUtils.add(joke)
      return joke;
    } catch {
      return thunkAPI.rejectWithValue("Failed to add joke");
    }
  }
);

export const refreshJoke = createAsyncThunk<
  { id: number; newJoke: Joke },
  number,
  { rejectValue: string; state: { jokes: JokesState } }
>(
  "jokes/refresh",
  async (id: number, thunkAPI) => {
    const state = thunkAPI.getState();
    const existingIds = new Set(state.jokes.jokes.map(j => j.id));

    try {
      let joke: Joke | null = null;
      do {
        joke = await jokesApi.getRandomJoke();
      } while (existingIds.has(joke.id));

      localStorageUtils.refresh(id, joke);
      return { id, newJoke: joke };
    } catch {
      return thunkAPI.rejectWithValue("Failed to refresh joke");
    }
  }
);

const jokesStore = createSlice({
  name: "jokes",
  initialState,
  reducers: {
    removeJoke: (state, action: PayloadAction<number>) => {
      state.jokes = state.jokes.filter((joke) => joke.id !== action.payload);
      localStorageUtils.remove(action.payload)
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, fetchInitialJokes, "fetchInitial", (state, action) => {
      state.jokes = action.payload;
    });
  
    handleAsyncThunk(builder, loadMoreJokes, "loadMore", (state, action) => {
      state.jokes.push(...action.payload);
    });
  
    handleAsyncThunk(builder, addRandomJoke, "add", (state, action) => {
      state.jokes.push(action.payload);
    });
  
    handleAsyncThunk(builder, refreshJoke, "refresh", (state, action) => {
      const index = state.jokes.findIndex((j) => j.id === action.payload.id);
      state.jokes[index] = action.payload.newJoke;
    });
  }
});

const handleAsyncThunk = <Returned, ThunkArg, RejectedValue>(
  builder: ActionReducerMapBuilder<JokesState>,
  thunk: AsyncThunk<Returned, ThunkArg, { rejectValue: RejectedValue }>,
  statusKey: StatusKey,
  onFulfilled?: (state: JokesState, action: PayloadAction<Returned>) => void
) => {
  
  builder
    .addCase(thunk.pending, (state) => {
      state.status[statusKey] = "loading";
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.status[statusKey] = "succeeded";
      onFulfilled?.(state, action);
    })
    .addCase(thunk.rejected, (state, action) => {
      state.status[statusKey] = "failed";
      state.error = action.payload as string;
    });
}

export const { removeJoke } = jokesStore.actions;
export default jokesStore.reducer;
