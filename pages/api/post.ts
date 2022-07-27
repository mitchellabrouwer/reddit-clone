import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(501).end();
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.method === "POST") {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        subreddit: { connect: { name: req.body.subreddit_name } },
        author: { connect: { id: user.id } },
      },
    });

    return res.json(post);
  }

  return res.end();
}
