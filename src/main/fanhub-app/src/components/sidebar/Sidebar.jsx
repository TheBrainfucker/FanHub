import "./sidebar.css";
import {
  HomeRounded,
  Chat,
  PlayCircleFilledOutlined,
  Notifications,
  Bookmark,
  ExitToAppRounded,
  CreditCard,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);

  const handleLogout = async () => {
    dispatch({ type: "LOGOUT", payload: null });
  };

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                alt="Fanhub"
                src={PF + "logo/Fanhub1.png"}
                style={{ height: "36px", width: "100px" }}
              />
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to="/" style={{ textDecoration: "none" }}>
              <HomeRounded className="sidebarIcon" fontSize="large" />
            </Link>
            <span className="sidebarListItemText">Home</span>
          </li>
          <li className="sidebarListItem">
            <Notifications className="sidebarIcon" fontSize="large" />
            <span className="sidebarListItemText">Notifications</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" fontSize="large" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined
              className="sidebarIcon"
              fontSize="large"
            />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" fontSize="large" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <CreditCard className="sidebarIcon" fontSize="large" />
            <span className="sidebarListItemText">Add card</span>
          </li>
          <li className="sidebarListItem">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilepic
                    ? PF + user.profilepic
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="sidebarImg"
              />
            </Link>
            <span className="sidebarListItemText">{user.username}</span>
          </li>
          <li className="sidebarListItem">
            <Link to={`/login`} onClick={handleLogout}>
              <ExitToAppRounded className="sidebarIcon" fontSize="large" />
            </Link>
            <span className="sidebarListItemText">Logout</span>
          </li>
        </ul>
        <button className="sidebarButton">More...</button>
      </div>
    </div>
  );
}
