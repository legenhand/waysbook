import React, {useEffect} from 'react';
import Nav from "../../components/nav";
import PromoBooks from "../../components/home/promoBooks";
import ListBook from "../../components/home/listBook";

const Landing = () => {

    useEffect(() => {

    }, [])
    return (
        <div>
            <Nav/>
            <h1 className="m-5 text-center">With us, you can shop online &<br/> help save your high street at the
                same time</h1>
            <PromoBooks/>
            <h1 className="px-5 m-5 fw-bold">List Book</h1>
            <ListBook/>
        </div>
    );
};

export default Landing;

