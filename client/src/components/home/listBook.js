import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import convertRupiah from "rupiah-format";
import {useQuery} from "react-query";
import {API} from "../../config/api";
import {UserContext} from "../../context/userContext";
import {Link} from "react-router-dom";
import ButtonCart from "../buttonCart";

const ListBook = () => {

    const [state] = useContext(UserContext);

    let {data : books} = useQuery('BooksCache', async () => {
        const res = await API.get('/books');
        return res.data.data
    });


    return (
        <Container>
            <Row md={5}>
                {books?.map((item) => {
                    return <Col className="p-0" key={item.id}>
                        <div className="m-4">
                            <img src={item?.thumbnail} alt="" height="250px" width="100%"/>
                            <h4 className="fw-bolder"> <Link to={`/book/${item.id}`} className="text-decoration-none text-black">{item?.title}</Link> </h4>
                            <span className="text-gray">By. {item?.author}</span>
                            <h5 className="text-green mt-3">{convertRupiah.convert(item?.price)}</h5>
                            {state.isLogin ? <ButtonCart id={item.id}/> : ''}
                        </div>
                    </Col>
                })}
            </Row>
        </Container>
    );
};

export default ListBook;