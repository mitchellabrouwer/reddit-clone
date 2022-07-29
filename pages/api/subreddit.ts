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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  console.log(typeof req.body);
  console.log(req.body.description);

  if (req.method === "POST") {
    await prisma.subreddit.create({
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });
    return res.end();
  }

  return res.end();
}
