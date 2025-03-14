import { NavLink } from 'react-router-dom';
import style from './header.module.css';
import SearchCard from '../SearchCard/SearchCard';
import { useUser } from '../../services/stores/UserStore';

const Header = () => {
  const { toggleModal, isAuthenticated, logout } = useUser();

  return (
    <header className={style.header}>
      <nav className={style.linkContainer}>
        <NavLink to="/home"> Home</NavLink>
        {isAuthenticated && <NavLink to="user/collection"> Collection</NavLink>}
      </nav>
      <SearchCard />
      <div className={style.loginContainer}>
        {isAuthenticated && <NavLink to="user/account">Account</NavLink>}
        {isAuthenticated ? (
          <button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              toggleModal();
            }}
          >
            Connect
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
