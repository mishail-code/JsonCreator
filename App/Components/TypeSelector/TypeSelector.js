import React from "react";
import './TypeSelector.css';

const getDefaultValueForType = (type) => {
  if (type === '""')
    return "";
  else if (type === '{}') {
    let defaultObj = [{
      'keyField': "",
      'valueField': ""
    }];
    defaultObj.isObjectArray = true;
    return defaultObj;
  }
  else if (type === '[]') {
    let defaultObj = [''];
    defaultObj.isObjectArray = false;
    return defaultObj;
  }
}

export default (props) => {
  const jsonType = (props.value === 'object') ? '{}' : ((props.value === 'array') ? '[]' : '""');
  const alignClass = (props.value === 'string')? 'row-align': 'col-align';
  return (
    <div className={`json-type-container json-type-tools ${alignClass}`}>
      <select value={jsonType} 
        onChange={event => props.changeHandler(props.position, getDefaultValueForType(event.target.value))}
        className="json-type-tool-item" >
        <option>""</option>
        <option>[]</option>
        <option>&#123;&#125;</option>
      </select>
      <i className="ri-close-circle-fill json-type-tool-item json-remove-icon"
        onClick={() => props.jsonDeleteHandler(props.position)} />
      {
        (jsonType !== '""') &&
        <i className="ri-add-circle-fill json-type-tool-item json-add-icon "
          onClick={() => props.jsonAddHandler(props.position, jsonType)} />
      }
    </div>
  );
}