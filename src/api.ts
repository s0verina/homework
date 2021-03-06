export const GIPHY_API_URL = `http://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}`;
export const GITHUB_API_URL = 'https://api.github.com/';

export function fetcher<T>(url: string): Promise<T>  {
  return fetch(url, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOCKEN}`,
    }}).then(async (res) => {
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.message = await res.json();
      throw error;
    }

    return res.json();
  })
}
