/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from "react";
import timeago from "../lib/timeago";
import NewComment from "./NewComment";

function Comment({ comment, post }) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="mt-6">
      <p>
        {comment.author.name} {timeago.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>

      {showReply ? (
        <div className="pl-10">
          <NewComment post={post} comment={comment} />
        </div>
      ) : (
        <p
          className="cursor-pointer text-sm underline"
          onClick={() => setShowReply(true)}
        >
          reply
        </p>
      )}
    </div>
  );
}

export default function Comments({ comments, post }) {
  if (!comments) {
    return null;
  }
  return (
    <>
      {comments.map((comment, index) => (
        <div key={index}>
          <Comment key={index} comment={comment} post={post} />
          {comment.comments && (
            <div className="pl-10">
              <Comments comments={comment.comments} post={post} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
