import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import convertRupiah from "rupiah-format";
import {useQuery} from "react-query";
import {API} from "../../config/api";

const PromoBooks = () => {
    let {data : promoBooks} = useQuery('promoBooksCache', async () => {
        const res = await API.get('/promo-books');
        return res.data.data
    });
    return (
            <Container>
                <Row>
                    {promoBooks?.map(item => {
                        return <Col>
                            <Container>
                                <Row md={2} xs={1}>
                                    <Col className="p-0">
                                        <img src={item?.thumbnail} alt="" height="300px" width="100%"/>
                                    </Col>
                                    <Col className="bg-white p-4 m-0 mb-5">
                                        <h4 className="fw-bolder">{item?.title}</h4>
                                        <span className="text-gray">By. {item?.author}</span>
                                        <p>{item?.desc}</p>
                                        <h5 className="text-green">{convertRupiah.convert(item?.price) }</h5>
                                        <Button variant="dark" style={{width: "100%"}}>Add to Cart</Button>
                                    </Col>
                                </Row>
                            </Container>

                        </Col>

                    })}
                </Row>
            </Container>
    );
};

export default PromoBooks;