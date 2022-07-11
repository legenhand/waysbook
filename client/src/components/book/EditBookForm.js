import React, {useEffect, useState} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import {API} from "../../config/api";
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";

const EditBookForm = ({id}) => {

    const initialValues = {
        title : '',
        publication_date : '',
        pages : '',
        ISBN : '',
        price : '',
        desc : '',
        author : '',
        image : '',
        ebook : '',
    }

    let { data: book} = useQuery('editBookCache', async () => {
        const response = await API.get(`/book/${id}`);
        return response.data.data;
    });

    const [preview, setPreview] = useState(null); //For image preview
    const [form, setForm] = useState(initialValues);

    useEffect(() => {
        if (book) {
            setPreview(book.thumbnail);
            setForm({
                ...form,
                title : book.title,
                publication_date : book.publication_date,
                pages : book.pages,
                ISBN : book.ISBN,
                price : book.price,
                desc : book.desc,
                author : book.author,
                image : '',
                ebook : '',
            });
        }
    }, [book]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });

        // Create image url for preview
        if (e.target.type === 'file' && e.target.name === 'image') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
        console.log(form);
    };

    let navigate = useNavigate();

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };

            // Store data with FormData as object
            const formData = new FormData();

            formData.set('title', form.title);
            formData.set('author', form.author);
            formData.set('publication_date', form.publication_date);
            formData.set('pages', form.pages);
            formData.set('ISBN', form.ISBN);
            formData.set('price', form.price);
            formData.set('desc', form.desc);
            if (form.image) {
                formData.set('image', form?.image[0], form?.image[0]?.name);
            }
            if (form.ebook) {
                formData.set('ebook', form?.ebook[0], form?.ebook[0]?.name);
            }

            // Insert product data
            await API.patch(`/book/${id}`, formData, config);
            navigate('/books');
        } catch (error) {
            console.log(error);
        }
    });

    return (
        <Container>

            <Form className="mx-5" onSubmit={e => handleSubmit.mutate(e)}>
                <h1>Add Book</h1>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" onChange={handleChange} name="title" defaultValue={book?.title}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" placeholder="Author" onChange={handleChange} name="author" defaultValue={book?.author}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Publication Date</Form.Label>
                    <Form.Control type="date" placeholder="Publication Date" onChange={handleChange} name="publication_date" defaultValue={book?.publication_date}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Pages</Form.Label>
                    <Form.Control type="text" placeholder="Pages" onChange={handleChange} name="pages" defaultValue={book?.pages}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control type="text" placeholder="ISBN" onChange={handleChange} name="ISBN" defaultValue={book?.ISBN}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" placeholder="Price" onChange={handleChange} name="price" defaultValue={book?.ISBN}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>About this book</Form.Label>
                    <Form.Control as="textarea" placeholder="About This Book" rows={3} onChange={handleChange} name="desc" defaultValue={book?.desc}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                    <img
                        src={preview}
                        style={{
                            maxWidth: '150px',
                            maxHeight: '150px',
                            objectFit: 'cover',
                        }}
                        alt={preview}
                    /><br/>
                    <Form.Label>Cover Book</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleChange} name="image"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Attach Book File</Form.Label>
                    <Form.Control type="file" accept="application/pdf" onChange={handleChange} name="ebook"/>
                </Form.Group>
                <Button type="submit" variant="dark" className="float-end">Edit Book</Button>
            </Form>
        </Container>
    );
};

export default EditBookForm;