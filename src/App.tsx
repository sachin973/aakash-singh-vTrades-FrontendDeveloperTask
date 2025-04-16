import React, { useEffect, Suspense, Fragment, FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';

interface RouteItem {
  path: string;
  component: React.LazyExoticComponent<FC> | FC;
  layout?: FC<{ children: React.ReactNode }>;
  routes?: RouteItem[];
}

export default function App(): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App">
      <Router>
        <RenderRoutes data={routes} />
      </Router>
    </div>
  );
}

function RenderRoutes({ data }: { data: RouteItem[] }): JSX.Element {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
