import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate} from "react-router-dom";
import Cookies from 'universal-cookie';

export const Logout = function(){
    const cookies = new Cookies();

    const logout = async () =>{
        cookies.remove("user");
    }
    const reloadPage = async () =>{
        window.location.href = "/";
        //window.location.reload();
    }
    const init = async () =>{
        if(cookies.get("user") != null){
            await logout();
        }
        await reloadPage();
    }
    init();
      
}