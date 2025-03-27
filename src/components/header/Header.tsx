import {NavLink} from 'react-router-dom';
import style from './header.module.css';
import {useUser} from '../../stores/UserStore';

import {useState} from "react";
import SearchCard from "../searchCard/SearchCard.tsx";

const Header = () => {
    const {toggleModal, showModal, isAuthenticated, logout} = useUser();
    const [openBurger, setOpenBurger] = useState(false);


    const handleModalOpen = () => {
        toggleModal();
        setOpenBurger(false)
    }


    return (<>
            <header className={`${style.header} `}>
                <div className={style.hamburgerContainer} onClick={() => setOpenBurger(!openBurger)}>
                    <div className={style.hamburger}>
                        <div className={`${style.burger} ${style.burger1} ${openBurger ? style.isOpen : ""}`}></div>
                        <div className={`${style.burger} ${style.burger2} ${openBurger ? style.isOpen : ""}`}></div>
                        <div className={`${style.burger} ${style.burger3} ${openBurger ? style.isOpen : ""}`}></div>
                    </div>
                </div>
                <div className={`${openBurger ? style.headerContainerBurger : style.headerContainer  }`}>
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
                            <button
                                onClick={() => {
                                    logout();
                                    setOpenBurger(false)
                                }}
                            >
                                Logout
                            </button>
                        ) : (
                            <button type="button" disabled={showModal}
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
        </>
    )
        ;
};

export default Header;
