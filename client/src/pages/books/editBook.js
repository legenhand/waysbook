import React from 'react';
import Nav from "../../components/nav";
import EditBookForm from "../../components/book/EditBookForm";
import {useParams} from "react-router-dom";

const EditBook = () => {
    const {id} = useParams();
    return (
        <div>
            <Nav/>
            <EditBookForm id={id}/>
        </div>
    );
};

export default EditBook;