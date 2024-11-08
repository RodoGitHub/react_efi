import { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

function Posts() {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts') 
      .then((response) => response.json()) 
      .then((data) => {
        setPosts(data); 
        setLoading(false); 
      })
      .catch((err) => {
        setError(err.message); 
        setLoading(false); 
      });
  }, []); 

  if (loading) {
    return (
      <div>
        <ProgressSpinner />
        <p>Cargando posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ProgressSpinner />
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
