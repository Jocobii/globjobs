import { useQuery, gql } from '@apollo/client';

const POSTS_QUERY = gql`
  query PostsQuery {
    posts {
      id
      title
    }
  }
`;

type Post = {
  id: string;
  title: string;
};

type PostsQuery = {
  posts: Post[];
};

export default function PostList() {
  const { data, loading, error } = useQuery<PostsQuery>(POSTS_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error :(</div>;
  if (!data) return <div>No data</div>;

  return (
    <ul>
      {data.posts.map(({ id, title }) => (
        <li key={id}>{title}</li>
      ))}
    </ul>
  );
}
