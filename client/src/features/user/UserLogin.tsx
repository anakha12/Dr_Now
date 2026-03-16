import LoginForm from "../../components/LoginForm";
import { loginUser, googleLogin } from "../../services/userService";
import { setUserAuth } from "../../redux/slices/authSlice";
import { userLoginSchema } from "../../validation/userSchema";
import { auth, provider, signInWithPopup } from "../../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAxios } from "../../services/axiosInstances";
import { useNotifications } from "../../hooks/useNotifications";
import { Messages } from "../../constants/messages";

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await googleLogin({
        name: user.displayName || "",
        email: user.email || "",
        uid: user.uid,
      });

      // Save token
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      dispatch(setUserAuth({ isAuthenticated: true, user: response.user }));

      userAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.token}`;

      navigate("/user/dashboard");
    } catch (err) {
      addNotification(Messages.AUTH.LOGIN_FAILED, "ERROR");
      console.error(err);
    }
  };

  return (
    <LoginForm
      title=""
      subTitle="Your Health, Our Mission"
      schema={userLoginSchema}
      loginService={loginUser}
      setAuth={setUserAuth}
      redirectPath="/user/dashboard"
      registerPath="/user/register"
      registerText="New patient? Create account"
      placeholders={{ email: "Enter Email", password: "Enter Password" }}
      showGoogleLogin={true}
      googleLogin={handleGoogleLogin}
    />
  );
};

export default UserLogin;