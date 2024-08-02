import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, deleteField, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import {disableAllInputs} from "../components/gFunctions";

export const Settings = function({userData, actualDarkValue, darkCheck, darkTheme}){
    
    const userDecode = JSON.parse(userData);
    const [userName, setUserName] = useState(userDecode.user);
    const [userPassword, setUserPassword] = useState(userDecode.password);
    const [userArtistName, setUserArtistName] = useState(userDecode.artistName);
    const [userArtistPic, setUserArtistPic] = useState(userDecode.artistPicURL);

    const updateUser = async (userID) => {
        try{
            document.querySelector(".loading").style.display = 'block';
            disableAllInputs(true);
            const cityRef = doc(db, 'user', userID);
            await updateDoc(cityRef, {
                user: userName,
                password: userPassword,
                artistName: userArtistName,
                artistPicURL: userArtistPic
            });
            //toast.success('Updated!');
            //alert(userName + userArtistName + userID);
            document.querySelector(".loading").style.display = 'none';
            disableAllInputs(false);
            window.location.reload();
        }catch{
            //toast.error("This didn't work.");
            document.querySelector(".loading").style.display = 'none';
            disableAllInputs(false);
        }
    }
    const showPassword = () => {
        var inputUserPassword = document.querySelector('.inputUserPassword');
        if (inputUserPassword.getAttribute("type") === "password") {
            inputUserPassword.setAttribute("type", "text");
          } else {
            inputUserPassword.setAttribute("type", "password");
          }
    }
    const preventForm = (e) =>{
        e.preventDefault();
    }
    const updatePromise = (userID) => {
      toast.promise(
        updateUser(userID),
           {
             loading: 'Updating...',
             success: <b>Settings saved!</b>,
             error: <b>Could not update.</b>,
           }
         );
  }
    console.log("DarkMode: " + actualDarkValue);

    return <div><div className="hero bg-base-200 min-h-screen">
    <div className="hero-content text-center w-full">
      <div className="w-full">
        <h1 className="text-5xl font-bold">Settings</h1>
        <p className="py-6">
          Update all your info
        </p>
        <div className="card-body content-center justify-center justify-items-center items-center text-center w-full newSongBody">
                <form  onSubmit={preventForm} id="formNewSong" className="w-full">
                    <p className="mt-5">Dark mode</p>
                    <input type="checkbox" value={darkTheme} className="toggle theme-controller mt-5" checked={actualDarkValue} onChange={darkCheck} />
                    <label className="input input-bordered flex items-center gap-2 mt-5">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" className="grow inputUserName" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)}/><br></br>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mt-5">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                    </svg>
                    <input type="password" className="grow inputUserPassword" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} required placeholder="Password" /><br></br>
                    </label>
                    <button className="btn btn-neutral showPassword mt-5 w-full" onClick={showPassword}>
                    <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    >
                    <path d="M396 512a112 112 0 10224 0 112 112 0 10-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z" />
                    </svg>
                    </button>
                    <label className="input input-bordered flex items-center gap-2 mt-5">
                    <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                    >
                    <path d="M15.75 8l-3.74-3.75a3.99 3.99 0 016.82-3.08A4 4 0 0115.75 8zm-13.9 7.3l9.2-9.19 2.83 2.83-9.2 9.2-2.82-2.84zm-1.4 2.83l2.11-2.12 1.42 1.42-2.12 2.12-1.42-1.42zM10 15l2-2v7h-2v-5z" />
                    </svg>
                    <input type="text"  className="grow inputArtistName" value={userArtistName} onChange={(e) => setUserArtistName(e.target.value)}required placeholder="Artist name"  /><br></br>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mt-5">
                    <svg
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    >
                    <path d="M6.002 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13zm13 1a.5.5 0 01.5.5v6l-3.775-1.947a.5.5 0 00-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 00-.63.062L1.002 12v.54A.505.505 0 011 12.5v-9a.5.5 0 01.5-.5h13z" />
                    </svg>   
                    <input type="text"  className="grow inputArtistPic" value={userArtistPic} onChange={(e) => setUserArtistPic(e.target.value)}required placeholder="Artist pic URL"  /><br></br>
                    </label>
                <div className="card-actions justify-end">
                <button type="submit" className="btn btn-neutral mt-5 btnUpdateUser" onClick={(e) => {updatePromise(userDecode.userID)}}>Save<span className="loading loading-spinner" style={{display: 'none'}}></span></button>
                </div>
             </form>
        </div>
        <Link to={"/profile/" + userDecode.user}><button className="btn">Back to my profile</button></Link>
      </div>
    </div>
  </div></div>;
}