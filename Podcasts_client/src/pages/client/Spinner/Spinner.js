import React from "react";
import "./Spinner.css";

function Spinner() {
  return (
/* From Uiverse.io by lenin55 */ 
<div className="ui-loader loader-blk d-flex m-auto fixed-bottom">
    <svg viewBox="22 22 44 44" className="multiColor-loader">
        <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6" className="loader-circle loader-circle-animation"></circle>
    </svg>
</div>

  );
}

export default Spinner;
