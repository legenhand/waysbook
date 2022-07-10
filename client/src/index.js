import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'font-awesome/css/font-awesome.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter} from "react-router-dom";
import {UserContextProvider} from "./context/userContext";
import CartContextProvider from "./context/cartContext";

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <UserContextProvider>
            <CartContextProvider>
                <QueryClientProvider client={client}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </QueryClientProvider>
            </CartContextProvider>
        </UserContextProvider>
    </React.StrictMode>
);