import Container from "@mui/material/Container";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { fetchAuthMe } from "./redux/auth/slice";
import { Header } from "./components";
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  HashPosts,
} from "./pages";


const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      dispatch(fetchAuthMe());
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/tags/:tag" element={<HashPosts />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
