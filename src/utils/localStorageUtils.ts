import type { Joke } from "../types";

const get = (): Joke[] => {
  const saved = localStorage.getItem("jokes");
  return saved ? JSON.parse(saved) : [];
};

const add = (joke: Joke) => {
  const jokes = get();
  jokes.push(joke);
  localStorage.setItem("jokes", JSON.stringify(jokes));
};

const remove = (id: number) => {
  const jokes = get();
  const filtered = jokes.filter((joke) => joke.id !== id);
  localStorage.setItem("jokes", JSON.stringify(filtered));
};

export const localStorageUtils = { get, add, remove };

