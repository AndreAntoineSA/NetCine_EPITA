import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";

import "./Movies.css";
import { db } from "./firebase";
import firebase from "firebase";

function Movies({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

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
      rating: rating,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
    setRating("");
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
            <strong className="comment">{comment.username}</strong> {comment.text}{" "}
            
              <strong className="rating">Rated:{comment.rating}</strong>
            
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
          <input
            className="post_input"
            type="number"
            placeholder="Add a rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
