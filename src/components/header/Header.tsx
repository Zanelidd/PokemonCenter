import {NavLink} from 'react-router-dom';
import style from './header.module.css';
import {useAuthActions, useUser} from '../../stores/UserStore';
import {useState} from "react";
import SearchCard from "../searchCard/SearchCard.tsx";
import {authService} from "../../api/auth.service.ts";
import {queryClient} from "../../api/queryClient.ts";

const Header = () => {
    const {toggleModal, setLogout} = useAuthActions();
    const isAuthenticated = useUser(s => s.isAuthenticated);
    const isModalOpen = useUser(s => s.isModalOpen);
    const [openBurger, setOpenBurger] = useState(false);

    const handleModalOpen = () => {
        toggleModal();
        window.scrollTo({top: 0, behavior: 'smooth'});
        setOpenBurger(false);
    };

    const handleLogout = async () => {
        setLogout();
        queryClient.setQueryData(['me'], undefined);
        setOpenBurger(false);
        authService.logout().catch(() => {});
    };

    return <>
        <header className={`${style.header} `}>
            <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={openBurger}
                className={style.hamburgerContainer}
                onClick={() => setOpenBurger(!openBurger)}
            >
                <div className={style.hamburger}>
                    <div className={`${style.burger} ${style.burger1} ${openBurger ? style.isOpen : ""}`}></div>
                    <div className={`${style.burger} ${style.burger2} ${openBurger ? style.isOpen : ""}`}></div>
                    <div className={`${style.burger} ${style.burger3} ${openBurger ? style.isOpen : ""}`}></div>
                </div>
            </button>
            <div className={`${openBurger ? style.headerContainerBurger : style.headerContainer}`}>
                <nav className={`${style.linkContainer} ${openBurger ? style.navOpen : ''}`}>
                    <NavLink to="/home" onClick={() => setOpenBurger(false)}>Home</NavLink>
                    {isAuthenticated &&
                        <NavLink to="user/collection" onClick={() => setOpenBurger(false)}>Collection</NavLink>}
                </nav>
                {!openBurger && <SearchCard/>}
                <nav className={`${style.loginContainer} ${openBurger ? style.navOpen : ''}`}>
                    {isAuthenticated &&
                        <NavLink to="user/account" onClick={() => setOpenBurger(false)}>Account</NavLink>}
                    {isAuthenticated ? (
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    ) : (
                        <button type="button" disabled={isModalOpen}
                                onClick={() => {
                                    handleModalOpen();
                                }}
                        >
                            Connect
                        </button>
                    )}
                </nav>
            </div>
        </header>
    </>;
};

export default Header;
