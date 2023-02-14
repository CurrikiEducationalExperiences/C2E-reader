/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from "react";
//import h5p1 from '../test.json'

const H5PEditor = ({ h5p }) => {
  useEffect(() => {
    if (h5p) {
      window.H5P = window.H5P || {};
      //window.H5P.preventInit = true;
      window.H5PIntegration = h5p.settings;
      const h5pWrapper = document.getElementById("curriki-h5p-wrapper");
      h5pWrapper.innerHTML = h5p.embed_code?.trim();
      const newStyles = h5p.settings?.core.styles.concat(h5p.settings.loadedCss);
      const newScripts = h5p.settings?.core.scripts.concat(h5p.settings.loadedJs);
      // Load H5P assets

      loadAssets(newStyles, newScripts);
    }
  }, [h5p]);
  // load h5p style
  const loadAssets = (styles, scripts) => {
    styles?.forEach((style) => {
      const link = document.createElement("link");
      link.href = style;
      link.type = "text/css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
    scripts?.forEach((script) => {
      const element = document.createElement("script");
      element.onload = () => {
        console.log(`Assets loaded: ${element.src}`);
      };
      element.src = script;
      element.async = false;
      document.body.appendChild(element);
    });
  };
  // load h5p content
  return <div>{h5p && <div id="curriki-h5p-wrapper">Loading...</div>}</div>;
};

export default H5PEditor;
