import Link from "next/link";
import timeago from "../lib/timeago";

function Post({ post }) {
  return (
    <div className="border-3 mx-20 my-10 mb-4 flex flex-col border border-black bg-gray-200 p-10">
      <div className="flex flex-shrink-0 pb-0">
        <div className="group block flex-shrink-0">
          <div className="flex items-center text-gray-800">
            <Link href={`/r/${post.subredditName}`}>
              <a className="mr-2 underline">/r/{post.subredditName}</a>
            </Link>
            /r/{post.subredditName} Posted by {post.author.name}
            <Link href={`/r/${post.subredditName}/comments/${post.id}`}>
              <a className="mx-2 underline">
                {timeago.format(new Date(post.createdAt))}
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Link href={`/r/${post.subredditName}/comments/${post.id}`}>
          <a className="color-primary width-auto flex-shrink text-2xl font-bold">
            {post.title}
          </a>
        </Link>
        {post.image && (
          <img
            className="color-primary width-auto mt-2 flex-shrink text-base font-normal"
            src={post.image}
          />
        )}
        <p className="color-primary width-auto flex-shrink text-2xl font-bold">
          {post.content}
        </p>
      </div>
    </div>
  );
}

export default Post;
