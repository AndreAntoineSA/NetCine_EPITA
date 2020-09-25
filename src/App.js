import React, { useState, useEffect } from "react";
import "./App.css";
import Movies from "./Movies";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

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

  useEffect(() => {
    db.collection("movies")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setMovies(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            movie: doc.data(),
          }))
        );
      });
  }, []);

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
                className="App_headImg"
                src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
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
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="App_signUp">
            <center>
              <img
                className="App_headImg"
                src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
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
          className="App_headImg"
          src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
          alt="NetCiné"
        ></img>
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout </Button>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Sign In </Button>
            <Button onClick={() => setOpen(true)}>Sign Up </Button>
          </div>
        )}
      </div>
      <div className="App_posts">
        {movies.map(({ id, movie }) => (
          <Movies
            key={id}
            postId={id}
            user={user}
            username={movie.username}
            caption={movie.caption}
            imageUrl={movie.imageUrl}
          ></Movies>
        ))}
      </div>

      {user?.displayName ? (
        <div className="imgUpload"> 
        <ImageUpload username={user.displayName} />
        </div>
      ) : (
        <h3>Please Log In to continue...</h3>
      )}
    </div>
  );
}

export default App;
