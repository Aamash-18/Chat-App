import { createBrowserRouter, RouterProvider } from "react-router-dom";

// importing component
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import io from "socket.io-client";
import { setOnlineUser } from "./redux/userSlice";
import { setSocket } from "./redux/socketSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import { API_BASE_URL } from "./config/api";

// creating router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

// creating App componenet
function App() {
  const dispatch = useDispatch();
  const { authUser, onlineUser } = useSelector((store) => store.user);
  useEffect(() => {
    if (authUser) {
      const socket = io(API_BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });
      dispatch(setSocket(socket));
      socket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });
      return () => socket.close();
    }
  }, [authUser, dispatch]);
  return (
    <>
      <div className="h-screen flex items-center justify-center ">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
