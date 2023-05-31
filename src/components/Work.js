import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../img/diffusion.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, InputGroup, Stack } from "react-bootstrap";
import Loading from "./Loading";
import MDEditor from "@uiw/react-md-editor";

const policies = {
  노인정책: [
    "치매검진사업",
    "치매치료관리지지원사업",
    "노인실명예방관리사업",
    "노인맞춤돌봄서비스",
    "노인주거복지시설",
  ],
  노인지원: [
    "노인자원봉사활성화",
    "노인여가복지지원",
    "노인일자리 및 사회활동 지원사업",
  ],
  요양보험운영: ["노인의료복지시설", "재가노인복지시설"],
};

export const Work = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRule, setIsRule] = useState(false);
  const [isJob, setIsJob] = useState(false);
  const [welfareText, setWelfareText] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState("노인정책");
  const [selectedButton, setSelectedButton] = useState("노인정책");

  const handleClick = (policy) => {
    setSelectedButton(policy);
    setSelectedPolicy(policy);
  };
  

  const callAPI = async (text) => {
    setLoading(true);
    console.log("text", text);
    axios.get("/api/workGPT", { params: { prompt: text } }).then((res) => {
      setResult(res.data);
      setLoading(false);
      console.log(res.data);
    });
  };

  const callWelfareAPI = async (text) => {
    setLoading(true);
    console.log("text", text);
    axios.get("/api/welfareGPT", { params: { prompt: text } }).then((res) => {
      setResult(res.data.substr(5));
      setLoading(false);
      console.log(res.data);
    });
  };

  const onChangeInput = (e) => {
    //console.log(e.target.value);
    setWelfareText(e.target.value);
  };

  const makeQuestion = (text) =>{
    var tmpTxt = welfareText;
    setWelfareText(tmpTxt + text);
  }

  return (
    <div className="work">
      {loading ? <Loading /> : null}
      <div className="backline row">
        <Link className="col-sm-4" to={"/"}>
          <Button variant="light">뒤로 가기</Button>
        </Link>
        <span className="col-md-8" id="title">
          노인 복지 센터
        </span>
      </div>
      <Stack className="talkContent" gap={3}>
        <div className="talkDetail mt-3">
          {result ? (
            <div
              className="markdownDiv"
              data-color-mode="light"
              style={{ padding: 15 }}
            >
              <MDEditor.Markdown style={{ padding: 10 }} source={result} />
            </div>
          ) : (
            <div
              className="markdownDiv"
              data-color-mode="light"
              style={{ padding: 15 }}
            >
              <MDEditor.Markdown
                style={{ padding: 10 }}
                source={"버튼을 눌러 질문을 해주세요!"}
              />
            </div>
          )}
        </div>
        {!isRule && !isJob ? (
          <div className="talkButtons job d-flex justify-content-center">
            <Button
              className="category m-3 col-md-5"
              onClick={() => setIsRule(true)}
              variant="light"
            >
              노인<b>정책</b>에<br />
              대해서!
            </Button>

            <Button
              className="category m-3 col-md-5"
              onClick={() => setIsJob(true)}
              variant="light"
            >
              노인<b>일자리</b>에<br /> 대해서!
            </Button>
          </div>
        ) : isJob ? (
          <div className="button-container">
            <Button className="my-button" onClick={() => setIsJob(false)}>
              뒤로
            </Button>
            <Button
              className="my-button"
              onClick={() => {
                callAPI(
                  "직종을 분류해서 5개의 카테고리로 (운송, 서비스, 제조, 복지, 기타) 나눠보여줘."
                );
              }}
              variant="light"
            >
              일자리
              <br />
              정보
            </Button>
            <Button
              className="my-button"
              onClick={() => {
                callAPI(
                  "직종이 운송과 관련된 일자리를 알려줘. url 링크를 걸어줘. 직종, 위치, 급, 인원, 지원방법 알려줘. 각직종마다 구분선 넣어줘"
                );
              }}
              variant="light"
            >
              운송업
            </Button>
            <Button
              className="my-button"
              onClick={() => {
                callAPI(
                  "직종이 서비스와 관련된 일자리를 알려줘. url 링크를 걸어줘. 직종, 위치, 급, 인원, 지원방법 알려줘. 각직종마다 구분선 넣어줘"
                );
              }}
              variant="light"
            >
              서비스업
            </Button>
            <Button
              className="my-button"
              onClick={() => {
                callAPI(
                  "직종이 제조와 관련된 일자리를 알려줘. url 링크를 걸어줘. 직종, 위치, 급, 인원, 지원방법 알려줘. 각직종마다 구분선 넣어줘"
                );
              }}
              variant="light"
            >
              제조업
            </Button>
            <Button
              className="my-button"
              onClick={() => {
                callAPI(
                  "직종이 복지와 관련된 일자리를 알려줘. url 링크를 걸어줘. 직종, 위치, 급, 인원, 지원방법 알려줘. 각직종마다 구분선 넣어줘"
                );
              }}
              variant="light"
            >
              복지업
            </Button>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-center">
              {Object.keys(policies).map((policy, index) => (
                <Button
                  className="m-2"
                  onClick={() => handleClick(policy)}
                  key={index}
                  variant={policy === selectedButton ? "primary" : "light"}
                >
                  {policy.split("\n").map((str, index) => (
                    <React.Fragment key={index}>
                      {str}
                      <br />
                    </React.Fragment>
                  ))}
                </Button>
              ))}
            </div>
            {selectedPolicy && (
              <div className="mt-1  overflow-auto">
                {policies[selectedPolicy].map((policyItem, index) => (
                  <Button className="m-2 welfare-button" key={index} onClick={()=>setWelfareText(policyItem)}>
                    {policyItem.split("\n").map((str, index) => (
                      <React.Fragment key={index}>
                        {str}
                        <br />
                      </React.Fragment>
                    ))}
                  </Button>
                ))}
              </div>
            )}
            <div className="talkButtons welfare d-flex justify-content-center">
              <Button className="m-1" onClick={() => setIsRule(false)}>
                뒤로
              </Button>
              <InputGroup className="">
                <Form.Control
                  as="textarea"
                  value={welfareText}
                  onChange={onChangeInput}
                />
              </InputGroup>
              <Button
                className="m-1"
                onClick={() =>
                  callWelfareAPI("[START]" + welfareText + "[START]")
                }
              >
                전송
              </Button>
            </div>
            <div className="mt-1">
              <Button className="m-1" onClick={()=>makeQuestion("의 목적은 무엇인가요?")}>목적</Button>
              <Button className="m-1" onClick={()=>makeQuestion("의 대상자 무엇인가요?")}>대상자</Button>
              <Button className="m-1" onClick={()=>makeQuestion("의 사업내용은 무엇인가요?")}>사업내용</Button>
              <Button className="m-1" onClick={()=>makeQuestion("을 담당하는 부서의 연락처는 무엇인가요?")}>연락처</Button>
            </div>
          </div>
        )}
      </Stack>
    </div>

    //   </Stack>
    // </div>
  );
};
