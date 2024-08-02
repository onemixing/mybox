import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';
import byteSize from 'byte-size';
import {disableAllInputs} from "../components/gFunctions";

const Show = function ({userData}) {
  const userDecode = JSON.parse(userData);
  //uses
  const [data, setData] = useState({});
  const [totalSongs, setTotalSongs] = useState();

  const searchSongs = async () => {
      try{
        disableAllInputs(true);
        const colRef = collection(db,'songs');
        const q = query(colRef, where("addedByID", "==", userDecode.userID));
        const querySnapshot = await getDocs(q);
        setTotalSongs(querySnapshot.docs.length);
        setData(querySnapshot.docs.map(song => ({
          id: song.id,
          ...song.data()
         })));
         console.log("Songs Loaded");
         disableAllInputs(false);
      }catch{
        alert("ERROR LOADING SONGS");
        disableAllInputs(false);
      }
  }

  useEffect(() => {
      
  },[])

    return (<div>
    <dialog id="my_modal_5" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">All songs</h3>
        <p className="py-4">Manage the songs</p>
        <button onClick={searchSongs} className="btn btn-neutral mb-10 btnLoadSongs">Load Songs</button>
        <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Title</th>
        <th>Service</th>
        <th>Upload date</th>
        <th>Size</th>
      </tr>
    </thead>
    <tbody>
            {Array.from(data).map((item, index) => {
               var formattedDate = moment(item.songDate).format('MMMM Do YYYY, h:mm a');
                return <tr key={index}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12" style={{background: item.songPic}}>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold"><Link to={"/song/" + item.songID}>{item.songName}</Link></div>
                    </div>
                  </div>
                </td>
                <td>
                <div className="badge badge-neutral">Mixing & Mastering</div>
                </td>
                <td>{formattedDate}</td>
                <td>{byteSize(item.fileSize).value + " " + byteSize(item.fileSize).unit}</td>
              </tr>
            })}{  }
        </tbody>
        </table>
        </div>
    <form method="dialog" className="modal-backdrop">
        <button>close</button>
    </form>
    </dialog>

        <div
    className="hero min-h-80"
    style={{
        backgroundImage: "url(https://mixwiththemasters.com/media/cache/resolve/video_cover/video-parts/tbk.jpg)",
    }}>
    <div className="hero-overlay bg-opacity-60"></div>
    <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
        <h1 className="mb-5 text-5xl font-bold">Search Songs</h1>
        <p className="mb-5">
            Click here to start uploading your clients music.
        </p>
        <button className="btn btn-neutral" onClick={()=>document.getElementById('my_modal_5').showModal()}>Search</button>
        </div>
    </div>
    </div> 

    </div>)
    
}
export default Show;