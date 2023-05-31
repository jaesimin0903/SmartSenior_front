import React, { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Stack, Form, InputGroup } from "react-bootstrap";
import Loading from "./Loading";
import MDEditor from "@uiw/react-md-editor";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition'

export const Talk = () => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState("");
  const [result, setResult] = useState("");
  const [chatArr, setChatArr] = useState([]);
  const [audioSource, setAudioSource] = useState("");
  const [editorText, setEditorText] = useState("");
  const [isRecord, setIsRecord] = useState(false)
  const [memeArr, setMemeArr] = useState([])

  const onChangeInput = (e) => {
    setChat(e.target.value);
  };

  const requestAudio = async (text) => {
    console.log("before tts");
    const response = axios.get("/api/tts", {
      params: { chat: text },
      responseType: "arraybuffer",
    });

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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

const startRecord =() =>{
    setChat("");
    setIsRecord(true);
    SpeechRecognition.startListening({continuous:true,language:'ko'});
}

const stopRecord = () =>{
    setChat(transcript);
    setIsRecord(false);
    SpeechRecognition.stopListening();
}

  const getAudioContext = () => {
    AudioContext = window.AudioContext;
    const audioContent = new AudioContext();
    return audioContent;
  };

  const gptTextBox = (text) => {
    const talk_box = document.querySelector(".talk-box");
    const text_box = document.createElement("Button");
    text_box.className = "gpt-text";
    const gptText = document.createTextNode(text);
    text_box.appendChild(gptText);
    //음성 출력
    text_box.addEventListener("click", () => requestAudio(text));
    text_box.setAttribute("type", `button`);
    talk_box.appendChild(text_box);
  };

  const userTextBox = (text) => {
    const talk_box = document.querySelector(".talk-box");
    const text_box = document.createElement("div");
    text_box.className = "user-text";
    const userText = document.createTextNode(text);
    text_box.appendChild(userText);
    talk_box.appendChild(text_box);
  };

  const callAPI = async (text) => {
    resetTranscript()
    setLoading(true);
    
    const chatForm = { role: "user", content: text };
    const newChatArr = [...chatArr, chatForm];

    setChatArr(newChatArr);

    try {
      const res = await axios.get("/api/chatGPT", {
        params: { prompt: newChatArr },
      });
      const resultForm = { role: "assistant", content: res.data };
      setChatArr((prevChatArr) => [...prevChatArr, resultForm]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    // Reset chat for next input
    setChat("");
  };

  const callMeme = async () => {
    setLoading(true);
    const chatForm = { role: "user", content: "요즘 유행하는 유행어 5가지 알려줘!" };
    const newChatArr = [...chatArr, chatForm];
    setChatArr(newChatArr);
    try {
      const res = await axios.get("/api/chatGPT/meme", {
        params: { prompt: '' },
      });
      const resultForm = { role: "assistant", content: '5가지 유행어 제공해 드릴게요!' };
      setChatArr((prevChatArr) => [...prevChatArr, resultForm]);
      setMemeArr(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    // Reset chat for next input
    setChat("");
  };

  useEffect(() => {
    setChat(transcript);
  }, [transcript])
  

  return (
    <div className="talk">
      {loading ? <Loading /> : null}
      <div className="backline row">
        <Link className="col-sm-4" to={"/"}>
          <Button variant="light">뒤로 가기</Button>
        </Link>
        <span className="col-md-8" id="title">
          <h4>젊은이들과 수다 한판</h4>
        </span>
      </div>
      <Stack className="talkContent" gap={3}>
        <Stack className="talk-box">
        {chatArr.map((chat, index) => (
  [
    <div
      key={`${index}-div`}
      className={
        chat.role === "user"
          ? "user-text markdownDiv"
          : "gpt-text markdownDiv"
      }
      data-color-mode={chat.role === "user" ? "yellow" : "light"}
      onClick={() => requestAudio(chat.content)}
    >
      <MDEditor.Markdown source={chat.content} />
    </div>,
    chat.role === 'user' && chat.content.includes('유행어 5가지') && memeArr.map((meme, memeIndex)=>(
      <button className="gpt-text" key={`${index}-${memeIndex}-btn`} onClick={()=>callAPI(`${meme}`+ " 유행어 에 대한 설명과 예시대화를 알려줘!")}>{meme}</button>
    ))
  ]
))}

        </Stack>
        <div className="talkButtons welfare row justify-content-center">

          <div className="add_func d-flex justify-content-end">
            
            <Button className="m-1"onClick={callMeme}>유행어</Button>
            {!isRecord ?<Button className="mic_button m-1" onClick={startRecord}>🎙</Button>:
            <Button className="mic_button m-1" onClick={stopRecord}>🚫</Button>
          }
            
          </div>
          <div className="input_chat_box d-flex justify-content-center">
          <InputGroup className="">
            <Form.Control as="textarea" value={chat} onChange={onChangeInput} defaultValue={transcript}/>
          </InputGroup>
          <button onClick={()=>callAPI(chat)} disabled={loading || chat === ""}>
            Send
          </button>
          </div>
        </div>
      </Stack>
    </div>
  );
};
