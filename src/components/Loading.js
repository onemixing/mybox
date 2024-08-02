import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate} from "react-router-dom";

export const Loading = function(){

    return <div><div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
      <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  </div></div>;
}