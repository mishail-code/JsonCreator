import React, { useState } from 'react';
import structuredClone from '@ungap/structured-clone';
import './JsonCreator.css';
import Toolbar from '../Toolbar/Toolbar.js';
import { JsonEditor, convertJsonToEditorFormat, decodeJsonFromEditorFormat } from '../JsonEditor/JsonEditor.js'

function saveFile(filename, data) {
  const blob = new Blob([data], {type: 'application/json'});
  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  }
  else {
    const elem = window.document.createElement('a');
    const objectUrl = window.URL.createObjectURL(blob);
    elem.href = objectUrl;
    elem.download = filename;        
    elem.click();        
    window.URL.revokeObjectURL(objectUrl);
  }
}

function traverseToEndPosition(newJsonContent, position, offsetFromLast) {
  let currentObjRef = newJsonContent;
  for(let i=0; i<(position.length-offsetFromLast); i++) {
    let positionArg = position[i];
    if(positionArg.type === 'value') {
      currentObjRef = currentObjRef[positionArg.index].valueField;
    }
    else if(positionArg.type === 'data') {
      currentObjRef = currentObjRef[positionArg.index];
    }
  }
  return currentObjRef;
}

function JsonCreator() {
  const sampleData = {"": ""};

  const [jsonContent, setJsonContent] = useState(convertJsonToEditorFormat(sampleData));
  const changeJsonContent = (position, newValue) => {
    if(position.length === 0)
      setJsonContent(newValue);
    else {
      let newJsonContent = structuredClone(jsonContent);
      let currentObjRef = traverseToEndPosition(newJsonContent, position, 1);

      let lastPosition = position[position.length -1];
      if(lastPosition.type === 'key') {
        currentObjRef[lastPosition.index].keyField = newValue;
      }
      else if(lastPosition.type === 'value') {
        currentObjRef[lastPosition.index].valueField = newValue;
      }
      else if(lastPosition.type === 'data') {
        currentObjRef[lastPosition.index] = newValue;
      }

      setJsonContent(newJsonContent);
    }
  }
  const jsonAddHandler = (position, dataType) => {
    let newJsonContent = structuredClone(jsonContent);
    let lastObjRef = traverseToEndPosition(newJsonContent, position, 0);
    if(dataType === '[]')
      lastObjRef.push('');
    else if(dataType === '{}') {
      lastObjRef.push({
        'keyField': '',
        'valueField': ''
      });
    }
    setJsonContent(newJsonContent);
  }
  const jsonDeleteHandler = (position) => {
    if(position.length === 0)
      alert('Cannot delete the root json item');
    else {
      let newJsonContent = structuredClone(jsonContent);
      let penultimateObjRef = traverseToEndPosition(newJsonContent, position, 1);
      const lastPosition = position[position.length -1];
      penultimateObjRef.splice(lastPosition.index, 1);
      setJsonContent(newJsonContent);
    }
  }

  const downloadCurrentJson = () => {
    saveFile('JsonDataFile', JSON.stringify(decodeJsonFromEditorFormat(jsonContent), null, 2));
  }
  const updateJsonToUploadedFile = (jsonData) => {
    setJsonContent(convertJsonToEditorFormat(jsonData));
  }

  return (
    <div className="json-creator-app">
      <Toolbar downloadAction={downloadCurrentJson} uploadAction={updateJsonToUploadedFile}/>
      <div className='main-json-container'>
        <JsonEditor data={jsonContent} isExpanded={true} position={[]}
          jsonChangeHandler={changeJsonContent} jsonAddHandler={jsonAddHandler} jsonDeleteHandler={jsonDeleteHandler}/>
      </div>
    </div>
  );
}

export default JsonCreator;
