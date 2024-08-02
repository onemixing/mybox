import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import {disableAllInputs} from "../components/gFunctions";

const SearchUsers = function ({userData}) {
    const userDecode = JSON.parse(userData);
    //uses
    const [data, setData] = useState({});
    const [totalUsers, setTotalUsers] = useState();

    const searchUsers = async () => {
        try{
          disableAllInputs(true);
          const colRef = collection(db,'user');
          const q = query(colRef, where("addedByID", "==", userDecode.userID));
          const querySnapshot = await getDocs(q);
          setTotalUsers(querySnapshot.docs.length);
          setData(querySnapshot.docs.map(user => ({
            id: user.id,
            ...user.data()
           })));
           console.log("Users Loaded");
           disableAllInputs(false);
        }catch{
          alert("ERROR LOADING USERS");
          disableAllInputs(false);
        }
    }

    useEffect(() => {
        
    },[])

    return (
        
    <div>
    <dialog id="my_modal_4" className="modal" style={{ zIndex: '-20 !important' }}>
        <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">All users</h3>
        <p className="py-4">Manage your users</p>
        <button onClick={searchUsers} className="btn btn-neutral mb-10 btnLoadUsers">Load Users</button>
        <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Name</th>
        <th>ID</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
            {Array.from(data).map((item, index) => {
                const copyIDtoClipboard = () => {
                    navigator.clipboard.writeText(item.userID);
                    toast.success('Copied!');
                }
              
                return <tr key={index}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12" style={{backgroundImage: `url(${item.artistPicURL})`, backgroundSize: 'cover'}}>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold"><Link to={"/profile/" + item.user}>{item.artistName}</Link></div>
                      <div className="text-sm opacity-50"><Link to={"/profile/" + item.user}>{item.user}</Link></div>
                    </div>
                  </div>
                </td>
                <th>
                  <button className="btn btn-ghost btn-xs" onClick={copyIDtoClipboard}>Copy ID</button>
                </th>
                <th>
                  <button className="btn btn-ghost btn-xs">Options</button>
                </th>
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
        backgroundImage: "url(https://mixwiththemasters.com/media/cache/resolve/video_cover/video-parts/I%20ITT%2061%20-%20TH%20TRAILER_3.png)",
    }}>
    <div className="hero-overlay bg-opacity-60"></div>
    <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
        <h1 className="mb-5 text-5xl font-bold">Search Users</h1>
        <p className="mb-5">
            Click here to start uploading your clients music.
        </p>
        <button className="btn btn-neutral" onClick={()=>document.getElementById('my_modal_4').showModal()}>Search</button>
        </div>
    </div>
    </div> 
    </div>)
    
}
export default SearchUsers;