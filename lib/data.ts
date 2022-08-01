/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */

import { PrismaClient } from "@prisma/client";

/* eslint-disable camelcase */
export const getPosts = async (prisma: PrismaClient, take: number, cursor?) => {
  const posts = await prisma.post.findMany({
    where: {},
    orderBy: [{ id: "desc" }],
    include: { author: true },
    take,
    cursor,
    skip: cursor ? 1 : 0,
  });

  return posts;
};

export const getJoinedPosts = async (
  following,
  prisma: PrismaClient,
  take: number,
  cursor?
) => {
  const joined = following.map((subreddit) => subreddit.subredditName);
  console.log(joined);

  const posts = await prisma.post.findMany({
    where: { subredditName: { in: joined } },
    orderBy: [{ id: "desc" }],
    include: { author: true },
    take,
    cursor,
    skip: cursor ? 1 : 0,
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

export const getPostsFromSubreddit = async (
  subreddit: string,
  prisma: PrismaClient,
  take: number,
  cursor?
) => {
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
    take,
    cursor,
    skip: cursor ? 1 : 0,
  });

  return posts;
};

const fetchCommentsOfComments = async (comments, prisma) => {
  const fetchCommentsOfComment = async (comment, prisma) => {
    comment.comments = await getComments(comment.id, prisma);
    return comment;
  };

  return Promise.all(
    comments.map((comment) => {
      comment = fetchCommentsOfComment(comment, prisma);
      return comment;
    })
  );
};

const getComments = async (parent_id, prisma: PrismaClient) => {
  let comments = await prisma.comment.findMany({
    where: {
      parentId: parent_id,
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

  if (comments.length) {
    comments = await fetchCommentsOfComments(comments, prisma);
  }

  return comments;
};

export const getPost = async (id, prisma) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        where: {
          parentId: null,
        },
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

  if (post.comments) {
    post.comments = await fetchCommentsOfComments(post.comments, prisma);
  }

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

export const getVote = async (postId, userId, prisma) => {
  const vote = await prisma.vote.findMany({
    where: { postId, authorId: userId },
  });

  if (vote.length === 0) {
    return null;
  }

  return vote[0];
};

export const getCommentVotes = async (commentId, prisma) => {
  const upvotes = await prisma.vote.count({
    where: { commentId, up: true },
  });

  const downvotes = await prisma.vote.count({
    where: { commentId, up: false },
  });

  return upvotes - downvotes;
};

export const getCommentVote = async (commentId, userId, prisma) => {
  const vote = await prisma.vote.findMany({
    where: { commentId, authorId: userId },
  });

  if (vote.length === 0) {
    return null;
  }

  return vote[0];
};

export const getUser = async (name, prisma) => {
  const user = await prisma.user.findUnique({
    where: { name },
  });

  return user;
};

export const getPostsFromUser = async (
  user_name,
  prisma: PrismaClient,
  take: number,
  cursor?
) => {
  const posts = await prisma.post.findMany({
    where: { author: { name: user_name } },
    orderBy: [{ id: "desc" }],
    include: {
      author: true,
      comments: {
        where: {
          parentId: null,
        },
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
    take,
    cursor,
    skip: cursor ? 1 : 0,
  });

  const postsWithComments = Promise.all(
    posts.map(async (post) => {
      if (post.comments) {
        post.comments = await fetchCommentsOfComments(post.comments, prisma);
      }
      return post;
    })
  );

  return postsWithComments;
};

export const getFollowing = async (userId, prisma) => {
  const following = await prisma.following.findMany({
    where: {
      userId,
    },
  });

  return following;
};
