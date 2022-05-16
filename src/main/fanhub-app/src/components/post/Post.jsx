import "./post.css";
import { Delete } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [love, setLove] = useState(post.love);
  const [isLoved, setIsLoved] = useState();
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLoved(post.loversIds.includes(currentUser.id));
  }, [currentUser.id, post.lovers]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${post.user.id}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.user.id]);

  const loveHandler = () => {
    try {
      axios.put(`/posts/${post.id}/love/${currentUser.id}`);
    } catch (err) {}
    setLove(isLoved ? love - 1 : love + 1);
    setIsLoved(!isLoved);
  };

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
            src={post.content ? PF + "post/uploads/" + post.content : ""}
            alt=""
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={loveHandler}
              alt=""
            />
            <span className="postLikeCounter">{love} fans love it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
