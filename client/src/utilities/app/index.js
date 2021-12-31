import React, { useEffect, useReducer } from "react";
import reducer from "./reducer";
import initStore from "./init-store";
import MainLayout from "layouts/mainlayout";
import { ForgotForm, SignInForm, SignUpForm } from "layouts/auth";
import { Route, Switch } from "react-router-dom";
import clientAxios from "services/axios/clientAxios";

const AppContext = React.createContext(null);

const App = () => {
  const [state, dispatch] = useReducer(reducer, initStore());

  useEffect(() => {
    dispatch({type: 'RELOAD_CART'});
  }, [])

  useEffect(() => {
    const getPreLoginInfo = async () => {
      const accessToken =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");

      if (accessToken) {
        try {
          const { data } = await clientAxios.get("auth/info");
          dispatch({
            type: "SIGN_IN",
            payload: { isSignIn: true, user: data.data },
          });
        } catch (err) {
          sessionStorage.removeItem('accessToken');
          localStorage.removeItem('accessToken');
          console.log(err.response);
        }
      }
    };
    getPreLoginInfo();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Switch>
        <Route key="auth" path="/auth/signin" exact>
          <SignInForm />
        </Route>
        <Route key="auth" path="/auth/signup" exact>
          <SignUpForm />
        </Route>
        <Route key="auth" path="/auth/forgot" exact>
          <ForgotForm />
        </Route>
        <Route key="notAuth" path="/">
          <MainLayout />
        </Route>
      </Switch>
    </AppContext.Provider>
  );
};
export { AppContext };
export default App;
