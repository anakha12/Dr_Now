import LoginForm from "../../components/LoginForm";
import { doctorLogin } from "../../services/doctorService";
import { setDoctorAuth } from "../../redux/slices/authSlice";
import { doctorLoginSchema } from "../../validation/doctorSchema";

const DoctorLogin = () => {
  return (
    <LoginForm
      title=""
      subTitle="Doctor Portal"
      schema={doctorLoginSchema}
      loginService={doctorLogin}
      setAuth={setDoctorAuth}
      redirectPath="/doctor/dashboard"
      registerPath="/doctor/register"
      registerText="Join as a Doctor"
      placeholders={{ email: "Doctor Email", password: "Password" }}
    />
  );
};

export default DoctorLogin;
