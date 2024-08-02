import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate} from "react-router-dom";
import Show from "../components/Show";
import Create from "../components/Create";
import CreateUser from "../components/CreateUser";
import SearchUsers from "../components/SearchUsers";
import PanelStats from "../components/PanelStats";

export const Admin = function({userData}){
    const userDecode = JSON.parse(userData);
    if(userDecode.role == "admin"){
        return <div>
        <PanelStats userData={userData}/>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <CreateUser userData={userData}/>
        <Create userData={userData}/>
        <SearchUsers userData={userData}/>
        <Show userData={userData}/>
    </div></div>;
    }else{
        return <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Denied access.</h1>
            <p className="py-6">
                Nothing here.
            </p>
            <Link to="/"><button className="btn btn-neutral">Back</button></Link>
          </div>
        </div>
      </div>;
    }

}