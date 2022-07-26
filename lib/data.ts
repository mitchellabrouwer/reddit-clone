export const getPosts = async (prisma) => {
  const posts = await prisma.post.findMany({
    where: {},
    orderBy: [{ id: "desc" }],
    include: { author: true },
  });

  return posts;
};

export const getSubreddit = async (name, prisma) => {
  const post = await prisma.subreddit.findUnique({
    where: {
      name,
    },
  });

  return post;
};

export const getPostsFromSubreddit = async (subreddit, prisma) => {
  const posts = await prisma.post.findMany({
    where: {
      subreddit: {
        name: subreddit,
      },
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      author: true,
    },
  });

  return posts;
};

export const getPost = async (id, prisma) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        orderBy: [
          {
            id: "desc",
          },
        ],
        include: {
          author: true,
        },
      },
    },
  });

  return post;
};

export const getVotes = async (post, prisma) => {
  const upvotes = await prisma.vote.count({
    where: { postId: post, up: true },
  });

  const downvotes = await prisma.vote.count({
    where: { postId: post, up: false },
  });

  return upvotes - downvotes;
};

// eslint-disable-next-line camelcase
export const getVote = async (post_id, user_id, prisma) => {
  const vote = await prisma.vote.findMany({
    // eslint-disable-next-line camelcase
    where: { postId: post_id, authorId: user_id },
  });

  if (vote.length === 0) {
    return null;
  }

  return vote[0];
};
