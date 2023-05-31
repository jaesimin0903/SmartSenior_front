import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Button, Stack } from "react-bootstrap";

async function sendBlobAsBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Convert ArrayBuffer to Buffer
            const buffer = Buffer.from(reader.result);
            resolve(buffer);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


const ImageComponent = (props) => {
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
      query();  
    }, [])

    useEffect(() => {
        props.setLoading(false)  
      }, [imageURL])
    
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
    
    async function query() {
        console.log("Send Query")
        setImageURL('');
        var data = { "inputs": props.inputValue,"use_cache":false }
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        //const blob = await response.blob();
        var formData = new FormData();
        formData.append('name','jaemin');
        await response.blob().then((res)=>{
            console.log(res);
            formData.append('image',res);
            formData.append('textPrompt', props.textPrompt)
            console.log(formData.get('image'), formData.get('textPrompt'))
            
            axios.post("/api/imgEdit",formData).then((res) => {
                console.log("api img edit response", res.data);
                setImageURL(res.data.slice(2,-1))
              });
            //return formData;
        })
        //const dataURL = await blobToDataURL(blob);
        //console.log(dataURL)
        //return formData;
        
        //return URL.createObjectURL(blob);
    }


    const displayImage = async () => {
        console.log("Send Query")
        setImageURL('');
        //const result = await query({ "inputs": props.inputValue });
        await query({ "inputs": props.inputValue }).then((formdata) =>{
            var form = new FormData();
            form = formdata 
            console.log(form.get('image'))
            axios.post("/api/imgEdit",form).then((res) => {
                console.log("api img edit response", res.data);
                const str = res.data
                setImageURL(str.slice(2,-1))
              });
        })       
    }

    const requestImgEdit = async (result) => {
        axios.post("/api/imgEdit",result).then((res) => {
          console.log("api img edit response", res.data);
          setImageURL(res.data)
        });
    };
    

    return (
        <div>
            {imageURL && <img id='diffImg' src={`data:image/jpeg;base64,${imageURL}`} alt="Generated Image" />}
            <Button className="m-3" onClick={props.moveImgPage}>
                  다시하기
                </Button>

                <Button
                  id="saveImage"
                  className="m-3"
                  onClick={() => downloadImg(`data:image/jpeg;base64,${imageURL}`)}
                >
                  저장하기
                </Button>
        </div>
    );
}

export default ImageComponent;
