import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ActionsPage from "../pages/ActionsPage";
import MainLayout from "../layouts/MainLayout";
import UserActionPage from "../pages/UserAction";

export default function AppRoutes() {
  const routes = [
    { path: "/", label: "Home", component: <HomePage /> },
    { path: "/actions", label: "actions", component: <ActionsPage /> },
    { path:"/user/:id", label: "__", component: <UserActionPage /> }
  ]
  return (

    <BrowserRouter>
      <MainLayout>
        <Routes>
          {routes.map(r => <Route path={r.path} element={r.component} />)}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}