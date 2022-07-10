import React from 'react';
import Nav from "../../components/nav";
import Detail from "../../components/book/detail";
import {useParams} from "react-router-dom";

const BookDetail = () => {
    const {id} = useParams();
    return (
        <div>
            <Nav/>
            <Detail id={id}/>
        </div>
    );
};

export default BookDetail;