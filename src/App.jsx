import React, { useEffect, Suspense, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App ">
      <Router>
        <RenderRoutes data={routes} />
      </Router>
    </div>
  );
}

function RenderRoutes({ data }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense >
      <Routes>
        {data.map((route, i) => {
          const Component = route.component;
          const Layout = route.layout || Fragment;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Layout>
                  {route.routes ? (
                    <RenderRoutes data={route.routes} />
                  ) : (
                    <Component />
                  )}
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
}
