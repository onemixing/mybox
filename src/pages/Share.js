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
import moment from 'moment';
import ReactPlayer from 'react-player'

export const Share = function(){
    //const userDecode = JSON.parse(userData);
    const params = useParams();
    const getSongID = params.id;

    const [issetSong, setIssetSong] = useState(3);
    const [userSongData, setUserSongData] = useState();
    const [userData, setUserData] = useState();

    const onButtonClick = (songLink) => {
        const pdfUrl = songLink;
        console.log(pdfUrl)
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "test"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("Downloaded");
    }

    //GET USER DATA FROM DB
    const getUserDataFromDB = async () =>{
        if(userSongData != null){
            const userRef = collection(db,'user');
            const foundSongData = JSON.parse(userSongData);
            const qUser = query(userRef, where("userID", "==", foundSongData.userID));
            await getDocs(qUser).then((snapshot) => {
              snapshot.docs.forEach((res)=> {
                  setUserData(JSON.stringify(res.data()));
                  console.log(JSON.stringify(res.data()));
                  //return JSON.stringify(res.data());
              });
            })
        }else{

        }

    }
    //GET SONG FROM DB
    const getSongFromDB = async () => {
        if(getSongID != ""){
          const colRef = collection(db,'songs');
          //Queries
          const q = query(colRef, where("songID", "==", getSongID));
          //RealTime collection Data
          await getDocs(q).then((snapshot) => {
              const userExist = snapshot.docs.length;
              if(userExist != 0){
                  //Existe el usuario
                  setIssetSong(1);
                  //alert("The user exists");
                  snapshot.docs.forEach((res)=> {
                      //console.log(res.data());
                      //alert("existe el usuario");
                      const foundDataToJSON = JSON.stringify(res.data());
                      setUserSongData(foundDataToJSON);
                      getUserDataFromDB();
                  });
              }else{
                  setIssetSong(0);
              }
          });
        }
    }


    useEffect(()=>{
        getSongFromDB();
        //alert(orderValidate);
    },[issetSong])


    if(issetSong == 3){
        return (<div><Loading/></div>)
    }else if(issetSong == 1){
        
        const foundSongData = JSON.parse(userSongData);
        if(userData != null){
            const foundUserData = JSON.parse(userData);
            var userArtistName = foundUserData.artistName;
        }else{
            var userArtistName = "Loading...";
        }
        
        var formattedDate = moment.unix(foundSongData.songDate).format('MMMM Do YYYY, h:mm a');

        var stringJob = "";
        if(foundSongData.job == "mixingandmastering"){
            stringJob = "Mixing and Mastering";
        }else{
            stringJob = foundSongData.job.charAt(0).toUpperCase() + foundSongData.job.slice(1);
        }
        return <div>
        <div className="hero bg-base-200 min-h-screen p-10">
        <div className="hero-content w-full flex-col lg:flex-row items-start">
            <div className="card bg-base-100 w-96 shadow-xl p-8">
            <div className="rounded-lg shadow-2xl w-full h-60" style={{background: foundSongData.songPic}}></div>
            <div className="card-body p-0 mt-8">
                <h2 className="card-title">{foundSongData.songName}</h2>
                <p>{userArtistName}</p>
                <div className="card-actions justify-end mt-10">
                <audio src={foundSongData.songUrl} controls preload="none" className="w-full"></audio>
                </div>
                
            </div>
            </div>
        </div>
        </div> 

        </div>;
    }else if(issetSong == 0){
        return (<div><NotFound/></div>)
    }

}