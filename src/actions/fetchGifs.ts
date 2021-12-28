import { GIPHY_API_URL } from '../api';

const LIMIT = 20;

export const fetchGifs = async (text: string, offset = 0) => {
  return fetch(`${GIPHY_API_URL}&q=${text}&limit=${LIMIT}&offset=${offset}`)
    .then(res => res.json())
    .catch(() => []);
}
