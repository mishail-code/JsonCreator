import React, { useState } from "react";
import './JsonEditor.less';
import TypeSelector from "../TypeSelector/TypeSelector.js";
import ShowHideButton from "../ShowHideButton/ShowHideButton";

const convertJsonToEditorFormat = (jsonObj) => {
  if(typeof jsonObj === 'object' && Array.isArray(jsonObj)) {
    let convertedObj = [];
    convertedObj.isObjectArray = false;
    jsonObj.forEach(arrElem => {
      convertedObj.push(convertJsonToEditorFormat(arrElem));
    });
    return convertedObj;
  }
  else if(typeof jsonObj === 'object' && !Array.isArray(jsonObj)) {
    let convertedObj = [];
    convertedObj.isObjectArray = true;
    for(const [key, value] of Object.entries(jsonObj)) {
      convertedObj.push({
        keyField: key,
        valueField: convertJsonToEditorFormat(value)
      });
    }
    return convertedObj;
  }
  else
    return jsonObj.toString();
}

const decodeJsonFromEditorFormat = (editorObj) => {
  if(typeof editorObj === 'object' && editorObj.isObjectArray) {
    let jsonObj = {};
    editorObj.forEach((objEntry) => {
      jsonObj[objEntry['keyField']] = decodeJsonFromEditorFormat(objEntry['valueField']);
    });
    return jsonObj;
  }
  else if(typeof editorObj === 'object' && !editorObj.isObjectArray) {
    return editorObj.map((arrElem) => decodeJsonFromEditorFormat(arrElem));
  }
  else if(typeof editorObj === 'string')
    return editorObj;
}

const getUniqueId = (position) => {
  return position.slice(-5, position.length).map(positionObj => positionObj.index).join('');
}

function ObjectEditor(props) {
  const handleKeyValueChange = (position, event) => {
    props.jsonChangeHandler([...position, {
      'index': event.target.getAttribute('data-position'),
      'type': 'key'
    }], event.target.value);
  }
  return (
    <>
      {
        !props.data.isObjectArray && 
        <div className="data-array-value js-col">
          {
            (props.data.map((obj, index) => {
              return (
                <div className="json-entry-row js-row" key={getUniqueId([...props.position, {'index':index}])}>
                  <JsonEditor data={obj} isAltBackground={props.isAltBackground}
                    jsonChangeHandler={props.jsonChangeHandler}
                    jsonAddHandler={props.jsonAddHandler}
                    jsonDeleteHandler={props.jsonDeleteHandler}
                    position={[...props.position, {
                      'index': index,
                      'type': 'data'
                    }]} />
                </div>
              );
            }))
          }
        </div>
      }
      {
        props.data.isObjectArray && 
        <div className="data-object-value js-col">
          {
            props.data.map((entryObj, index) => {
              return (
                <div className="json-entry-row js-row" key={getUniqueId([...props.position, {'index':index}])} >
                  <input className="data-key-value" value={entryObj.keyField} data-position={index}
                    onChange={(event) => handleKeyValueChange(props.position, event)}></input>
                  <JsonEditor data={entryObj.valueField} isAltBackground={props.isAltBackground}
                    jsonChangeHandler={props.jsonChangeHandler}
                    jsonAddHandler={props.jsonAddHandler}
                    jsonDeleteHandler={props.jsonDeleteHandler}
                    position={[...props.position, {
                      'index': index,
                      'type': 'value'
                    }]} />
                </div>
              );
            })
          }
        </div>
      }
    </>
  );
}

function JsonEditor(props) {
  const [isExpanded, setIsExpanded] = useState((props.isExpanded!==null && props.isExpanded!==undefined)?
                                      props.isExpanded: (typeof props.data !== 'object'));
  const isAltBackground = props.isAltBackground? props.isAltBackground : false;
  return (
    <div className={"json-editor-element js-row" + (isAltBackground? ' alt-background': '')}>
      <TypeSelector value={((typeof props.data ==='string')? 'string': (props.data.isObjectArray)? 'object': 'array')}
        position={props.position} 
        changeHandler={props.jsonChangeHandler}
        jsonAddHandler={props.jsonAddHandler}
        jsonDeleteHandler={props.jsonDeleteHandler} />
      {
        typeof props.data === 'object' && isExpanded &&
        <ObjectEditor data={props.data} isAltBackground={!isAltBackground} position={props.position} 
          jsonChangeHandler={props.jsonChangeHandler}
          jsonAddHandler={props.jsonAddHandler}
          jsonDeleteHandler={props.jsonDeleteHandler}/>
      }
      {
        typeof props.data === 'string' && isExpanded &&
        (<input className="data-string-value" value={props.data}
            onChange={(event) => props.jsonChangeHandler(props.position, event.target.value)}></input>)
      }
      <ShowHideButton isExpanded={isExpanded} toggleVisibility={() => setIsExpanded(!isExpanded)} />
    </div>
  );
}



export {JsonEditor, convertJsonToEditorFormat, decodeJsonFromEditorFormat};