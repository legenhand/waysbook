import React, {useContext, useState} from 'react';
import {Alert, Button, Container, Dropdown, Form, Modal, Navbar} from "react-bootstrap";
import {Link, useNavigate} from 'react-router-dom';
import logo from "../assets/logo.png";
import {UserContext} from "../context/userContext";
import {useMutation, useQuery} from "react-query";
import {API} from "../config/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faCartShopping, faMoneyCheckDollar, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {faCommentDots, faUser} from "@fortawesome/free-regular-svg-icons";
import {useCart} from "../hooks/useCart";

const Nav = () => {
    // Modal handler
    const [message, setMessage] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);
    const {data : carts} = useQuery('listItemCartssss',async ()=> {
        const res = await API.get(`/carts`);
        return res.data.data[0]
    });
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
                navigate('/books')
            }


            await API.get('/carts').then(res => {
                localStorage.setItem('cart', JSON.stringify(res.data.data[0].books));
            });

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

    // register
    const initialValuesRegister = {
        email : '',
        password : '',
        name: ''
    }
    const [dataRegister, setDataRegister] = useState(initialValuesRegister);
    function handleChangeRegister(event) {
        const {name, value} = event.target;
        setDataRegister({
            ...dataRegister,
            [name]: value,
        });
    }

    const handleSubmitRegister = useMutation(async (e) => {
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

            const body = JSON.stringify(dataRegister);
            await API.post('/register', body, config);

            setMessage(null);
            setShowRegister(false);
            setShowLogin(true);
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


    const logout = () => {
        dispatch({
            type: "LOGOUT"
        })
        navigate('/');
    }

    // Handle button login show when not logged in
    let avatar;
    if (state.isLogin){
            avatar = (<div>
                <Dropdown>
                    {state.user.status == "customer" ? <Link to="/cart" className="text-black text-decoration-none"><FontAwesomeIcon icon={faCartShopping} style={{width: "50px", textAlign: "center", fontSize: '40px'}} className="align-middle"/>( {carts?.books?.length} )</Link>  : ''}

                    <Dropdown.Toggle id="dropdown-basic" variant="none">
                        <img src={state?.user?.profile?.avatar} alt="avatar" style={{width: "50px"}} className="rounded-circle"/>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item> <Link to="/profile" className="text-black text-decoration-none"><FontAwesomeIcon icon={faUser}/> Profile</Link></Dropdown.Item>
                        <Dropdown.Item><Link to={state.user.status == 'admin' ? '/complain-admin' : '/complain'} className="text-black text-decoration-none"><FontAwesomeIcon icon={faCommentDots}/> Complain</Link></Dropdown.Item>
                        <Dropdown.Divider/>
                        {state.user.status == 'admin' ? <Dropdown.Item><Link to="/books" className="text-black text-decoration-none"><FontAwesomeIcon icon={faBook}/> List Books</Link></Dropdown.Item> : ''}
                        {state.user.status == 'admin' ? <Dropdown.Item><Link to="/transactions" className="text-black text-decoration-none"><FontAwesomeIcon icon={faMoneyCheckDollar}/> List Transaction</Link></Dropdown.Item> : ''}
                        <Dropdown.Divider/>
                        <Dropdown.Item onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} style={{color: "red"}} /> Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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
                    <Link to="/"><img src={logo} alt="" width="100px"/></Link>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        {avatar}
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
                            {message}
                            <Form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
                                <Form.Group className="mb-3">
                                    <Form.Control type="text" placeholder="Full Name" onChange={handleChangeRegister} name="name"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="email" placeholder="Email" onChange={handleChangeRegister} name="email"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control type="password" placeholder="Password" onChange={handleChangeRegister} name="password"/>
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