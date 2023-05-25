import { prettyDate } from "../../utils.js";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../users/usersSlice.js";

export function Message({ message }) {
  const [date, setDate] = useState(Date.now());
  const dispactch = useDispatch();
  const users = useSelector((state) => state.users);

  useEffect(() => {
    if (!(message.sender in users.data)) {
      dispactch(fetchUser(message.sender));
    }

    const interval = setInterval(() => setDate(Date.now()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  let user = {};
  if (message.sender in users.data) {
    user = users.data[message.sender];
  }

  let name = "";
  if ("name" in user && user.name.length > 0) {
    name = user.name;
  }
  if ("surname" in user && user.surname.length > 0 && name.length > 0) {
    name = `${name} ${user.surname}`;
  }
  if (name.length === 0) {
    name = message.sender;
  }

  return (
    <div
      className={
        message.sending === true
          ? "message main--box message--loading"
          : "message main--box"
      }
    >
      {user && "photo_url" in user ? (
        <div
          className="message__icon"
          style={{ backgroundImage: `url(${user.photo_url})` }}
        ></div>
      ) : (
        <div className="message__icon"></div>
      )}
      <div className="message__username">
        {name}
        {name !== message.sender && (
          <span className="message__wallet">{message.sender}</span>
        )}
      </div>
      <div className="message__time">{prettyDate(message.timestamp, date)}</div>
      <pre className="message__text">{message.text}</pre>
    </div>
  );
}
