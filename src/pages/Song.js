import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useParams, json} from "react-router-dom";
import UserShow from "../components/UserShow";
import {UserHeader} from "../components/UserHeader";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, deleteField, updateDoc } from "firebase/firestore";
import { db, uploadFile, deleteFile } from "../firebaseConfig/firebase";
import { async } from "@firebase/util";
import { getDatabase, ref, child, get, onValue} from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import {NotFound} from "../pages/NotFound";
import {Loading} from "../components/Loading";
import moment from 'moment';
import ReactPlayer from 'react-player';
import useDownloader from 'react-use-downloader';
import byteSize from 'byte-size';

export const Song = function({userData}){

    const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
    const userDecode = JSON.parse(userData);
    const params = useParams();
    const getSongID = params.id;
    
    const [issetSong, setIssetSong] = useState(3);
    const [userSongData, setUserSongData] = useState();
    const [songFromUser, setSongFromUser] = useState();

    const deleteSongFromDB = async (songID, fileName) => {
        try{
            document.querySelector(".btnDeleteSong").disabled = true;
            await deleteDoc(doc(db, "songs", songID));
            await deleteFile("songs/" + fileName);
            document.getElementById("my_modal_6").close();
            toast.success('Deleted!');
            window.location.reload();
            document.querySelector(".btnDeleteSong").disabled = false;
        }catch{
            document.querySelector(".btnDeleteSong").disabled = false;
            document.getElementById("my_modal_6").close();
            toast.error('Error deleting a song!');
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
                      setUserSongData(JSON.stringify(res.data()));
                      console.log(res.data());
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
        const fileUrl = foundSongData.songUrl;
        const songVersion = foundSongData.lastVersion;
        const filename =  foundSongData.songName + " v" + songVersion + ".wav";
        const notext = "";
        var formattedDate = moment(foundSongData.songDate).format('MMMM Do YYYY, h:mm a');
        var formattedUpdatedDate = moment(foundSongData.updateDate).format('MMMM Do YYYY, h:mm a');

        var stringJob = "";
        if(foundSongData.job == "mixingandmastering"){
            stringJob = "Mixing and Mastering";
        }else{
            stringJob = foundSongData.job.charAt(0).toUpperCase() + foundSongData.job.slice(1);
        }
        var statusString = "";
        if(foundSongData.status == "inprogress"){
            statusString = "In progress";
        }else if(foundSongData.status == "completed"){
            statusString = "Completed";
        }else if(foundSongData.status == "inrevision"){
            statusString = "In revision";
        }else if(foundSongData.status == "instandby"){
            statusString = "In stand by";
        }else if(foundSongData.status == "canceled"){
            statusString = "Canceled";
        }
        function linkify(text) {
            var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '" target="_blank" class="link link-info">' + url + '</a>';
            });
        }
        const adminButtons = () =>{
            return  (<div><Link to={"/share/" + foundSongData.songID}><button className="btn join-item">Share</button></Link> 
            <Link to={"/update/" + foundSongData.songID}><button className="btn join-item">Update</button></Link></div>);
        }
        return <div>
                    {/* DELETE SONG */}
                    <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete user</h3>
                <p className="py-4">You will delete the song and their files, are you sure?</p>
                <div className="modal-action">
                <button className="btn btn-error btnDeleteSong" onClick={(e) => {deleteSongFromDB(foundSongData.songID, foundSongData.fileName)}}>Delete</button>
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
            </dialog>
        <div className="hero bg-base-200 h-auto p-10">
        <div className="hero-content w-full flex-col lg:flex-row items-start">
            <div className="max-w-sm rounded-lg shadow-2xl w-60 h-60" style={{background: foundSongData.songPic}}></div>
            <div className="w-auto">
            <h1 className="text-5xl font-bold">{foundSongData.songName}</h1>
            <p className="py-6">
                <span>Last version <div className="badge badge-neutral">{foundSongData.lastVersion}.0</div></span><br></br>
                <span>Service <div className="badge badge-neutral">{stringJob}</div></span><br></br>
                <span>Start date <div className="badge badge-neutral">{formattedDate}</div></span><br></br>
                {isInProgress ?  <div className="join mt-10"><button className="btn join-item">{isInProgress ? <progress id="file" className="progress progress-success w-56" value={percentage} max="100" /> : "Download" } {byteSize(size).value} {byteSize(size).unit} </button></div> : 
                            <div className="join mt-10">
                            <button className="btn join-item" onClick={() => download(fileUrl, filename)} disabled={isInProgress ? true : false}>Download</button>
                            <Link to={"/share/" + foundSongData.songID}><button className="btn join-item">Share</button></Link> 
                            {userDecode.role == "admin" ? adminButtons() : ""}</div>
                }
                
            </p>
            {/*}<button className="btn btn-neutral mt-5">Add version</button>
            <button className="btn btn-neutral mt-5">Download</button>{*/}
        </div>
        </div>
        </div> 


        <div className="container mx-auto mt-10">
        <audio src={foundSongData.songUrl} controls preload="none" className="w-full"></audio>
        </div>
        <div className="container mx-auto mt-10">
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
                <div className="card bg-base-100 w-full shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Last version</h2>
                    <strong className="text-lg">{foundSongData.lastVersion}.0</strong>
                    <div className="badge badge-neutral">Last update: {formattedUpdatedDate}</div>
                </div>
                </div>
            </div>
            <div>
                <div className="card bg-base-100 w-full  shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Revisions</h2>
                    <strong className="text-lg">{foundSongData.revisions} / {foundSongData.revisionsLimit} </strong>
                    <div className="badge badge-neutral">Last update: {formattedUpdatedDate}</div>
                </div>
                </div>
            </div>
            <div>
                <div className="card bg-base-100 w-full  shadow-xl overflow-y-scroll">
                <div className="card-body">
                    <h2 className="card-title">References</h2>
                    <p dangerouslySetInnerHTML={{ __html: linkify(foundSongData.notes) }} />
                    <div className="card-actions justify-end">
                    <button className="btn btn-neutral">Add/Modify</button>
                    </div>
                </div>
                </div>
            </div>
            <div>
                <div className="card bg-base-100 w-full  shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Status</h2>
                    <div className="badge badge-neutral">{statusString}</div>
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