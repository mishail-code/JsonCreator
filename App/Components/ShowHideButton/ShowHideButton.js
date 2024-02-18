import React from "react";
import './ShowHideButton.css';

export default (props) => {
  return (
    <div className="json-visibility-icon" onClick={props.toggleVisibility}>
      {
        props.isExpanded &&
        <i className="ri-arrow-left-s-fill json-icon" />
      }
      {
        !props.isExpanded &&
        <i className="ri-arrow-right-s-fill json-icon" />
      }
    </div>
  );
}