import Home from "./pages/home/Home";
import Student from "./pages/student/Student";
import Students from "./pages/students/Students";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Courses from "./pages/courses/Courses";
import Tests from "./pages/tests/Tests";
import LiveClasses from "./pages/liveclasses/LiveClasses";
import Faculties from "./pages/faculties/Faculties";
import Faculty from "./pages/faculty/Faculty";
import Exams from "./pages/exams/Exams";
import Exam from "./pages/exam/Exam";
import Test from "./pages/test/Test";
import LiveClass from "./pages/liveclass/LiveClass";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Materials from "./pages/materials/Materials";
import Material from "./pages/material/Material";

const queryClient = new QueryClient();

const Layout = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main">
      <Navbar />
      <div className="container">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="contentContainer">
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/students",
        element: <Students />,
      },
      {
        path: "/student/:id",
        element: <Student />,
      },
      {
        path: "/faculties",
        element: <Faculties />,
      },
      {
        path: "/faculty/:id",
        element: <Faculty />,
      },
      {
        path: "/exams",
        element: <Exams />,
      },
      {
        path: "/exam/:id",
        element: <Exam />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/course/:id",
        element: <Courses />,
      },
      {
        path: "/materials",
        element: <Materials />,
      },
      {
        path: "/material/:id",
        element: <Material />,
      },
      {
        path: "/tests",
        element: <Tests />,
      },
      {
        path: "/test/:id",
        element: <Test />,
      },
      {
        path: "/liveclasses",
        element: <LiveClasses />,
      },
      {
        path: "/liveclass/:id",
        element: <LiveClass />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
