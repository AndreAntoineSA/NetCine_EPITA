import React, { useState, useEffect } from "react";
import "./App.css";
import Movies from "./Movies";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import axios from "./axios";
import Pusher from "pusher-js";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [movies, setMovies] = useState([]); // react hooks
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  // run a code based on a specification
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // logged in user
        console.log(authUser);
        setUser(authUser);
        if (authUser.displayName) {
          // username not updated
        } else {
          // when new user is created
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // logged out user
        setUser(null);
      }
    });
    return () => {
      //perform some cleaning actions
      unsubscribe();
    };
  }, [user, username]);

  const fetchPosts = async () =>
    await axios.get("/sync").then((response) => {
      console.log(response);
      setMovies(response.data);
    });

  useEffect(() => {
    const pusher = new Pusher("2b69997430639cdbd8c3", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("posts");
    channel.bind("inserted", function (data) {
      fetchPosts();
    });
  });

  useEffect(() => {
    fetchPosts();

    //firebase code
    /*db.collection("movies")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMovies(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            movie: doc.data(),
          }))
        );
      });*/
  }, []);
  console.log("post are >>>", movies);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="App_signUp">
            <center>
              <img
                className="App_headImg nav_logo"
                src="NetCinélogo.png"
                alt="logo"
              ></img>
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up{" "}
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        className="modal"
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="App_signUp">
            <center>
              <img
                className="App_headImg  nav_logo "
                src="NetCinélogo.png"
                alt="logo"
              ></img>
            </center>

            <Input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In{" "}
            </Button>
          </form>
        </div>
      </Modal>
      <div class="App_head">
        <img
          className="App_headImg nav_logo"
          src="NetCinélogo.png"
          alt="NetCiné"
        ></img>
        {user ? (
          <Button color="primary" onClick={() => auth.signOut()}>
            Logout{" "}
          </Button>
        ) : (
          <div>
            <Button
              // variant="outlined"
              color="primary"
              onClick={() => setOpenSignIn(true)}
            >
              Sign In{" "}
            </Button>
            <Button
              // variant="outlined"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Sign Up{" "}
            </Button>
          </div>
        )}
      </div>
      {/* movies posting */}
      <div className="App_posts">
        <div className="App_postLeft">
          {movies.map((post) => (
            <Movies
              user={user}
              key={post._id}
              postId={post._id}
              //username={movie.username}
              username={post.user}
              caption={post.caption}
              imageUrl={post.image}
            ></Movies>
          ))}
        </div>
      </div>
      <div className="App_postRight">
        {user?.displayName ? (
          <div className="imgUpload">
            <ImageUpload username={user.displayName} />
          </div>
        ) : (
          <h3>Please Log In to continue...</h3>
        )}
      </div>
    </div>
  );
}

export default App;
