import { useUser } from "../../services/stores/UserStore";

const Account = () => {
  const { user } = useUser();
  return (
    <>
      <h1>Account</h1>
      <p>{user?.username}</p>
    </>
  );
};

export default Account;
