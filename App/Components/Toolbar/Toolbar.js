import React, { useRef } from "react";
import './Toolbar.less';

export default function(props) {
  const fileInput = useRef();

  const getUploadedJson = (event) => {
    event.preventDefault();
    fileInput.current.files[0].text().then(jsonData => {
      props.uploadAction(JSON.parse(jsonData));
      fileInput.current.value = null;
    });
  }
  
  return (
    <div className='json-toolbar'>
      <div className="toolbar-header">Json Creator</div>
      <div className="toolbar-buttons-container">
        <input className="hidden-upload-input" ref={fileInput} type="file" onChange={getUploadedJson}></input>
        <button className="toolbar-button" onClick={() => fileInput.current.click()}>Upload</button>
        <button className="toolbar-button" onClick={props.downloadAction}>Download</button>
      </div>
    </div>
  );
}