import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/feed/" + username)
        : await axios.get("/posts/timeline/" + user.id);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.date) - new Date(p1.date);
        })
      );

      // const res = await axios.get("/posts/feed/" + user.id);
      setPosts(res.data);
    };
    fetchPosts();
  }, [username, user.id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
