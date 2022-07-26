import timeago from "../lib/timeago";

function Comment({ comment }) {
  return (
    <div className="mt-6">
      <p>
        {comment.author.name} {timeago.format(new Date(comment.createdAt))}
      </p>
      <p>{comment.content}</p>
    </div>
  );
}

export default function Comments({ comments }) {
  if (!comments) {
    return null;
  }
  return (
    <>
      {comments.map((comment, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Comment key={index} comment={comment} />
      ))}
    </>
  );
}
