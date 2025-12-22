import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { ProtectedRoute } from "./protected-route";
import paths from "./paths";

import PageLoading from "../components/pageLoading/pageLoading.component";
import Footer from "../components/footer/footer.component";

//Principais
const Home = lazy(() => import("../pages/home/home"));
const Login = lazy(() => import("../pages/login/login"));
const SigIn = lazy(() => import("../pages/sigin/sigin"));
const EsqueceuSenha = lazy(
  () => import("../pages/forgot-password/forgot-password"),
);
const TrocarSenha = lazy(
  () => import("../pages/reset-password/reset-password"),
);
const PageNotFound = lazy(
  () => import("../pages/page-not-found/page-not-found"),
);
const About = lazy(() => import("../pages/home/about/about"));
const Faq = lazy(() => import("../pages/home/faq/faq"));
const PaymentTerms = lazy(() => import("../pages/payment-terms/payment-terms"));

//Logado
const HomeLogged = lazy(
  () => import("../pages/logged/home-logged/home-logged"),
);
const NewHistory = lazy(
  () => import("../pages/logged/new-history/new-history"),
);
const MyHistories = lazy(
  () => import("../pages/logged/my-histories/my-histories"),
);
const MyAccount = lazy(() => import("../pages/logged/my-account/my-account"));
const PricingPlans = lazy(
  () => import("../pages/logged/pricing/pricing-plans"),
);

//Admin
const Terms = lazy(() => import("../pages/admin/terms/terms"));
const Users = lazy(() => import("../pages/admin/users/users"));
const Chapters = lazy(() => import("../pages/admin/chapters/chapters"));
const Questions = lazy(() => import("../pages/admin/questions/questions"));
const Plans = lazy(() => import("../pages/admin/plans/plans"));

interface Routes {
  path: string;
  element: React.ReactNode;
}

const getRouteElement = (
  Component: React.ElementType,
  protectRoute = false,
  footerShowOnlyIcons = false,
  footer = true,
): React.ReactNode => {
  return (
    <Suspense fallback={<PageLoading />}>
      <ToastContainer position="top-center" autoClose={7000} />
      {protectRoute ? (
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      ) : (
        <Component />
      )}
      {footer && <Footer showOnlyIcons={footerShowOnlyIcons} />}
    </Suspense>
  );
};

const routes: Routes[] = [
  //Principais
  { path: paths.HOME, element: getRouteElement(Home) },
  { path: paths.LOGIN, element: getRouteElement(Login, false, true) },
  { path: paths.SIGIN, element: getRouteElement(SigIn, false, true) },
  {
    path: paths.FORGOT_PASSWORD,
    element: getRouteElement(EsqueceuSenha, false, true),
  },
  { path: paths.RESET_PASSWORD, element: getRouteElement(TrocarSenha) },
  { path: paths.NOT_FOUND, element: getRouteElement(PageNotFound) },
  { path: paths.ABOUT, element: getRouteElement(About) },
  { path: paths.FAQ, element: getRouteElement(Faq) },
  { path: `${paths.PAYMENT_TERMS}/:id`, element: getRouteElement(PaymentTerms, false, true) },

  //Logado
  {
    path: paths.HOME_LOGGED,
    element: getRouteElement(HomeLogged, true, true, false),
  },
  {
    path: `${paths.NEW_HISTORY}/:id`,
    element: getRouteElement(NewHistory, true, true, false),
  },
  {
    path: paths.MY_HISTORIES,
    element: getRouteElement(MyHistories, true, true, false),
  },
  {
    path: paths.MY_ACCOUNT,
    element: getRouteElement(MyAccount, true, true, false),
  },
  {
    path: paths.PRICING_PLANS,
    element: getRouteElement(PricingPlans, true, true, false),
  },

  //Admin
  { path: paths.TERMS, element: getRouteElement(Terms, true, true, false) },
  { path: paths.USERS, element: getRouteElement(Users, true, true) },
  { path: paths.CHAPTERS, element: getRouteElement(Chapters, true, true) },
  { path: paths.QUESTIONS, element: getRouteElement(Questions, true, true) },
  { path: paths.PLANS, element: getRouteElement(Plans, true, true) },
];

export default createBrowserRouter(routes);
