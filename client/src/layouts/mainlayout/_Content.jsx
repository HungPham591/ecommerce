import { Route, Switch } from "react-router-dom";
import routes from "services/routes/routes-config";
import { Suspense } from "react";

export default function HomeRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={route.home}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}
