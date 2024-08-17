import React from "react";
import "./Spinner.css";

function Spinner() {
  return (

<div className="loaderViewPort">
  <div className="loaders">
    <div className="side front">
      <div className="dot"></div>
    </div>
    <div className="side back">
      <div className="dotContainer">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
    <div className="side left">
      <div className="dotContainer">
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
    <div className="side right">
      <div className="dotContainer">
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
    <div className="side top">
      <div className="dotContainer">
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="subDotContainer">
          <div className="dot"></div>
        </div>
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
    <div className="side bottom">
      <div className="dotContainer">
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="subDotContainer">
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}

export default Spinner;
