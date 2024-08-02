import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useParams, json} from "react-router-dom";
import UserShow from "../components/UserShow";
import {UserHeader} from "../components/UserHeader";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, deleteField, updateDoc } from "firebase/firestore";
import { db, uploadFile, deleteFile } from "../firebaseConfig/firebase";
import { async } from "@firebase/util";
import { getDatabase, ref, child, get, onValue, set} from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import {NotFound} from "../pages/NotFound";
import {disableAllInputs} from "../components/gFunctions";
import {Loading} from "../components/Loading";
import moment from 'moment';
import ReactPlayer from 'react-player';
import useDownloader from 'react-use-downloader';
import byteSize from 'byte-size';
import {v4} from "uuid";

export const Update = function({userData}){

    const { size, elapsed, percentage, download, cancel, error, isInProgress } =
    useDownloader();
    const userDecode = JSON.parse(userData);
    const params = useParams();
    const getSongID = params.id;
    
    const [issetSong, setIssetSong] = useState(3);
    //To Edit
    const [songName, setSongName] = useState();
    const [jobName, setJobName] = useState();
    const [userSongData, setUserSongData] = useState();
    const [songFromUser, setSongFromUser] = useState();
    const [songStatus, setSongStatus] = useState();
    const [songLastVersion, setSongLastVersion] = useState();
    const [songRevisions, setSongRevisions] = useState();
    const [songRevisionsLimit, setSongRevisionsLimit] = useState();
    const [songPicURL, setSongPicURL] = useState();
    const [songNotes, setSongNotes] = useState();
    //UPLOAD FILE
    const [file, setFile] = useState(null);
    const [songFileSize, setSongFileSize] = useState(null);
    const [dbFileName, setDbFileName] = useState();
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
          const q = query(colRef, where("songID", "==", getSongID));
          const querySnapshot = await getDocs(q);
          const userExist = querySnapshot.docs.length;
          if(userExist != 0){
            setIssetSong(1);
            for (var i=0; i < querySnapshot.docs.length; i++) {
                  setUserSongData(JSON.stringify(querySnapshot.docs[i].data()));
                  setSongName(querySnapshot.docs[i].data().songName);
                  setSongStatus(querySnapshot.docs[i].data().status);
                  setSongLastVersion(querySnapshot.docs[i].data().lastVersion);
                  setSongRevisions(querySnapshot.docs[i].data().revisions);
                  setSongRevisionsLimit(querySnapshot.docs[i].data().revisionsLimit);
                  setSongPicURL(querySnapshot.docs[i].data().songPic);
                  setSongNotes(querySnapshot.docs[i].data().notes);
                  setJobName(querySnapshot.docs[i].data().job);
                  setDbFileName(querySnapshot.docs[i].data().fileName);
                  console.log(querySnapshot.docs[i].data());
            }
          }else{
            setIssetSong(0);
            }
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
        const fileChangeFunctions = (fileName, fileSize) =>{
            setFile(fileName);
            setSongFileSize(fileSize);
            console.log(byteSize(fileSize).value + " " + byteSize(fileSize).unit);
        }

        const updateSong = async () =>{
            //Update Song Data
            try{
                disableAllInputs(true);
                const songRef = doc(db, 'songs', getSongID);
                await updateDoc(songRef, {
                    songName: songName,
                    job: jobName,
                    lastVersion: parseInt(songLastVersion),
                    revisions: parseInt(songRevisions),
                    revisionsLimit: parseInt(songRevisionsLimit),
                    status: songStatus,
                    notes: songNotes,
                    updateDate: moment().format()
                });
                //Upload file
                if(file != null){
                    const fileToDelete = "songs/" + dbFileName;
                    deleteFile(fileToDelete);
                    const fileName = v4();
                    const result = await uploadFile(file, fileName);
                    await updateDoc(songRef, {
                        fileSize: songFileSize,
                        fileName: fileName,
                        songUrl: result
                    });
                }
                disableAllInputs(false);
            }catch{
                disableAllInputs(false);
            }

            //Update Song File
        }
        const updatePromise = () => {
            toast.promise(
                updateSong(),
                 {
                   loading: 'Updating...',
                   success: <b>Settings saved!</b>,
                   error: <b>Could not update.</b>,
                 }
               );
        }
        
        return <div>
        <div className="hero bg-base-200 h-auto p-10">
        <div className="hero-content w-full flex-col lg:flex-row items-start">
            <div className="max-w-sm rounded-lg shadow-2xl w-60 h-60" style={{background: foundSongData.songPic}}></div>
            <div className="w-auto">
            <span>Song title</span><br></br>
            <input type="text" className="input input-bordered w-full mb-5" required placeholder="Song name" value={songName} onChange={(e) => setSongName(e.target.value)} />
            {/*}<span>Pic URL</span><br></br>
            <input type="text" className="input input-bordered input-sm w-full mb-5" required placeholder="Pic URL" value={songPicURL} onChange={(e) => setSongPicURL(e.target.value)} /><br></br>{*/}
                <span>Service</span><br></br>
                <select className="select select-bordered select-sm w-full inputJob mb-5" required value={jobName} onChange={(e) => setJobName(e.target.value)}>
                    <option value="mixingandmastering">Mixing & Mastering</option>
                    <option value="mastering">Mastering</option>
                    <option value="mixing">Mixing</option>
                    <option value="production">Production</option>
                    <option value="custom">Custom</option>
                </select>
                <span>Start date <div className="badge badge-neutral">{formattedDate}</div></span>
            {/*}<button className="btn btn-neutral mt-5">Add version</button>
            <button className="btn btn-neutral mt-5">Download</button>{*/}<br></br>
            <Link to={'../song/' + getSongID}><button className="btn btn-neutral mt-5">Back to the song</button></Link>
        </div>
        </div>
        </div> 


        <div className="container mx-auto mt-10">
        <span>New Audio version</span><br></br>
        <input type="file" className="file-input file-input-bordered file-input-md w-full mt-5 inputSongFile" required onChange={(e) => {fileChangeFunctions(e.target.files[0], e.target.files[0].size)}}/><br></br>
        </div>
        <div className="container mx-auto mt-10">
            <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
                <div className="card bg-base-100 w-full shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Last version</h2>
                    <input type="number" className="input input-bordered w-full" required placeholder="Last version" value={songLastVersion} onChange={(e) => setSongLastVersion(e.target.value)} />
                    <div className="badge badge-neutral">Last update: {formattedUpdatedDate}</div>
                </div>
                </div>
            </div>
            <div>
                <div className="card bg-base-100 w-full  shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Revisions</h2>
                    <input type="number" className="input input-bordered w-full" required placeholder="Revisions" value={songRevisions} onChange={(e) => setSongRevisions(e.target.value)} />
                    <h2 className="card-title">Limit</h2>
                    <input type="number" className="input input-bordered w-full" required placeholder="Revisions Limit" value={songRevisionsLimit} onChange={(e) => setSongRevisionsLimit(e.target.value)} />
                    <div className="badge badge-neutral">Last update: {formattedUpdatedDate}</div>
                </div>
                </div>
            </div>
            <div>
                <div className="card bg-base-100 w-full  shadow-xl overflow-y-scroll">
                <div className="card-body">
                    <h2 className="card-title">References / notes</h2>
                    <textarea className="textarea textarea-bordered h-80" defaultValue={songNotes} onChange={(e) => setSongNotes(e.target.value)} placeholder="Write something here">
                    </textarea>
                    
                    <div className="card-actions justify-end">
                    </div>
                </div>
                </div>
            </div>
            <div>
                <div className="card bg-base-100 w-full  shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Status</h2>
                    <select className="select select-bordered w-full mt-5 inputJob" required value={songStatus} onChange={(e) => setSongStatus(e.target.value)}>
                        <option value="inprogress">In progress</option>
                        <option value="completed">Completed</option>
                        <option value="inrevision">In revision</option>
                        <option value="instandby">In stand by</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                </div>
            </div>
            </div>

            <button className="btn w-full mt-10 mb-10 btnUpdateSong" onClick={() => {updatePromise()}}>Update</button>
        </div>

        </div>;
    }else if(issetSong == 0){
        return (<div><NotFound/></div>)
    }

}