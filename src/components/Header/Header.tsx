import { Link } from "react-router-dom";
import style from "./header.module.css";

const Header = () => {
  return (
    <header className={style.header}>
      <nav className={style.linkContainer}>
        <Link to="/home"> Home</Link>
        <Link to="/collection"> Collection</Link>
      </nav>
      <div className={style.loginContainer}>
        <Link to="/account">Account</Link>
        <Link to="/login">Connect</Link>
      </div>
    </header>
  );
};

export default Header;
