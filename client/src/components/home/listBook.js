import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import convertRupiah from "rupiah-format";
import {useQuery} from "react-query";
import {API} from "../../config/api";

const ListBook = () => {

    let {data : books} = useQuery('BooksCache', async () => {
        const res = await API.get('/books');
        return res.data.data
    });

    return (
        <Container>
            <Row md={5}>
                {books?.map(item => {
                    return <Col className="p-0">
                        <div className="m-4">
                            <img src={item?.thumbnail} alt="" height="250px" width="100%"/>
                            <h4 className="fw-bolder">{item?.title}</h4>
                            <span className="text-gray">By. {item?.author}</span>
                            <h5 className="text-green mt-3">{convertRupiah.convert(item?.price) }</h5>
                            {/*<Button variant="dark" style={{width: "100%"}}>Add to Cart</Button>*/}
                        </div>
                    </Col>
                })}
            </Row>
        </Container>
    );
};

export default ListBook;