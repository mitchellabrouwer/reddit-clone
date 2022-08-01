import { getPosts, getPostsFromUser } from "../../lib/data";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(501).end();
  }

  const take = parseInt(req.query.take || 2, 10);
  const cursor = parseInt(req.query.cursor, 10) || null;
  const { user } = req.query;

  if (!cursor) {
    res.status(400).send({ error: "Missing cursor parameter" });
  }

  let tweets;
  if (user) {
    tweets = await getPosts(prisma, take, { id: cursor });
  } else {
    tweets = await getPostsFromUser(user, prisma, take, { id: cursor });
  }
  return res.json(tweets);
}
