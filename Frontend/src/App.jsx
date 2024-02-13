import Home from './components/Home'
import Login from "./components/Login";
import SignUp from "./components/Signup";
import { useAuthContext } from './context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'

const App = () => {
  const { authUser } = useAuthContext();
  return (
    <Routes>
      <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
      <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
      <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
    </Routes>
  );
}

export default App;




