import type { Joke } from "../types";
import { get } from "./http";

const jokesApi = {
  getTenJokes: () => get<Joke[]>(`jokes/ten`),
  getRandomJoke: () => get<Joke>(`jokes/random`),
};

export default jokesApi;
