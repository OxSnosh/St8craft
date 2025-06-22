import { GetPostsDocument, execute } from "~~/.graphclient";

interface Post {
  id: string;
  post: string;
}

const PostsTableServer = async ({ nationId }: { nationId: string }) => {
  const { data, errors } = await execute(GetPostsDocument, { sender: nationId });
  const postData: Post[] = data?.posts ?? [];

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl w-full max-w-2xl">
        <table className="table bg-base-100 table-zebra w-full">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">All Posts</th>
            </tr>
          </thead>
          <tbody>
            {postData.length > 0 ? (
              postData.map(post => (
                <tr key={post.id}>
                  <td>{post.post}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center text-gray-500">No posts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsTableServer;
