import { NavLink } from "react-router-dom";
import style from "./header.module.css";

const Header = () => {
  return (
    <header className={style.header}>
      <nav className={style.linkContainer}>
        <NavLink to="/home"> Home</NavLink>
        <NavLink to="/collection"> Collection</NavLink>
      </nav>
      <div className={style.loginContainer}>
        <NavLink to="/account">Account</NavLink>
        <NavLink to="/login">Connect</NavLink>
      </div>
    </header>
  );
};

export default Header;
