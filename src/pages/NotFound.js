import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate} from "react-router-dom";
import UserShow from "../components/UserShow";
import {UserHeader} from "../components/UserHeader";

export const NotFound = function({userData}){
    
    return <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">404 Not Found</h1>
        <p className="py-6">
            Nothing here.
        </p>
        <Link to="/"><button className="btn btn-neutral">Back</button></Link>
      </div>
    </div>
  </div>;
}