import { FC, LazyExoticComponent } from 'react';

export interface RouteType {
  path: string;
  component: LazyExoticComponent<FC> | FC;
  layout?: FC<{ children: React.ReactNode }>;
  routes?: RouteType[];
}
