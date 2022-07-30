/* eslint-disable react/no-array-index-key */

import Comment from "./Comment";

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
