import "./rightbar.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove, Search } from "@material-ui/icons";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [creators, setCreators] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [subscribed, setSubscribed] = useState(
    currentUser.subscriptionids.includes(user?.id)
  );

  useEffect(() => {
    const getCreators = async () => {
      try {
        const creators = await axios.get(
          "/users/subscriptions/" + currentUser.id
        );
        setCreators(creators.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCreators();
  }, [user]);

  useEffect(() => {
    const getSuggestions = async () => {
      try {
        const suggestions = await axios.get(
          "/users/suggestions/" + currentUser.id
        );
        setSuggestions(suggestions.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSuggestions();
  }, [currentUser]);

  const handleClick = async () => {
    try {
      if (subscribed) {
        await axios.put(`/users/${user.id}/unsubscribe/${currentUser.id}`);
        dispatch({ type: "UNSUBSCRIBE", payload: user.id });
      } else {
        await axios.put(`/users/${user.id}/subscribe/${currentUser.id}`);
        dispatch({ type: "SUBSCRIBE", payload: user.id });
      }
      setSubscribed(!subscribed);
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
              to={"/" + suggestions.username}
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
            {subscribed ? "Unsubscribe" : "Subscribe"}
            {subscribed ? <Remove /> : <Add />}
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
        {user.username === currentUser.username && (
          <h4 className="rightbarTitle">Subscriptions</h4>
        )}
        {user.username === currentUser.username && (
          <div className="rightbarFollowings">
            {creators.map((creator) => (
              <Link
                to={"/" + creator.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      creator.profilepic
                        ? PF + creator.profilepic
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {creator.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
