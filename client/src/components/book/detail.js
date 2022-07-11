import React, {useContext, useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {API} from "../../config/api";
import {Button, Col, Container, Row} from "react-bootstrap";
import convertRupiah from "rupiah-format";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useCart} from "../../hooks/useCart";
import ButtonCart from "../buttonCart";
const Detail = (props) => {
    const id = props.id;
    const {data : book} = useQuery('bookDetail',async ()=> {
        const res = await API.get(`/book/${id}`);
        return res.data.data
    });

    return (
        <Container>
            <Row className="mx-5">
                <Col>
                    <img src={book?.thumbnail} alt="thumbnail" style={{width : "400px", height: "500px"}}/>
                </Col>
                <Col>
                    <h1 className="fw-bolder">{book?.title}</h1>
                    <span className="text-gray">By. {book?.author}</span>
                    <h5 className="fw-bolder">Publication Date</h5>
                    <span className="text-gray">{book?.publication_date}</span>
                    <h5 className="fw-bolder">Pages</h5>
                    <span className="text-gray">{book?.pages}</span>
                    <h5 className="text-danger fw-bolder">ISBN</h5>
                    <span className="text-gray">{book?.ISBN}</span>
                    <h5 className="fw-bolder">Price</h5>
                    <span className="text-green fw-bolder">{convertRupiah.convert(book?.price)}</span>
                </Col>
            </Row>
            <Row className="mx-5 mt-5" >
                <Col>
                    <h2 className="fw-bolder"> About This Book</h2>
                    <p className="text-gray">{book?.desc}</p>
                    <ButtonCart id={id}/>
                </Col>
            </Row>

        </Container>


    );
};

export default Detail;