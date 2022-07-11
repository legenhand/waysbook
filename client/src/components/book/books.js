import React, {useEffect, useState} from 'react';
import {Button, Container, Table} from "react-bootstrap";
import {useMutation, useQuery} from "react-query";
import {API} from "../../config/api";
import {Link} from "react-router-dom";
import DeleteData from "../modal/deleteData";

const Books = () => {

    const {data : books, refetch } = useQuery('listBooksAdmin', async () => {
        const res = await API.get('/books')
        return res.data.data;
    });
    // Create init useState & function for handle show-hide modal confirm here ...
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [idDelete, setIdDelete] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    useEffect(() => {
        if (confirmDelete) {
            // Close modal confirm delete data
            handleClose();
            // execute delete data by id function
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/book/${id}`);
            await refetch();
        } catch (error) {
            console.log(error);
        }
    });

    let count = 0;
    return (
        <Container>
            <h1>Books</h1>
            <Link to="/add-book"><Button variant="success" className="float-end mb-3">Add Books</Button></Link>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {books?.map(item => {
                    count += 1;
                    return (<tr>
                        <td>{count}</td>
                        <td>{<img src={item.thumbnail} alt="" width="100px" height="125px"/>}</td>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
                        <td>{item.price}</td>
                        <td>
                            <Link to={`/edit-book/${item.id}`}><Button variant="success">Edit</Button></Link>
                            <Button variant="danger" onClick={() => {
                                handleDelete(item.id)}}
                                className="ms-2"
                            >Delete</Button>
                        </td>
                    </tr>);
                })}

                </tbody>
            </Table>
            <DeleteData
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose}
            />
        </Container>
    );
};

export default Books;