interface AddCommentProps {
  body: string;
  url: string;
}

export const addComment = async ({ body, url }: AddCommentProps) => {
  await fetch(url, {
    method: 'post',
    body: JSON.stringify({ body }),
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOCKEN}`,
    }
  }).then((response) =>  response.json());
}
