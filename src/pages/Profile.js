import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useParams, json} from "react-router-dom";
import UserShow from "../components/UserShow";
import {UserHeader} from "../components/UserHeader";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util";
import { getDatabase, ref, child, get, onValue} from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import {NotFound} from "../pages/NotFound";
import {Loading} from "../components/Loading";
import {UserProfileAdminTools} from "../components/UserProfileAdminTools";
import byteSize from 'byte-size';

export const Profile = function({userData}){
    const params = useParams();
    const getUsername = params.username;
    const userDecode = JSON.parse(userData);
    
    const [issetUser, setIssetUser] = useState(3);
    const [userProfileData, setUserProfileData] = useState();

    const getUserFromDB = async () => {
            if(getUsername != ""){
              const colRef = collection(db,'user');
              const q = query(colRef, where("user", "==", getUsername));
              const querySnapshot = await getDocs(q);
              console.log(querySnapshot.docs.length);
              const userExist = querySnapshot.docs.length;
              if(userExist != 0){
                  //Existe el usuario
                  setIssetUser(1);
                  //alert("The user exists");
                  setUserProfileData(JSON.stringify(querySnapshot.docs[0].data()));
              }else{
                  setIssetUser(0);
              }
            }
    }
    useEffect(()=>{
        getUserFromDB();
        //alert(orderValidate);
    },[issetUser])
    
    
    if(issetUser == 3){
        return (<div><Loading/></div>)
    }else if(issetUser == 1){
        const foundUserData = JSON.parse(userProfileData);
        if(getUsername == userDecode.user && userDecode.role == "client"){
            return <div>
                <UserHeader userData={userProfileData}/>
                <UserShow userData={userProfileData}/>
            </div>;
        }else if(userDecode.role == "admin"){
            return <div>
                <UserHeader userData={userProfileData}/>
                <UserProfileAdminTools userData={userProfileData}/>
                <UserShow userData={userProfileData}/>
            </div>;
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
    }else if(issetUser == 0){
        //console.log("The user doesn't exists");
        return (<div><NotFound/></div>)
    }



}