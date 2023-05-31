import React from 'react'
import { Background, LoadingText } from './Styles'
import Spinner from '../img/spinner.gif'

function Loading() {
  return (
    <Background>
        <LoadingText>잠시만 기다려 주세요.</LoadingText>
        <img src={Spinner} alt="Loading" width="50%"/>
    </Background>
  )
}

export default Loading