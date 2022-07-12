import {Routes, Route} from 'react-router-dom';
import Landing from "./pages/home/landing";
import {useContext, useEffect} from "react";
import {API, setAuthToken} from "./config/api";
import {UserContext} from "./context/userContext";
import BookDetail from "./pages/books/bookDetail";
import Cart from "./pages/cart/cart";
import Profile from "./pages/profile/profile";
import ListBook from "./pages/books/listBook";
import AddBook from "./pages/books/addBook";
import EditBook from "./pages/books/editBook";
import ListTransaction from "./pages/transaction/listTransaction";
import Complain from "./pages/complain/complain";
import ComplainAdmin from "./pages/complain/admincomplain";
import PrivateRoute from "./components/privateRoute";
function App() {
    const [state, dispatch] = useContext(UserContext);
    // Init token on axios every time the app is refreshed here ...
    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

    }, [state]);

    const checkUser = async () => {
        try {
            const response = await API.get('/check-auth');

            // If the token incorrect
            if (response.status === 404) {
                return dispatch({
                    type: 'AUTH_ERROR',
                });
            }
            // Get user data
            let payload = response.data.data.user;
            // Get token from local storage
            payload.token = localStorage.token;

            // Send data to useContext
            dispatch({
                type: 'USER_SUCCESS',
                payload,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (localStorage.token) {
            checkUser();
        }
    }, []);
    return (
    <div className="bg">
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<PrivateRoute />}>
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/books" element={<ListBook/>}/>
              <Route path="/transactions" element={<ListTransaction/>}/>
              <Route path="/add-book" element={<AddBook/>}/>
              <Route path="/edit-book/:id" element={<EditBook/>}/>
              <Route path="/complain" element={<Complain />} />
              <Route path="/complain-admin" element={<ComplainAdmin />} />
          </Route>
      </Routes>
    </div>
  );
}

export default App;
