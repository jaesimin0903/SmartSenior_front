import React, {useState, useEffect} from 'react'
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'
import axios from 'axios'
import img from "../img/diffusion.png"


function HomeScreen() {
    const [chat, setChat] = useState("");
    const [flag, setFlag] = useState(false);
    const [result, setResult] = useState("")
    const [chatFlag, setChatFlag] = useState(0);
    const [audioSource, setAudioSource] = useState('');
    const [txt2img, setTxt2img] = useState("")
    const [hasImg, setHasImg] = useState(false);

    useEffect(() => {
      
    
      return () => {
        
      }
    }, [hasImg]);
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

    const startRecord =() =>{
        setChat("");
        SpeechRecognition.startListening({continuous:true,language:'ko'});
    }

    const stopRecord = () =>{
        setChat(transcript);

        SpeechRecognition.stopListening();
    }

    const requestAudio = async (text) =>{
      console.log("before tts")
      const response = axios.get('/api/tts', {params:{chat:text},responseType:'arraybuffer'});

      console.log("response", (await response).data);
      const res = (await response).data;
      const audioContext = getAudioContext();

      const audioBuffer = await audioContext.decodeAudioData(res);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      console.log("source : ", source);
      setAudioSource(source);
    };

    const getAudioContext = () =>{
      AudioContext = window.AudioContext;
      const audioContent = new AudioContext();
      return audioContent;
    }

    const requestImg = async (text) =>{
      // axios.get('/api/img',{params:{request:text}}).then(async(res) =>{
      //   const data = res.data;
      //   console.log("api/img : ", res);
      //   setHasImg(true);
      // })

      const response =  axios.get('/api/img',{params:{request:text}, responseType:'stream'});
      console.log("api img response", (await response).data)
      console.log(hasImg);
      setHasImg(true);
      console.log(hasImg);
      
    };

    const callAPI = async (text) =>{
        console.log("text", text);
        axios.get("/api/chatgpt",{params:{chat:text}}).then((res) => {
            console.log(flag)
          //setChat(res.data.chat);
          setFlag(true);
          console.log(res.data.chat.content);
          setResult(res.data.chat.content);
          //addResultChat(result);
          requestAudio(res.data.chat.content);
          console.log("after audio");
        });
      };

      useEffect(() => {
        addResultChat(result);
      }, [result])
      
    
    const onChangeInput = (e) =>{
        //console.log(e.target.value);
        setChat(e.target.value);
    }

    const onChangeImg = (e) =>{
      setTxt2img(e.target.value);
    }

    const addResultChat = (result) =>{
        const resultDiv = document.querySelector('#result');
        const resultChat = document.createElement('div');
        resultChat.className = `chat${chatFlag}`
                //const resultChatHTML = document.createTextNode("");
        //resultChat.appendChild(resultChatHTML);
        resultChat.innerHTML = result;
        resultDiv.appendChild(resultChat);
        setChatFlag(chatFlag+1);

        }
  return (
    <div>
        <button id='send' onClick={startRecord}>Start Record</button>
        <button id='stop' onClick={stopRecord}>Stop Record</button>
        <hr/>
        <input type="text" onChange={onChangeInput} onFocus={onChangeInput} defaultValue={transcript}></input>
        <div>{transcript}</div>
        <button onClick={()=>{callAPI(chat);}}>Send</button>
        <div id='result'></div>
        <input type="text" onChange={onChangeImg}></input>
        <button onClick={()=>{requestImg(txt2img); setHasImg(false)}}>Img</button>
        {hasImg ?
          <img src={img} alt="img"/>
          :
          
          <div>이미지가 없습니다.</div>
        }
    </div>
  )
}

// const send_btn = document.querySelector('#send');
// const final_span = document.querySelector('#final_span');
// const interim_span = document.querySelector('#interim_span');
// let finalTranscript = '';

// send_btn.addEventListener("click", () =>{
//     //api(send_btn.text);
// })

//     if(!("webkitSpeechRecognition" in window)){
//         alert("Please go to Chrome");
//     }
//     else{
//         const speech = new webkitSpeechRecognition;
//         speech.continuous = true;
//         speech.interimResults = true; 
//         document.getElementById("start").addEventListener("click",() => {
//             speech.start();
//             ignoreEndProcess = false;

//         finalTranscript = '';
//         final_span.innerHTML = '';
//         interim_span.innerHTML = '';
//         })
//         document.getElementById("stop").addEventListener("click", ()=>{
//             speech.stop();
//         })

//         speech.addEventListener("result",(event) =>{
//             const {transcript} = event["results"][0][0];
//             //let text = document.getElementById("text");
//             //text.innerText=transcript;
//             console.log(transcript);
//         })

//         speech.onresult = function (event) {
//             console.log('onresult', event);
    
//             //let finalTranscript = '';
//             let interimTranscript = '';
//             if (typeof event.results === 'undefined') {
//                 speech.onend = null;
//                 speech.stop();
//                 return;
//             }
    
//             for (let i = event.resultIndex; i < event.results.length; ++i) {
//                 const transcript = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) {
//                     finalTranscript += transcript;
//                 } else {
//                     interimTranscript += transcript;
//                 }
//             }

//             final_span.innerHTML = finalTranscript;
//             interim_span.innerHTML = interimTranscript;
//             final_span_Handler();
    
//             console.log('finalTranscript', finalTranscript);
//             console.log('interimTranscript', interimTranscript);
//             // fireCommand(interimTranscript);
//         };
//     }
//     function final_span_Handler() {
//         if(final_span.innerHTML) {
//             const final_span_text = final_span.innerHTML; //final_span = "안녕하세요 저는 정이든 입니다."
//             const final_arr = final_span_text.split(' '); //["안녕하세요", "저는"]
            
//             let htmlEl = null;
//             final_arr.forEach((value, index) => {
//                 if(index === 0) {
//                     htmlEl = `<span class="resultWord" id=0>` + value + '<span/>';
//                 }else {
//                     htmlEl = htmlEl + `<span class="resultWord" id=${index}>${value}<span/> ` 
//                 }
//             });
//             console.log('htmlEl : ' + htmlEl);
            
//             // const resultWord = document.querySelector('.resultWord');
//             // resultWord.addEventListener('click', resultWordHandler);
//             final_span.innerHTML = htmlEl;
//         }else {
//             return null;
//         }
//     }

export default HomeScreen
