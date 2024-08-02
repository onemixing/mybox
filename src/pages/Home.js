import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate} from "react-router-dom";

export const Home = function({userData}){
    const userDecode = JSON.parse(userData);
    return <div><div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">MYBOX by onemixing</h1>
        <p className="py-6">
          All your music in one place.
        </p>
        <Link to={"/profile/" + userDecode.user}><button className="btn btn-neutral">Go to my profile</button></Link>
      </div>
    </div>
  </div></div>;
}