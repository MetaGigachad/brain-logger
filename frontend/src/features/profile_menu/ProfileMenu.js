import { wallet } from "../../wallet.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, loadUser } from "../users/usersSlice.js";

export function ProfileMenu({ menuRef }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [editorMode, setEditorMode] = useState(false);
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    if (!(wallet.accountId in users.data)) {
      dispatch(fetchUser(wallet.accountId));
    }
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSumbit = (_event) => {
    dispatch(loadUser(inputs));
    setEditorMode(false);
  };

  if (editorMode) {
    return (
      <div className="profile-menu__wrap" ref={menuRef}>
        <form className="profile-menu" onSubmit={handleSumbit}>
          <p className="profile-menu__block account-id">{wallet.accountId}</p>
          <div className="profile-menu__block profile-menu__credentials">
            <p className="credential__title">
              Name
              <input
                type="text"
                name="name"
                className="credential__input"
                value={inputs.name || ""}
                onChange={handleChange}
              />
            </p>
            <p className="credential__title">
              Surname
              <input
                type="text"
                name="surname"
                className="credential__input"
                value={inputs.surname || ""}
                onChange={handleChange}
              />
            </p>
            <p className="credential__title">
              Photo
              <input
                type="text"
                name="photo_url"
                className="credential__input"
                value={inputs.photo_url || ""}
                onChange={handleChange}
              />
            </p>
          </div>
          <div className="profile-menu__buttons">
            <button
              className="profile-menu__block button-cancel"
              onClick={() => setEditorMode(false)}
            >
              Cancel
            </button>
            <input type="submit" className="profile-menu__block button-apply" />
          </div>
        </form>
      </div>
    );
  }

  let user = {name: "empty", surname: "empty", photo_url: "empty"};
  if (wallet.accountId in users.data) {
    user = {...user, ...users.data[wallet.accountId]};
  }

  return (
    <div className="profile-menu__wrap" ref={menuRef}>
      <div className="profile-menu">
        <p className="profile-menu__block account-id">{wallet.accountId}</p>
        <div className="profile-menu__block profile-menu__credentials">
          <p className="credential__title">
            Name
            <span className="credential__content">{user.name}</span>
          </p>
          <p className="credential__title">
            Surname
            <span className="credential__content">{user.surname}</span>
          </p>
          <p className="credential__title">
            Photo
            <span className="credential__content">{user.photo_url}</span>
          </p>
        </div>
        <div className="profile-menu__buttons">
          <button
            className="profile-menu__block button-edit-credentials"
            onClick={() => setEditorMode(true)}
          >
            Edit
          </button>
          <button
            className="profile-menu__block button-sign-out"
            onClick={() => wallet.signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
