import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [comment, setComment] = useState("");
  const location = useLocation();
  const params = qs.parse(location.search.substring(1));
  const classId = params.classId;

  const createPost = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:4002/create_post', { classId, postTitle });
    console.log('createpostresult: ', res);
    setPostTitle("");
  }

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:4002/get_posts/' + classId);
    console.log('Server req', res.data);

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

   var renderedPosts = <div></div>;
   if (Object.keys(posts).length > 0) {
     renderedPosts = Object.values(posts).map(post => {
       return (
         <form>
            <input
              value={comment}
              type="text"
              onChange={e => setComment(e.target.value)}
              required
              placeholder="Comment"
            />
            <button>COMMENT</button>
          </form>
       );
     });
   }

  return (
    <div>
      Classroom Title: {params.title}
      <form onSubmit={createPost}>
        <input
          value={postTitle}
          type="text"
          onChange={e => setPostTitle(e.target.value)}
          required
          placeholder="Username"
        />
        <button>POST</button>
      </form>
      <div>
        Post 1
      </div>
      <div>
        Post 2
      </div>
    </div>
  );
}

export default Posts;
