import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

import styles from './Posts.module.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [comments, setComments] = useState({});
  const location = useLocation();
  const params = qs.parse(location.search.substring(1));
  const classId = params.classId;

  const createPost = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:4002/create_post', { classId, postTitle });
    setPosts(res.data);
    setPostTitle("");

    Object.values(res.data).map(post => {
      comments[post.id] = "";
    });
  }

  const commentHandler = (e, postId) => {
    setComments({...comments, [postId]:e.target.value});
  }

  const createComment = async (e, postId) => {
    e.preventDefault();
    setComments(comments);

    // make add_comment axios request here
    await axios.post('http://localhost:4002/add_comment', {
      id: postId,
      class: classId,
      text: comments[postId]
    });
  }

  const renderComments = (commentArr) => {

    var allComments = <div></div>;
    allComments = Object.values(commentArr).map(text => {
      return (
        <p className={styles.commentTitle}>C: {text}</p>
      )
    })

    return allComments
  }

   var renderedPosts = <div></div>;
   if (Object.keys(posts).length > 0) {
     renderedPosts = Object.values(posts).map(post => {
       console.log('rendering posts.');
       return (
         <form key={post.id} className={styles.singlePost} onSubmit={e => createComment(e, post.id)}>
            <p className={styles.postTitle}>
              Q: {post.title}
            </p>
            {renderComments(post.comments)}
            <input
              name={post.id}
              className={styles.commentText}
              value={comments[post.id] || ""}
              type="text"
              onChange={e => commentHandler(e, post.id)}
              required
              placeholder="Comment"
            />
            <button className={styles.commentBtn}>COMMENT</button>

          </form>
       );
     });
   }

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('http://localhost:4002/get_posts/' + classId);
      setPosts(res.data);
    };
    
    fetchPosts();
  }, []);

  return (
    <div className={styles.centerPosts}>
    <div className={styles.colorBox}></div>
    <h2 className={styles.classTitle}>{params.title}</h2>

      <form onSubmit={createPost}>
        <input
          className={styles.postText}
          value={postTitle}
          type="text"
          onChange={e => setPostTitle(e.target.value)}
          required
          placeholder="Make a post"
        />
        <button className={styles.postBtn}>POST</button>
      </form>
      <div className={styles.allPosts}>
        {renderedPosts}
      </div>
    </div>
  );
}

export default Posts;
