import React, {useEffect} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import convertRupiah from "rupiah-format";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useMutation, useQuery} from "react-query";
import {API} from "../../config/api";
import {useNavigate} from "react-router-dom";
import {useCart} from "../../hooks/useCart";

const MyCart = () => {
    const {data : carts, refetch} = useQuery('listItemCartss',async ()=> {
        const res = await API.get(`/carts`);
        return res.data.data[0]
    });

    const navigate = useNavigate();
    const {removeProduct} = useCart();
    const handleRemoveFromCart = useMutation((id) => {
        API.delete(`/cart/${id}`).then(r => refetch()).catch(e => console.log(e));
        removeProduct({
            ...carts,
            cart_item :{
                book_id : id
            }
        });

    })

    const handlePay = useMutation(async () => {
        try {
            // Get data from product

            // Insert transaction data
            const response = await API.post("/transaction");
            console.log(response);
            // Create variabel for store token payment from response here ...
            const token = response.data.payment.token;

            // Init Snap for display payment page with token here ...
            window.snap.pay(token,{
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    navigate(result);
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            })
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "SB-Mid-client-LQsMqwYk9hPkOoEx";

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

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
                                    <h4>{item.title} <Button variant="none" className="float-end" onClick={() => {
                                        handleRemoveFromCart.mutate(item.id)
                                    }
                                    }><FontAwesomeIcon icon={faTrash}/></Button></h4>
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
                        <Button variant="dark" className="float-end w-75" onClick={() => handlePay.mutate()}>Pay</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MyCart;