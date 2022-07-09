import {Routes, Route, useNavigate} from 'react-router-dom';
import Nav from "./components/nav";
import Landing from "./pages/home/landing";
import {useContext, useEffect} from "react";
import {API, setAuthToken} from "./config/api";
import {UserContext} from "./context/userContext";
function App() {
    let navigate = useNavigate();
    const [state, dispatch] = useContext(UserContext);
    // Init token on axios every time the app is refreshed here ...
    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        // Redirect Auth
        // if (state.isLogin === false) {
        //     navigate('/');
        // } else {
        //     if (state.user.status === 'admin') {
        //         navigate('/product');
        //     } else if (state.user.status === 'customer') {
        //         navigate('/');
        //     }
        // }
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
      </Routes>
    </div>
  );
}

export default App;
