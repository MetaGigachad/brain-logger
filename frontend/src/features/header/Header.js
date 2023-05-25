import { useRef } from "react";
import logo from "../../../assets/logo.svg";
import { wallet } from "../../wallet.js";
import { ProfileMenu } from "../profile_menu/ProfileMenu.js";
import downArrow from "../../../assets/down-arrow.svg";
import { useSelector } from "react-redux";

export function Header({ isSignedIn }) {
  const menuRef = useRef();
  const users = useSelector((state) => state.users);

  function toggleProfileMenu() {
    menuRef.current.classList.toggle("profile-menu-open");
  }

  let user = {};
  if (wallet.accountId in users.data) {
    user = users.data[wallet.accountId];
  }

  return (
    <header>
      <img className="header__logo" src={logo} alt="Brain Logger Logo" />
      <h1 className="header__name">Brain Logger</h1>
      {isSignedIn ? (
        <>
          <div className="profile-button" onClick={toggleProfileMenu}>
            <img className="down-arrow" src={downArrow} />
            {user && "photo_url" in user ? (
              <div
                className="profile-icon"
                style={{ backgroundImage: `url(${user.photo_url})` }}
              ></div>
            ) : (
              <div className="profile-icon"></div>
            )}
          </div>
          <ProfileMenu menuRef={menuRef} />
        </>
      ) : (
        <button className="header__button" onClick={() => wallet.signIn()}>
          Sign In
        </button>
      )}
    </header>
  );
}
