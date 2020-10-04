import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";

import "./Movies.css";
import { db } from "./firebase";
import firebase from "firebase";

function Movies({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("movies")
        .doc(postId)
        .collection("review")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("movies").doc(postId).collection("review").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="movies">
      <div className="movies_header">
        <Avatar
          className="movies_avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <img className="movie_image" src={imageUrl} alt="user post" />

      <h4 className="movie_caption">
        <strong>{username} </strong> {caption}
      </h4>

      <div className="review">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post_comment">
          <input
            className="post_input"
            type="text"
            placeholder="Add a review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post_button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Movies;
