import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  // moved this into a middleware
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
  //

  if (req.method === "GET") {
    const following = await prisma.following.findMany({
      where: {
        userId: user.id,
      },
    });

    return res.json(following);
  }

  if (req.method === "POST") {
    const followed = await prisma.following.findUnique({
      where: {
        subredditName_userId: {
          subredditName: req.body.subreddit,
          userId: user.id,
        },
      },
    });

    if (followed) {
      await prisma.following.delete({
        where: {
          subredditName_userId: {
            subredditName: req.body.subreddit,
            userId: user.id,
          },
        },
      });
    } else {
      await prisma.following.create({
        data: {
          subredditName: req.body.subreddit,
          userId: user.id,
        },
      });
    }

    return res.end();
  }

  return res.end();
}
