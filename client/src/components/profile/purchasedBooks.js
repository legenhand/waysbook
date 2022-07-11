import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {useQuery} from "react-query";
import {API} from "../../config/api";

const PurchasedBooks = (props) => {
    let {data : purchasedBooks} = useQuery('purchasedBooks', async () => {
        const res = await API.get('/profile');
        return res.data.purchasedBooks
    });
    return (
        <Container className="my-3">
            <h1>My Books</h1>
            <Row md={4}>
                {purchasedBooks?.map(item => {
                    return item.books.map(item => {
                        return (<Col>
                            <img src={item.thumbnail} alt="" className="w-100 h-75"/>
                            <h3>{item.title}</h3>
                            <span className="text-gray">By. {item.author}</span>
                            <Button variant="dark" as="a" className="w-100" href={item.book_attachment} target="_blank">
                                Download
                            </Button>
                        </Col>)
                })
                })}
            </Row>
        </Container>
    );
};

export default PurchasedBooks;