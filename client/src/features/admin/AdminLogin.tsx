import LoginForm from "../../components/LoginForm";
import { adminLogin } from "../../services/adminService";
import { setAdminAuth } from "../../redux/slices/authSlice";
import { adminLoginSchema } from "../../validation/adminSchema";
import { AdminRoutes } from "../../constants/routes";

const AdminLogin = () => {
  return (
    <LoginForm
      title="Admin Login"
      subTitle="Admin Panel Login"
      schema={adminLoginSchema}
      loginService={adminLogin}
      setAuth={setAdminAuth}
      redirectPath={AdminRoutes.DASHBOARD}
      placeholders={{ email: "Admin Email", password: "Password" }}
    />
  );
};

export default AdminLogin;
