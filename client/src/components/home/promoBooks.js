import React, {useContext} from 'react';
import {Col, Container, Modal, Row} from "react-bootstrap";
import convertRupiah from "rupiah-format";
import {useQuery} from "react-query";
import {API} from "../../config/api";
import {UserContext} from "../../context/userContext";
import {Link} from "react-router-dom";
import ButtonCart from "../buttonCart";
import Slider from "react-slick";

const PromoBooks = () => {

    const [state] = useContext(UserContext);

    let {data : promoBooks} = useQuery('promoBooksCache', async () => {
        const res = await API.get('/promo-books');
        return res.data.data
    });

    const settings = {
        centerMode: true,
        centerPadding: '250px',
        slidesToShow: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
            <Container>
                <Row>
                    <Slider {...settings}>
                    {promoBooks?.map((item,key) => {
                        return <Col key={key}>
                            <Container>
                                <Row md={2} xs={1}>
                                    <Col className="p-0">
                                        <img src={item?.thumbnail} alt="" height="300px" width="100%"/>
                                    </Col>
                                    <Col className="bg-white p-4 m-0 mb-5">
                                        <h4 className="fw-bolder"><Link to={`/book/${item.id}`} className="text-decoration-none text-black">{item?.title}</Link></h4>
                                        <span className="text-gray">By. {item?.author}</span>
                                        <p>{item?.desc}</p>
                                        <h5 className="text-green">{convertRupiah.convert(item?.price) }</h5>
                                        {state.isLogin ? <ButtonCart id={item.id}/> : ''}
                                    </Col>
                                </Row>
                            </Container>

                        </Col>

                    })}
                    </Slider>
                </Row>
            </Container>
    );
};

export default PromoBooks;