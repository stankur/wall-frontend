import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import styled, {css} from "styled-components";

const Button = styled.button`
    height: 2.85vw;
`
const Form = styled.div`
    display:flex;
    width: 500px;
    background-color: gray;
    gap: 2vw;
    flex-direction: column;
    padding: 20px;
`

const  InputForm = styled.textarea`
    display: flex;
    height: 50px;
`

const HeaderForm = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
`

const FormButton = styled(Button)`
    width: 150px;
    ${props => props.clicked && css`
        scale: 0.8;
        color: gray;
    `}
`

const FormTitle = styled.div`
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
`


export default function MessageForm(){
    const [message, setMessage] = useState({type: '', report: ''});
    function handleClickSend(e){
        e.preventDefault();
        emailjs.send("service_2altxjt", "template_0x7mz34",  message, "E4JNpSQZ4oSmYltPl")
        .then(response => {
            console.log('SUCCESS');
            setMessage({
                type: "",
                report: ""
            })
        }, error => {
            console.log('FAILED', error);
        });
    }

    function handleChangeReport(e){
        setMessage({
            ...message,
            report: e.target.value});
    }

    function handleChangeType(x){
        setMessage({
            ...message,
            type: x
        });
    }
    return(
        <Form>
            <FormTitle>Shoot us a message!</FormTitle>
            <HeaderForm>
                {message.type === 'Error' ? <FormButton clicked>Error</FormButton> : <FormButton onClick={() => handleChangeType("Error")}>Error</FormButton>}
                {message.type === 'Suggestion' ? <FormButton clicked>Suggestion</FormButton> : <FormButton onClick={() => handleChangeType("Suggestion")}>Suggestion</FormButton>}
            </HeaderForm>
            <InputForm value={message.report} onChange={(e) => handleChangeReport(e)}/>
            <Button onClick={handleClickSend}>SEND</Button>
        </Form>
    )
}