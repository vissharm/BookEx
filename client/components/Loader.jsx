import React from "react";
import PropTypes from "prop-types";

const Loader = ({ text }) => (
  <div className="preloader-wrapper big active">
    <div className="spinner-layer spinner-blue-only">
      <div className="circle-clipper left">
        <div className="circle"></div>
      </div>
      <div className="gap-patch">
        <div className="circle"></div>
      </div>
      <div className="circle-clipper right">
        <div className="circle"></div>
      </div>
    </div>
    {text && <p style={{ marginTop: "20px", color: "#444" }}>{text}</p>}
  </div>
);

Loader.propTypes = {
  text: PropTypes.string
};

export default Loader;
