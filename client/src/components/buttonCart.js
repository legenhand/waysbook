import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {API} from "../config/api";
import {useCart} from "../hooks/useCart";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";

const ButtonCart = (props) => {
    const id = props.id;
    const {data : book} = useQuery('bookDetail',async ()=> {
        const res = await API.get(`/book/${id}`);
        return res.data.data
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
        API.post(`/cart/${id}`).then(r => '').catch(e => console.log(e));
    }

    const handleRemoveFromCart = () => {
        setIsAdded(false);
        API.delete(`/cart/${id}`).then(r => '').catch(e => console.log(e));
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
                console.log('ada');
                setIsAdded(true);
                break;
            }
        }
    }, [isAdded])
    return (
        <div>
            <Button variant="dark" className="float-end" onClick={handleRemoveFromCart} hidden={!isAdded} >Remove from cart <FontAwesomeIcon icon={faCartShopping}/></Button>
            <Button variant="dark" className="float-end" onClick={handleAddToCart}  hidden={isAdded}>Add to cart <FontAwesomeIcon icon={faCartShopping}/></Button>
        </div>
    );
};

export default ButtonCart;