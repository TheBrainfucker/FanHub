import "./post.css";
import { Delete } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${post.user.id}`);
      setUser(res.data);
      // console.log("Post user:" + user.username);
    };
    fetchUser();
  }, [post.user.id]);

  const handleDelete = async () => {
    const content = post.content;
    try {
      await axios.delete(`/posts/${post.id}/${currentUser.id}`);
      try {
        await axios.delete(`/posts/${content}`);
      } catch (err) {}
      window.location.reload();
    } catch (err) {}
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilepic
                    ? PF + user.profilepic
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.date)}</span>
          </div>
          <div className="postTopRight">
            <i onClick={handleDelete}>
              <Delete />
            </i>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.caption}</span>
          <img
            className="postImg"
            src={PF + "post/uploads/" + post.content}
            alt=""
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              // onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{post.love} fans love it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
