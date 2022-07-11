import React from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import {useQuery} from "react-query";
import {API} from "../../config/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLocationDot, faMarsAndVenus, faPhone} from "@fortawesome/free-solid-svg-icons";
import PurchasedBooks from "./purchasedBooks";

const DetailProfile = () => {
    let {data : profile} = useQuery('detailProfile', async () => {
        const res = await API.get('/profile');
        return res.data.data
    });
    return (
        <div>
            <Container  >
                <h1>Profile</h1>
                <Row className="bg-pink rounded-3 p-4" >
                    <Col>
                        <Row className="mb-4">
                            <Col md="1">
                                <FontAwesomeIcon icon={faEnvelope} style={{fontSize: "50px"}} className="text-gray"></FontAwesomeIcon>
                            </Col>
                            <Col>
                                <p className="mb-0">{profile?.email}</p>
                                <p className="text-gray mb-0">Email</p>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md="1">
                                <FontAwesomeIcon icon={faMarsAndVenus} style={{fontSize: "50px"}} className="text-gray"></FontAwesomeIcon>
                            </Col>
                            <Col>
                                <p className="mb-0">{profile?.profile?.gender ? profile?.profile?.gender : '-'}</p>
                                <p className="text-gray mb-0">Gender</p>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md="1">
                                <FontAwesomeIcon icon={faPhone} style={{fontSize: "50px"}} className="text-gray"></FontAwesomeIcon>
                            </Col>
                            <Col>
                                <p className="mb-0">{profile?.profile?.phone ? profile?.profile?.phone : '-'}</p>
                                <p className="text-gray mb-0">Mobile Phone</p>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md="1" className="ps-3">
                                <FontAwesomeIcon icon={faLocationDot} style={{fontSize: "50px"}} className="text-gray center"></FontAwesomeIcon>
                            </Col>
                            <Col>
                                <p className="mb-0">{profile?.profile?.location ? profile?.profile?.location : '-'}</p>
                                <p className="text-gray mb-0">Location</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col md="3" className="align-content-center">
                        <img src={profile?.profile?.avatar} alt="avatar" className="w-100 rounded-3" />
                        <Button variant="danger" className="w-100 mt-3">Edit Profile</Button>
                    </Col>
                </Row>
                <Row>
                    <PurchasedBooks/>
                </Row>
            </Container>
        </div>
    );
};

export default DetailProfile;