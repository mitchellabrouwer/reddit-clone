import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.end();
  }

  const exists = await prisma.user.findUnique({
    where: { name: req.body.name },
  });

  console.log(exists);

  if (exists) {
    return res.status(422).json({ message: "Name already taken" });
  }

  if (req.method === "POST") {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: { name: req.body.name },
    });
  }

  return res.end();
}
