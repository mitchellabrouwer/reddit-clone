import AWS from "aws-sdk";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";
import path from "path";
import prisma from "../../lib/prisma";
import middleware from "../../middleware/middleware";

interface Request extends NextApiRequest {
  files?: {
    image: { path: string; originalFilename: string; size: number }[];
  };
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const uploadFile = (filePath, fileName, id) =>
  new Promise((resolve, reject) => {
    const content = fs.readFileSync(filePath);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `post-${id}${path.extname(fileName)}`,
      Body: content,
    };

    s3.upload(params, (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data.Location);
    });
  });

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: Request, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (path.extname(req.files.image[0].originalFilename)) {
    return res.status(401).json({ message: "Not image" });
  }

  if (req.files.image[0].size > 3072000) {
    return res.status(401).json({ message: "Image size too large" });
  }

  const post = await prisma.post.create({
    data: {
      title: req.body.title[0],
      content: req.body.content[0],
      subreddit: { connect: { name: req.body.subreddit_name[0] } },
      author: { connect: { id: user.id } },
    },
  });

  console.log(req.files);
  console.log(req.files.image[0]);

  if (req.files && req.files.image[0] && req.files.image[0].size > 0) {
    const location = await uploadFile(
      req.files.image[0].path,
      req.files.image[0].originalFilename,
      post.id
    );

    await prisma.post.update({
      where: { id: post.id },
      data: { image: location },
    });
  }

  return res.json(post);
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
