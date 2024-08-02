import React, { useState, useEffect, setState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, setDoc } from "firebase/firestore";
import { db, uploadFile, deleteFile } from "../firebaseConfig/firebase";
import { getStorage, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import uniqid from 'uniqid';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import {v4} from "uuid";
import byteSize from 'byte-size';
import {disableAllInputs} from "../components/gFunctions";

const Create = ({userData}) => {
  const userDecode = JSON.parse(userData);
  //const momento = moment().format();
  //console.log(moment(momento).format('MMMM Do YYYY, h:mm:ss a'));

    //datos a guardar
    const [userID, setUserID] = useState('');
    //const [artistName, setArtistName] = useState('');
    const [songName, setSongName] = useState('');
    const [jobName, setJobName] = useState('mixingandmastering');
    const [songURL, setSongURL] = useState(null);

    const [songStatus, setSongStatus] = useState("inprogress");
    const [songActualVersion, setSongActualVersion] = useState(1);
    const [songRevisionLimit, setSongRevisionLimit] = useState(3);

    const [goToSongID, setGoToSongID] = useState(null);
    //UPLOAD FILE
    const [file, setFile] = useState(null);
    const [songFileSize, setSongFileSize] = useState(null);
    const actualDate = new Date();
    const generate = () => {

        var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
        function populate(a) {
          for ( var i = 0; i < 6; i++ ) {
            var x = Math.round( Math.random() * 14 );
            var y = hexValues[x];
            a += y;
          }
          return a;
        }
        var newColor1 = populate('#');
        var newColor2 = populate('#');
        var angle = Math.round( Math.random() * 360 );
        var gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
        return gradient;   
      }

    const addToDB = async (movie) => {
        //Add database (Uniqid para crear nuevo o a�adir id existente para modificar)
        //await setDoc(doc(db, "songs", uniqid()), toSave);
    }

    //document.querySelector(".btnUploadSong").disabled = true;
    const sendFile = async (e) => {
      try{
        //Disable inputs
        disableAllInputs(true);
        document.getElementById("formNewSong").style.display = "none";
        document.querySelector(".stepsToShow").style.display = "block";
        //-------------------------------------------------------------
        //Start uploading..
        console.log("Uploading song file...");
        document.querySelector(".step1").classList.add("step-success");
        const fileName = v4();
        const result = await uploadFile(file, fileName);
        console.log(result);
        //document.querySelector(".songUrlInput").value = result;
        //setSongURL(result);
        //alert(document.querySelector(".songUrlInput").value);
        console.log("Song file uploaded!!!");
        document.querySelector(".step2").classList.add("step-success");
        
        console.log("Uploading song data...");
        document.querySelector(".step3").classList.add("step-success");
        const songID = uniqid();
        const toSave = {
          addedByID: userDecode.userID,
          lastVersion: songActualVersion,
          songID: songID,
          job:jobName,
          userID: userID,
          songName: songName,
          songUrl: result,
          fileSize: songFileSize,
          fileName: fileName,
          songDate: moment().format(),
          updateDate: "",
          notes: "",
          status: songStatus,
          revisions: 0,
          revisionsLimit: songRevisionLimit,
          songPic: generate()
      }
        await setDoc(doc(db, "songs", songID), toSave);
        document.querySelector(".step4").classList.add("step-success");
        console.log("Song totally uploaded!!!");
        document.querySelector(".btnBackToAddNewSong").disabled = false;
        document.querySelector(".btnGoToSong").disabled = false;
        setGoToSongID(songID);
      }catch(error){
        alert("ERROR TO UPLOAD FILE");
      }
    }
    useEffect(() => {
      if(setSongURL == null){
        setSongURL("");
      }
    });
    const sendForm = function (e) {
        e.preventDefault();    
        createPromise();
    }
    const createPromise = () => {
      toast.promise(
        sendFile(),
           {
             loading: 'Creating new song...',
             success: <b>New song created!</b>,
             error: <b>Could not create a new song.</b>,
           }
         );
    }
    const backToAddNewSong = () =>{
      document.getElementById("formNewSong").style.display = "block";
      document.querySelector(".stepsToShow").style.display = "none";
      document.querySelector(".step1").classList.remove("step-success");
      document.querySelector(".step2").classList.remove("step-success");
      document.querySelector(".step3").classList.remove("step-success");
      document.querySelector(".step4").classList.remove("step-success");
      disableAllInputs(false);
    }
    const goToNewSong = () => {
      window.location.href = "/song/" + goToSongID;
    }
    const fileChangeFunctions = (fileName, fileSize) =>{
      setFile(fileName);
      setSongFileSize(fileSize);
      console.log(byteSize(fileSize).value + " " + byteSize(fileSize).unit);
    }
    return (<div>
<dialog id="my_modal_2" className="modal">
  <div className="modal-box w-11/12 max-w-5xl text-center">
  <h3 className="font-bold text-lg">Upload a new song!</h3>
  <p className="py-4">Fill the fields of your client.</p>
    <div className="card bg-base-100 rounded-none mb-10">

  <div className="w-full content-center justify-center justify-items-center items-center text-center stepsToShow hidden">
    <ul className="steps mt-5 w-full">
        <li className="step step1">Uploading song</li>
        <li className="step step2">Song uploaded!</li>
        <li className="step step3">Uploading song data</li>
        <li className="step step4">Finished!</li>
      </ul>
      <button type="button" className="btn btn-neutral mt-10 btnGoToSong mr-5" onClick={goToNewSong}>Go to song</button>
      <button type="button" className="btn mt-10 btnBackToAddNewSong" onClick={backToAddNewSong}>Back</button>
  </div>

  <div className="card-body content-center justify-center justify-items-center items-center text-center w-full newSongBody">
    <form onSubmit={sendForm} id="formNewSong" className="w-full">
            <input type="text" className="input input-bordered w-full mt-5 inputUserID" required placeholder="User ID" value={userID} onChange={(e) => setUserID(e.target.value)} /><br></br>
            <input type="text" className="input input-bordered w-full mt-5 inputSongName" required placeholder="Song name" value={songName} onChange={(e) => setSongName(e.target.value)} /><br></br>
            <select className="select select-bordered w-full mt-5 inputJob" required value={jobName} onChange={(e) => setJobName(e.target.value)}>
                <option value="mixingandmastering" selected>Mixing & Mastering</option>
                <option value="mastering">Mastering</option>
                <option value="mixing">Mixing</option>
                <option value="production">Production</option>
                <option value="custom">Custom</option>
            </select>
            <p className="mt-5">Revisions limit</p>
            <input type="number" className="input input-bordered w-full mt-5 inputUserID" required placeholder="Revisions limit" value={songRevisionLimit} onChange={(e) => setSongRevisionLimit(e.target.value)} /><br></br>
            <p className="mt-5">Actual version</p>
            <input type="number" className="input input-bordered w-full mt-5 inputUserID" required placeholder="Actual version" value={songActualVersion} onChange={(e) => setSongActualVersion(e.target.value)} /><br></br>
            <p className="mt-5">Current status</p>
            <select className="select select-bordered w-full mt-5 inputJob" required value={songStatus} onChange={(e) => setSongStatus(e.target.value)}>
                <option value="inprogress" selected>In progress</option>
                <option value="completed">Completed</option>
                <option value="inrevision">In revision</option>
                <option value="instandby">In stand by</option>
                <option value="canceled">Canceled</option>
            </select>
            <p className="mt-5">Select the song .wav file</p>
            <input type="file" className="file-input file-input-bordered file-input-md w-full mt-5 inputSongFile" required onChange={(e) => {fileChangeFunctions(e.target.files[0], e.target.files[0].size)}}/><br></br>
    <div className="card-actions justify-end">
    <button type="submit" className="btn btn-neutral mt-5 btnUploadSong">Upload</button>
    <button className="btn mt-5" onClick={() => {document.getElementById('my_modal_2').close()}}>Close</button>
    </div>
    </form>
  </div>
</div>
  </div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>


<div
  className="hero min-h-80"
  style={{
    backgroundImage: "url(https://mixwiththemasters.com/media/cache/video_cover/video-parts/2024-06-te-ws-11-th-0-07c6304784438a360000185c6424050171e7eb76.png.webp)",
  }}>
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Create Song</h1>
      <p className="mb-5">
        Click here to start uploading your clients music.
      </p>
      <button className="btn btn-neutral" onClick={()=>document.getElementById('my_modal_2').showModal()}>Create</button>
    </div>
  </div>
</div>

    </div>);
    
}

export default Create;