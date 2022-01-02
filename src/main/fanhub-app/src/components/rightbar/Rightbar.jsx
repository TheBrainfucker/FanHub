import "./rightbar.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove, Search } from "@material-ui/icons";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.subscriptionids.includes(user?.id)
  );

  useEffect(() => {
    const getFriends = async () => {
      try {
        console.log("Rightbar user: " + user.id);
        const subscriptions = await axios.get(
          "/users/subscriptions/" + user.id
        );
        setFriends(subscriptions.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        console.log("Rightbar user: " + currentUser.id);
        const suggestions = await axios.get(
          "/users/suggestions/" + currentUser.id
        );
        console.log(suggestions);
        setSuggestions(suggestions.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSuggestions();
  }, [currentUser]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user.id}/unsubscribe/${currentUser.id}`);
        dispatch({ type: "UNFOLLOW", payload: user.id });
      } else {
        await axios.put(`/users/${user.id}/subscribe/${currentUser.id}`);
        dispatch({ type: "FOLLOW", payload: user.id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="rightbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input placeholder="Search Fanhub" className="searchInput" />
          </div>
        </div>

        <h4 className="rightbarTitle">Suggestions</h4>
        <div className="rightbarFollowings">
          {suggestions.map((suggestions) => (
            <Link
              to={"/profile/" + suggestions.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    suggestions.profilepic
                      ? PF + suggestions.profilepic
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {suggestions.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unsubscribe" : "Subscribe"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">Intro</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship ? user.relationship : "Complicated"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">Subscriptions</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilepic
                      ? PF + friend.profilepic
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
