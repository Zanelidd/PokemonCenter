import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';

const NavLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default NavLayout;
