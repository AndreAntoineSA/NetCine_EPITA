import React,{useState} from "react";
import Avatar from "@material-ui/core/Avatar";

import "./Movies.css";

function Movies({ username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  return (
    <div className="movies">
      <div className="movies_header">
        <Avatar
          className="movies_avatar"
          alt="Andre"
          scr="static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <img className="movie_image" src={imageUrl} alt="user post" />

      <h4 className="movie_caption">
        <strong>{username} </strong> {caption}
      </h4>
    </div>
  );
}

export default Movies;
