import React, {useContext} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {useCart} from "../../hooks/useCart";
import CartContext from "../../context/cartContext";
import convertRupiah from "rupiah-format";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useQuery} from "react-query";
import {API} from "../../config/api";

const MyCart = () => {
    const { cartItems } = useCart();
    const {data : carts} = useQuery('listItemCartss',async ()=> {
        const res = await API.get(`/carts`);
        return res.data.data[0]
    });
    console.log(carts);

    return (
        <div>
            <Container>
                <h1>My Cart</h1>
                <h4>Review Your Order</h4>
                <hr/>
                <Row>
                    <Col md="8">
                        {carts?.books?.map(item => {
                            return <Row>
                                <Col md="auto">
                                    <img src={item.thumbnail} alt="" width="100px" height="150px"/>
                                </Col>
                                <Col>
                                    <h4>{item.title} <Button variant="none" className="float-end"><FontAwesomeIcon icon={faTrash}/></Button></h4>
                                    <span className="text-gray">By. {item.author}</span>
                                    <p className="text-green fw-bolder">{convertRupiah.convert(item.price)}</p>
                                </Col>
                            </Row>
                        })}
                        <hr/>
                    </Col>
                    <Col>
                        Subtotal : {convertRupiah.convert(carts?.totalPrice)}<br/>
                        Qty : {carts?.books?.length}
                        <br/>
                        <hr/>
                        <p className="text-green fw-bold">Total : {convertRupiah.convert(carts?.totalPrice)}</p>
                        <Button variant="dark" className="float-end w-75">Pay</Button>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default MyCart;