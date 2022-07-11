import React from 'react';
import {Container, Table} from "react-bootstrap";

const Books = () => {
    return (
        <Container>
            <h1>Books</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td colSpan={2}>Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default Books;