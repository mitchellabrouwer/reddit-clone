import Post from "./Post";

export default function Posts({ posts }) {
  if (!posts) return null;

  return (
    <>
      {posts.map((post, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Post key={index} post={post} />
      ))}
    </>
  );
}
