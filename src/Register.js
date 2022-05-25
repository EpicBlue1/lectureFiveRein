import axios from 'axios';
import React, { useState } from 'react'
import MiniModalLeft from './components/MiniModalLeft';
import MiniModalRight from './components/MiniModalRight';
import { useNavigate } from 'react-router-dom';
import Okay from '../src/assets/okay.svg';
import NotOkay from '../src/assets/notOkay.svg';

const Register = () => {

    const navigate = useNavigate();

    //user data
    const [inputs, setInputs]= useState({
        first: '',
        last: '',
        email: '',
        username: '',
        contact: '',
        password: '',
        passwordCon: '',
    });

    //error handling (error messages)
    const [nameError, setNameError] = useState();
    const [lastError, setLastError]  = useState();
    const [emailError, setEmailError] =  useState();
    const [usernameError, setUsernameError] = useState();
    const [contactError, setContactError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [passwordConError, setPasswordConError] = useState();

    //check user availability
    const [emailAvail, setEmailAvail] = useState();
    const [userAvail, setUserAvail] = useState();

    //triggers icon based on availability
    const [emailIcon, setEmailIcon] = useState();
    const [userIcon, setUserIcon] = useState();

    const firstVal = (e) => {
        const value = e.target.value;
        setInputs({...inputs, first: value});
        if(inputs.first !== ''){setNameError();}
    }

    const lastVal = (e) => {
        const value = e.target.value;
        setInputs({...inputs, last: value});
        if(inputs.last !== ''){setLastError();}
    }

    //email validation (onChange)
    const emailVal = (e) => {
        const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const value = e.target.value;
        setInputs({...inputs, email: value});
        if(inputs.email !== ''){setEmailError();}
        if(!value.match(mailRegex)){
            setEmailError(<MiniModalLeft message='Email is not valid format'/>);
        }
    }

    //email authenticate 
    const authEmail = (e) => {
        axios.post('http://localhost/lect5_api/authenticateEmail.php', inputs)
        .then(function(response) {
            console.log(response);
            if(response.data === 'Available'){
                //add tick
                setEmailIcon(Okay);
                setEmailAvail();
            } else if(response.data === 'Not Available'){
                //dont show tick
                setEmailIcon(NotOkay);
                setEmailAvail(<MiniModalLeft message='Email is not available'/>);
            } else if(response.data === ''){
                setEmailIcon();
                setEmailAvail();
                setEmailError();
            }
        })
    }

    const usernameVal = (e) => {
        const value = e.target.value.trim();
        setInputs({...inputs, username: value});
        if(inputs.username !== ''){setUsernameError();}
    }

    //username authenticate 
    const authUser = () => {
        axios.post('http://localhost/lect5_api/authenticateUser.php', inputs)
        .then(function(response) {
            console.log(response);
            if(response.data === 'Available'){
                //add tick
                setUserIcon(Okay);
                setUserAvail();
            } else if(response.data === 'Not Available'){
                //dont show tick
                setUserIcon(NotOkay);
                setUserAvail(<MiniModalRight message='Username is not available'/>);
            } else if(response.data === ''){
                setUserIcon();
                setUserAvail();
                setUsernameError();
            }
        })
    }

    //contact validation (onChange)
    const contactVal = (e) => {
        const contRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        const value = e.target.value;
        setInputs({...inputs, contact: value});
        if(inputs.contact !== ''){setContactError();}
        if(!value.match(contRegex)){
            setContactError(<MiniModalRight message='This is not a phone number'/>);
        }
    }   
    
    //password validation (onChange)
    const passwordVal = (e) => {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/ ;
        const value = e.target.value;
        setInputs({...inputs, password: value});
        if(inputs.password !== ''){setPasswordError();}
        if(!value.match(passRegex)){
            setPasswordError(<MiniModalLeft message='Password must include X, Y, or Z characters'/>);
        }
    } 

    //password confirmation validation (onChange)
    const passwordConVal = (e) => {
        // const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/ ;
        const value = e.target.value;
        setInputs({...inputs, passwordCon: value});
        if(inputs.password=== value){
            setPasswordConError();
        } else {
            setPasswordConError(<MiniModalLeft message='Your password does not match'/>);            
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputs);

        if(inputs.first === ''){
            setNameError(<MiniModalLeft message='Whats your name'/>)
        } else {
            setNameError()
        }

        if(inputs.last === ''){
            setLastError(<MiniModalRight message='Whats your last name'/>)
        } else {
            setLastError()
        }

        if(inputs.email === ''){
            setEmailError(<MiniModalRight message='Whats your email'/>)
        } else {
            setEmailError()
        }

        if(inputs.username === ''){
            setUsernameError(<MiniModalRight message='Whats your username'/>)
        } else {
            setUsernameError()
        }

        if(inputs.contact === ''){
            setContactError(<MiniModalRight message='Whats your number'/>)
        } else {
            setContactError()
        }

        if(inputs.password === ''){
            setPasswordError(<MiniModalRight message='Whats your password'/>)
        } else {
            setPasswordError()
        }

        if(inputs.passwordCon === ''){
            setPasswordConError(<MiniModalRight message='Confirm Password'/>)
        } else {
            setPasswordConError()
        }

        //checking if values is equal to nothing to return true or false
        let result = Object.values(inputs).some(o => o === '');

        if(result) {
            console("There is an error")
        } else {
            axios.post('http://localhost/lect5_api/addUser.php', inputs)
            .then(function(response) {
                console.log(response);

                if(response.status === 200) {
                    navigate("/login")
                }
            })
        }
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>Sign Up to FakeBook</h1>
            <p>Give us all that sweet sweet data!</p>
            <div className='names'>
                {nameError}
                <input name="first" className='left' type="text" placeholder='First Name' onChange={firstVal}/>
                {lastError}
                <input name='last' type="text" placeholder='Last Name'onChange={lastVal}/>
            </div> 
            {emailError}
            {emailAvail}     
            <div className='statusIcon'>
                <img src={emailIcon}/>
            </div>
            <input name="email" type="email" placeholder='Your Email' onBlur={authEmail} onChange={emailVal}/>
            <div className='userCon'>
                {usernameError}
                {userAvail}
                <div className='statusIconUser'>
                    <img src=""/>
                </div>
                <input name="username" className='left' type="username" placeholder='Select A Username' onBlur={authUser} onChange={usernameVal}/>
                <input name="contact" type="contact" placeholder='Contact Number' onChange={contactVal}/>
            </div>
            <div className='passCon'>
                {passwordError}
                <input name="password" type="password" placeholder='Choose A Password' onChange={passwordVal}/>
                {passwordConError}
                <input name="conPass" type="password" placeholder='Confirm Password'onChange={passwordConVal}/>
            </div>
            <button  type="submit">Take My Data Lizard Man!</button>
        </form>
            
    </div>
  )
}

export default Register
