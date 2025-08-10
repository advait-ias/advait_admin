import Home from "./pages/home/Home";
import Student from "./pages/student/Student";
import Students from "./pages/students/Students";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Courses from "./pages/courses/Courses";
import LiveClasses from "./pages/liveclasses/LiveClasses";
import Faculties from "./pages/faculties/Faculties";
import Faculty from "./pages/faculty/Faculty";
import Exams from "./pages/exams/Exams";
import Exam from "./pages/exam/Exam";
import LiveClass from "./pages/liveclass/LiveClass";
import Materials from "./pages/materials/Materials";
import Material from "./pages/material/Material";
import Tags from "./pages/tags/Tags";
import Languages from "./pages/languages/Languages";
import Articles from "./pages/articles/Article";
import SubCategories from "./pages/sub-categories/SubCategories";
import Categories from "./pages/categories/Categories";
import Blogs from "./pages/blogs/Blogs";
import AddBlogPage from "./pages/blogs/AddBlogPage";
import AddArticlePage from "./pages/articles/AddArticlePage";
import AddCoursePage from "./pages/courses/AddCoursePage";
import AddSubCategoryPage from "./pages/sub-categories/AddSubCategoryPage";
import AddCategoryPage from "./pages/categories/AddCategoryPage";
import Article from "./pages/article/Article";
import Blog from "./pages/blog/Blog";
import Quizzes from "./pages/quizzes/quizzes";
import AddQuizPage from "./pages/quizzes/AddQuizPage";
import Subjects from "./pages/subjects/Subjects";
import AddSubjectsPage from "./pages/subjects/AddSubjectPage";
import PYQs from "./pages/pyqs/PYQs";
import AddPYQsPage from "./pages/pyqs/AddPYQPage";
import MCQs from "./pages/mcqs/mcqs";
import AddMCQsPage from "./pages/mcqs/AddMcqsPage";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

const queryClient = new QueryClient();

const Layout = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="container">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="contentContainer">
          <QueryClientProvider client={queryClient}>
            <ScrollToTop />
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
        path: "/courses/add",
        element: <AddCoursePage />,
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
        path: "/quizzes",
        element: <Quizzes />,
      },
      {
        path: "/quizzes/add",
        element: <AddQuizPage />,
      },
      {
        path: "/subjects",
        element: <Subjects />,
      },
      {
        path: "/subjects/add",
        element: <AddSubjectsPage />,
      },
      {
        path: "/pyqs",
        element: <PYQs />,
      },
      {
        path: "/pyqs/add",
        element: <AddPYQsPage />,
      },
      {
        path: "/mcqs",
        element: <MCQs />,
      },
      {
        path: "/mcqs/add",
        element: <AddMCQsPage />,
      },
      {
        path: "/liveclasses",
        element: <LiveClasses />,
      },
      {
        path: "/liveclass/:id",
        element: <LiveClass />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/categories/add",
        element: <AddCategoryPage />,
      },
      {
        path: "/sub-categories",
        element: <SubCategories />,
      },
      {
        path: "/sub-categories/add",
        element: <AddSubCategoryPage />,
      },
      {
        path: "/articles",
        element: <Articles />,
      },
      {
        path: "/article/:id",
        element: <Article />,
      },
      {
        path: "/articles/add",
        element: <AddArticlePage />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blogs/add",
        element: <AddBlogPage />,
      },
      {
        path: "/languages",
        element: <Languages />,
      },
      {
        path: "/tags",
        element: <Tags />,
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
