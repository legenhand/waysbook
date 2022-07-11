import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {API} from "../config/api";
import {useCart} from "../hooks/useCart";
import {Button, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";

const ButtonCart = (props) => {
    const id = props.id;
    const {data : book} = useQuery('bookDetail',async ()=> {
        const res = await API.get(`/book/${id}`);
        return res.data.data
    });

    const {data : carts, refetch} = useQuery('listItemCartssss',async ()=> {
        const res = await API.get(`/carts`);
        return res.data.data[0]
    });
    const [isAdded, setIsAdded] = useState(false);
    const {addProduct, removeProduct, cartItems} = useCart();

    const handleAddToCart = () => {
        addProduct({
            ...book,
            cart_item :{
                book_id : id
            }
        });
        setIsAdded(true);
        API.post(`/cart/${id}`).then(r => refetch()).catch(e => console.log(e));
        setModalShow(true);
    }

    const handleRemoveFromCart = () => {
        setIsAdded(false);
        API.delete(`/cart/${id}`).then(r => refetch()).catch(e => console.log(e));
        removeProduct({
            ...book,
            cart_item :{
                book_id : id
            }
        });
    }

    useEffect(()=>{
        for (let i = 0; i < cartItems?.length; i++) {
            if (cartItems[i]?.cart_item?.book_id == id ){
                setIsAdded(true);
                break;
            }
        }
    }, [isAdded])
    const [modalShow, setModalShow] = React.useState(false);
    return (
        <div>
            <Button variant="dark" className="float-end" onClick={handleRemoveFromCart} hidden={!isAdded} >Remove from cart <FontAwesomeIcon icon={faCartShopping}/></Button>
            <Button variant="dark" className="float-end" onClick={handleAddToCart}  hidden={isAdded}>Add to cart <FontAwesomeIcon icon={faCartShopping}/></Button>
            <Modal show={modalShow}
                   onHide={() => setModalShow(false)} centered>
                <Modal.Body style={{backgroundColor : '#5ef800'}} >
                    <h5 className="text-center">Successfully added books to cart!</h5>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ButtonCart;