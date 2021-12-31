export default function initStore() {
  
  return {
    baseUrl: "http://127.0.0.1:5000/",
    isSignIn: false,
    cartNum: null,
    user: {
      first_name: null,
      last_name: null,
      role: null,
      username: null,
      avatar: null,
    },
  };
}
