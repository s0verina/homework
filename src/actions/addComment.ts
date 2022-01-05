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
  }).then(async (res) => {
    if (!res.ok) {
      const error = new Error('An error occurred while posting comment.');
      throw error;
    }

    return res.json();
  });
}
