// import hook
import React, { useState, useEffect, useContext } from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import Contact from '../../components/complain/contact'

// import here
import Chat from '../../components/complain/chat'

import { UserContext } from '../../context/userContext'

// import socket.io-client
import {io} from 'socket.io-client'
import Nav from "../../components/nav";

// initial variable outside socket
let socket
export default function Complain() {
    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    // code here
    const [messages, setMessages] = useState([])

    const title = "Complain admin"
    document.title = 'DumbMerch | ' + title

    // code here
    const [state] = useContext(UserContext)

    useEffect(() =>{
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem("token")
            }
        })

        // code here
        socket.on("new message", () => {
            socket.emit('load messages', contact?.id)
        })

        // listen error sent from server
        socket.on("connect_error", (err) => {
            console.error(err.message); // not authorized
        });
        loadContact()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages]) // code here

    const loadContact = () => {
        // emit event load admin contact
        socket.emit("load admin contact")
        // listen event to get admin contact
        socket.on("admin contact", (data) => {
            // manipulate data to add message property with the newest message
            // code here

            const dataContact = {
                ...data,
                message: messages.length > 0 ? messages[messages.length - 1].message : 'Click here to start message'
            }
            setContacts([dataContact])
        })
    }

    // used for active style when click contact
    const onClickContact = (data) => {
        setContact(data)
        // code here
        socket.emit('load messages', data.id)
    }

    // code here
    const loadMessages = () => {
        socket.on('messages', async (data) => {
            if(data.length > 0){
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)
            }else{
                setMessages([])
                loadContact()
            }
        })
    }

    const onSendMessage = (e) => {
        if(e.key == "Enter"){
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            socket.emit('send message', data)
            e.target.value = ''
        }
    }

    return (
        <>
            <Nav />
            <Container style={{height: '80.5vh' }} className="">
                <Row>
                    <Col md={3} className="px-3 mx-3 rounded-3 overflow-auto bg-grey-light">
                        <Contact dataContact={contacts} clickContact={onClickContact} contact={contact}/>
                    </Col>
                    <Col md={8} style={{height: '75.5vh'}} className="px-3 rounded-3 overflow-auto bg-grey-base">
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}  />
                    </Col>
                </Row>
            </Container>
        </>
    )
}
