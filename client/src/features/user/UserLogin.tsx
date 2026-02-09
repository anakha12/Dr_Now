import LoginForm from "../../components/LoginForm";
import { loginUser } from "../../services/userService";
import { setUserAuth } from "../../redux/slices/authSlice";
import { userLoginSchema } from "../../validation/userSchema";

const UserLogin = () => {
  return (
    <LoginForm
      title="User Login"
      subTitle="Your Health, Our Mission"
      schema={userLoginSchema}
      loginService={loginUser}
      setAuth={setUserAuth}
      redirectPath="/user/dashboard"
      placeholders={{ email: "Enter Email", password: "Enter Password" }}
    />
  );
};

export default UserLogin;
