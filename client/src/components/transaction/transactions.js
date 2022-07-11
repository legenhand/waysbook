import React from 'react';
import {Button, Container, Table} from "react-bootstrap";
import {useQuery} from "react-query";
import {API} from "../../config/api";
import {Link} from "react-router-dom";

const Transactions = () => {

    const {data : transactions } = useQuery('listAllTransaction', async () => {
        const res = await API.get('/transactions')
        return res.data.data;
    });

    let count = 0;
    return (
        <Container>
            <h1>Incoming Transaction</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Users</th>
                    <th>id transaction</th>
                    <th>Product Purchased</th>
                    <th>Total Payment</th>
                    <th>Status Payment</th>
                </tr>
                </thead>
                <tbody>
                {transactions?.map(item => {
                    count += 1;
                    return (<tr>
                        <td>{count}</td>
                        <td>{item.buyer.name}</td>
                        <td>{item.id}</td>
                        <td>{item.books.map(item => {
                            return (<>{item.title}, <br/></>)
                        })}</td>
                        <td>{item.totalPrice}</td>
                        <td className={item.status == 'success' ? 'text-success fw-bold' : 'text-danger fw-bold'}>{item.status}</td>
                    </tr>);
                })}

                </tbody>
            </Table>
        </Container>
    );
};

export default Transactions;