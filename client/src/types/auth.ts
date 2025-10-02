

export interface Doctor {
  id: string;
  name: string;
  email: string;
  role: "doctor";
}

export interface User {
  id: string;
  email: string;
  role: "user";
}

export interface Admin {
  id: string;
  email: string;
  role: "admin";
}

export interface DoctorLoginResponse {
  message: string;
  token: string;
  user: Doctor;
}
