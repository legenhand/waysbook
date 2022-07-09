import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, Container, Form, Modal, Navbar} from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import logo from "../assets/logo.png";
import {UserContext} from "../context/userContext";
import {useMutation} from "react-query";
import {API} from "../config/api";
import avatarImg from "../assets/avatar.jpg";

const Nav = () => {
    // Modal handler
    const [message, setMessage] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    // Login and Register handler
    const [state, dispatch] = useContext(UserContext);
    const initialValues = {
        email : '',
        password : '',
    }
    const [dataLogin, setDataLogin] = useState(initialValues);
    function handleChangeLogin(event) {
        const {name, value} = event.target;
        setDataLogin({
            ...dataLogin,
            [name]: value,
        });
    }
    const navigate = useNavigate()
    const handleSubmitLogin = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration Content-type
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            // Data body => Convert Object to String
            // Insert data user to database

            const body = JSON.stringify(dataLogin);
            const response = await API.post('/login', body, config);

            // Handling response here
            const userStatus = response.data.data.status

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: response.data.data
            })

            if(userStatus == 'customer'){
                navigate('/')
            } else if(userStatus == 'admin' ){
                navigate('/complain-admin')
            }
            setMessage(null);
            setShowLogin(false);
        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1">
                    {error.response.data.message}
                </Alert>
            );
            setMessage(alert);
            console.log(error.response.data.message);
        }
    });

    // Handle button login show when not logged in
    let avatar;
    if (state.isLogin){
            avatar = (<div>
                <FontAwesomeIcon icon={solid('fa-cart-shopping')} />
                <img src={avatarImg} alt="" style={{width: "50px"}} className="rounded-circle"/>
            </div>);
    }else{
            avatar = (<div><Button variant="outline-dark" className="mx-2 py-1" style={{
                width: "100px"
            }} onClick={handleShowLogin}>Login</Button>
                <Button variant="dark" className="mx-2 py-1" style={{
                    width: "100px"
                }} onClick={handleShowRegister}>Register</Button></div> );
    }
    return (
            <Navbar>
                <Container className="my-4">
                    <img src={logo} alt="" width="100px"/>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {avatar && avatar}
                    </Navbar.Collapse>

                    {/* Modal Register & Login */}


                    <Modal show={showLogin} onHide={handleCloseLogin} size="sm" centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="fw-bolder">Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {message}
                            <Form onSubmit={(e) => handleSubmitLogin.mutate(e)}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="email" placeholder="Email" name="email" onChange={handleChangeLogin}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="password" placeholder="Password" name="password" onChange={handleChangeLogin}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Button variant="dark" type="submit" style={{width : "100%"}}>Login</Button>
                                </Form.Group>
                            </Form>
                            <p className="text-center">Don't have an account ? klik
                                <Button variant="link" className="p-0 mx-1 fw-bolder text-decoration-none text-black"
                                        onClick={handleShowRegister}>Here</Button>
                            </p>
                        </Modal.Body>
                    </Modal>


                    <Modal show={showRegister} onHide={handleCloseRegister} size="sm" centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="fw-bolder">Register</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" placeholder="Full Name"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="email" placeholder="Email"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="password" placeholder="Password"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Button variant="dark" type="submit" style={{width : "100%"}}>Register</Button>
                                </Form.Group>
                            </Form>
                            <p className="text-center">Already have an account ? klik
                                <Button variant="link" className="p-0 mx-1 fw-bolder text-decoration-none text-black"
                                        onClick={handleShowLogin}>Here</Button> </p>
                        </Modal.Body>
                    </Modal>
                </Container>
            </Navbar>
    );
};

export default Nav;