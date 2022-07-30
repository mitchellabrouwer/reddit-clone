import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.method === "GET") {
    const query = parseInt(req.query.comment, 10);

    if (!query) {
      return res.status(401).json({ message: "no comment id found" });
    }

    const vote = await prisma.vote.findUnique({
      where: {
        authorId_commentId: {
          authorId: user.id,
          commentId: query,
        },
      },
    });

    console.log(vote);

    const upvotes = await prisma.vote.count({
      where: { commentId: query, up: true },
    });

    const downvotes = await prisma.vote.count({
      where: { commentId: query, up: false },
    });

    return res.json({ vote, votes: upvotes - downvotes });
  }

  if (req.method === "POST") {
    if (req.body.post && req.body.comment) {
      return res.status({ message: "Must be a comment OR a post" });
    }

    if (req.body.post) {
      await prisma.vote.upsert({
        where: {
          authorId_postId: {
            authorId: user.id,
            postId: req.body.post,
          },
        },
        update: { up: req.body.up },
        create: {
          up: req.body.up,
          post: { connect: { id: req.body.post } },
          author: { connect: { id: user.id } },
        },
      });
    }

    if (req.body.comment) {
      await prisma.vote.upsert({
        where: {
          authorId_commentId: {
            authorId: user.id,
            commentId: req.body.comment,
          },
        },
        update: { up: req.body.up },
        create: {
          up: req.body.up,
          comment: { connect: { id: req.body.comment } },
          author: { connect: { id: user.id } },
        },
      });
    }

    return res.end();
  }

  return res.end();
}
