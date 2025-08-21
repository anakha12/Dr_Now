export interface IDoctorLogin {
  execute(
    email: string,
    password: string
  ): Promise<
    | { token: string; name: string }
    | { notVerified: true; name: string; email: string }
    | { isRejected: true; name: string; email: string }
  >;
}