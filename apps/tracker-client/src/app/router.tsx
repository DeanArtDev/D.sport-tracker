import { AppMain } from './components/app-main';
import { ContentWrapper } from './components/content-wrapper';
import { OutOfAuthRoutes } from './components/out-of-auth-routes';
import { RouterErrorBoundary } from './components/router-error-boundary';
import { AppSidebar } from '@/feature/sidebar';
import { routes } from '@/shared/lib/routes';
import { createBrowserRouter, Outlet, redirect } from 'react-router-dom';
import { App } from './app';
import { AppHeader } from './components/app-header';
import { AuthErrorBoundary } from './components/auth-error-boundary';
import { ProtectedRoutes } from './components/protected-routes';

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        element: (
          <ProtectedRoutes>
            <AppSidebar />
            <ContentWrapper className="md:pl-0">
              <AppHeader />
              <AppMain>
                <Outlet />
              </AppMain>
            </ContentWrapper>
          </ProtectedRoutes>
        ),
        errorElement: <AuthErrorBoundary />,
        children: [
          {
            path: routes.home.path,
            loader: () => redirect(routes.gymHome.path),
          },
          {
            path: routes.gymTrainings.path,
            lazy: () => import('@/page/gym-training'),
          },
          {
            path: routes.gymDashboard.path,
            lazy: () => import('@/page/gym-dashboard.page'),
          },
          {
            path: routes.gymExercises.path,
            lazy: () => import('@/page/gym-exercises'),
          },
          {
            path: routes.gymHome.path,
            lazy: () => import('@/page/gym-home.page'),
          },
          {
            path: '*',
            loader: () => redirect(routes.gymHome.path),
          },
        ],
      },

      {
        element: (
          <ContentWrapper>
            <OutOfAuthRoutes />
          </ContentWrapper>
        ),
        children: [
          {
            path: routes.signUp.path,
            lazy: () => import('@/page/sign-up.page'),
          },
          {
            path: routes.login.path,
            lazy: () => import('@/page/login.page'),
          },

          {
            path: '*',
            loader: () => redirect(routes.gymHome.path),
          },
        ],
      },
    ],
  },
]);
