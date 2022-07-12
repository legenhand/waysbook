import React, {useContext} from 'react';
import {UserContext} from "../context/userContext";
import {Outlet, Navigate} from 'react-router-dom'
const PrivateRoute = () => {
    const [state] = useContext(UserContext);
    return state.isLogin ? <Outlet/> : <Navigate to="/"/>
};

export default PrivateRoute;