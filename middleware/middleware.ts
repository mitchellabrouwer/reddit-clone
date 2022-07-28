import multiparty from "multiparty";
import nextConnect from "next-connect";

const middleware = nextConnect();

middleware.use(async (req, res, next) => {
  const form = new multiparty.Form();

  await form.parse(req, (error, fields, files) => {
    // @ts-ignore
    req.body = fields;
    // @ts-ignore
    req.files = files;
    next();
  });
});

export default middleware;
