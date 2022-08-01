interface LoadMoreProps {
  posts: any;
  setPosts: any;
  // take: number;
  user?: string;
}

export default function LoadMore({ posts, setPosts, user }: LoadMoreProps) {
  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        className="color-accent-contrast bg-color-accent hover:bg-color-accent-hover mt-0 mr-2 justify-self-center rounded-full border px-8 py-2 font-bold "
        onClick={async () => {
          const lastPostId = posts[posts.length - 1].id;
          const res = await fetch(
            `/api/posts?take=2&cursor=${lastPostId}${
              user ? `&user=${user}` : ""
            }}`
          );
          const data = await res.json();
          setPosts([...posts, ...data]);
        }}
      >
        Load more
      </button>
    </div>
  );
}
