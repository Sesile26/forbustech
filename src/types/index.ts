export type Joke = {
  id: number;
  type: string;
  setup: string;
  punchline: string;
};


export type FetchStatus = "idle" | "loading" | "succeeded" | "failed";

export type JokesState = {
  jokes: Joke[];
  status: {
    fetchInitial: FetchStatus;
    loadMore: FetchStatus;
    add: FetchStatus;
    refresh: FetchStatus;
  };
  error: string | null;
}

export type StatusKey = keyof JokesState["status"];