import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../img/diffusion.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Stack } from "react-bootstrap";
import Loading from "./Loading";
import ImageComponent from "./ImgComponent";

export const Img = () => {
  const [loading, setLoading] = useState(false);
  const [isImg, setIsImg] = useState(true);
  const [isText, setIsText] = useState(false);
  const [isMaking, setIsMaking] = useState(false);
  const [hasImg, setHasImg] = useState(true);

  const [selectedImg, setSelectedImg] = useState("");
  const [selectedText, setSelectedText] = useState("");

  const moveImgPage = () => {
    setIsImg(true);
    setIsText(false);
    setIsMaking(false);
    setSelectedImg("");
    setSelectedText("");
  };

  const moveTextPage = (img) => {
    setIsImg(false);
    setIsText(true);
    setIsMaking(false);
    setSelectedImg(img);
  };
  const moveMakingPage = async (text) => {
    setIsImg(false);
    setIsText(false);
    setIsMaking(true);
    setSelectedText(text);
    console.log(text);
    setLoading(true);
  };

  const requestImg = async (imgPrompt, textPrompt) => {
    console.log(imgPrompt, textPrompt);
    setLoading(true);
    const response = axios.get("/api/img", {
      params: { request: { imgPrompt, textPrompt } },
      responseType: "stream",
    });
    console.log("api img response", (await response).data);
    console.log(hasImg);

    console.log(hasImg);
  };

  const requestImgPrompt = async () => {
    setLoading(true);
    axios.get("/api/imgPrompt", { params: { request: {} } }).then((res) => {
      console.log("api img response", res.data);
      moveTextPage(res.data);
      setLoading(false);
    });
  };

  

  const requestTextPrompt = async (text_case) => {
    setLoading(true);
    axios
      .get("/api/textPrompt", { params: { request: { text_case } } })
      .then((res) => {
        console.log("api text response", res.data);
        moveMakingPage(res.data);
      });
  };

  const saveImg = () => {
    var imageName = "Image";
    imageName += ".png";
    var savedImg = document.getElementById("saveImg");
    var image = document
      .getElementById("outCanvas")
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    savedImg.setAttribute("download", imageName);
    savedImg.setAttribute("href", image);
  };
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  }

  const downloadImg = (imgSrc) => {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imgSrc;
    var fileName = image.src.split("/").pop();
    image.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      canvas.getContext("2d").drawImage(this, 0, 0);
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(
          dataURLtoBlob(canvas.toDataURL()),
          fileName
        );
      } else {
        console.log("download IMG");
        var link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = fileName;
        link.click();
      }
    };
  };
  // useEffect(() => {
  //   setHasImg(true);
  //   setLoading(false);
  // }, [img]);

  return (
    <Stack className="imageScreen">
      {loading && <Loading />}
      <div className="backline row col-md-12">
        <Link className="col-sm-4" to={"/"}>
          <Button variant="light">뒤로 가기</Button>
        </Link>
        <span className="col-md-8" id="title">
          <h4>나만의 사진 만들기</h4>
        </span>
      </div>
      
      {isImg && (
        <div className="makeImgBox">
          <div className="img-box">

            <p>
              <h3 className="img-title">어떤 사진으로 만들어 드릴까요?</h3>
            </p>
            <Stack gap={5} className="">
              <Button
                variant="light"
                onClick={() => moveTextPage("Pretty flower")}
                className="img-btn"
              >
                예쁜 꽃
              </Button>
              <Button
                variant="light"
                onClick={() => moveTextPage("Moutain Paranoma")}
                className="img-btn"
              >
                울창한 산
              </Button>
              <Button
                variant="light"
                onClick={() => moveTextPage("Summer Beach")}
                className="img-btn"
              >
                멋진 바다
              </Button>
              <Button variant="light" onClick={requestImgPrompt}
              className="img-btn"
              >
                
                마음대로 골라줘!
              </Button>
              <Link to="/">
                <Button variant="primary">뒤로 가기</Button>
              </Link>
            </Stack>
          </div>
        </div>
      )}

      {isText && (
        <div className="makeImgBox">
          <div className="img-box">
            <p>
              <h3 className="img-title">어떤 문장을 넣어 드릴까요?</h3>
            </p>
            <Stack gap={5}>
              <Button
                variant="light"
                onClick={() => requestTextPrompt("hello")}
                className="img-btn"
              >
                안녕을 묻는 글귀
              </Button>
              <Button variant="light" onClick={() => requestTextPrompt("love")}
              className="img-btn"
              >
                사랑을 전하는 글귀
              </Button>
              <Button
                variant="light"
                onClick={() => requestTextPrompt("quotes")}
                className="img-btn"
              >
                유명한 명언
              </Button>
              <Button
                variant="light"
                onClick={() => requestTextPrompt("random")}
                className="img-btn"
              >
                마음대로 정해줘!
              </Button>
              <Button variant="primary" onClick={moveImgPage}>
                뒤로 가기
              </Button>
            </Stack>
          </div>
        </div>
      )}

      {isMaking && (
        <div className="makeImgBox">
          <div>
            {hasImg ? (
              <div>
                <ImageComponent textPrompt={selectedText} inputValue ={selectedImg} moveImgPage={moveImgPage} setLoading={setLoading}/>
                {/* <img id="diffImg" src={img} alt="img" /> */}
                
              </div>
            ) : (
              <div>이미지를 만드는 중입니다.</div>
            )}
          </div>
        </div>
      )}
    </Stack>
  );
};
