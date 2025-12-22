interface Paths {
  [key: string]: string;
}

export default {
  //Principais sem login
  HOME: "/",
  LOGIN: "/login",
  SIGIN: "/sigin",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  NOT_FOUND: "*",

  //Logado
  HOME_LOGGED: "/home",
  MY_ACCOUNT: '/my-account',

  //Admin
  TERMS: '/terms',
  USERS: '/users',

} as Paths;