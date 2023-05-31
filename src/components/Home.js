import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import img from "../img/diffusion.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Stack} from 'react-bootstrap'

export const Home = () => {
  return (
    <div className = "home d-flex align-content-between flex-wrap">
        <Stack gap={5} >
        <div className='homeText'>
            <p><b>안녕하세요! 어르신을 위한 똑똑한 인공지능이에요!</b> </p>
        </div>
        
        <Link to="/talk">
        <Button variant='light'>
            <p id='buttonTitle'><b>젊은이와 대화하기</b></p>
            <p id='buttonText'>젊은 친구와 젊은 대화를 나눠요!</p>
        </Button>
        </Link>
        {/* <Link to="/talk">hi</Link> */}
        <Link to="/img">
        <Button variant='light'>
            <p id='buttonTitle'><b>글귀 사진 만들기</b></p>
            <p id='buttonText'>원하시는 글귀로 예쁜 사진을 만들어 드릴게요!</p>
        </Button>
        </Link>
        <Link to="/work">
        <Button variant='light'>
            <p id='buttonTitle'><b>노인 복지 센터</b></p>
            <p id='buttonText'>일자리나 궁금한 정책에 대해 찾으시면 여기로 들어오세요!</p>
        </Button>
        </Link>
        </Stack>
    </div>
  )
}
