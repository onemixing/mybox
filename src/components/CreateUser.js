import React, { useState, useEffect, setState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import uniqid from 'uniqid';
import Swal from 'sweetalert2'
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import {disableAllInputs} from "../components/gFunctions";

const CreateUser = ({userData}) => {
  const userDecode = JSON.parse(userData);
    const [data, setData] = useState({});
    const loadUsers = () => {
        //Query Search
        const queryCollection = collection(db, "songs");
        const rowProducts = async () => {
            const refreshWhenNewPost = onSnapshot(collection(db, 'songs'), (snapshot) => {
                setData(snapshot.docs.map(song => ({
                    id: song.id,
                    ...song.data()
                })));
            });
            return console.log("Getting data...")
            return refreshWhenNewPost
        }
    }


    //datos a guardar
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [artistName, setArtistName] = useState('');
    const [roleName, setRoleName] = useState('client');
    const [picURL, setPicURL] = useState('');
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
    const userToken = window.btoa(uniqid());
    const userID = uniqid();
    const toSave = {
        userID: userID,
        user: userName,
        password: userPassword,
        artistName: artistName,
        role: roleName,
        artistPicURL: picURL,
        userJoinDate: moment().format(),
        averageColor: generate(),
        token: userToken,
        addedByID: userDecode.userID,
        bytesLimit: 0
    }
    const addToDB = async (movie) => {
        //Add database (Uniqid para crear nuevo o a�adir id existente para modificar)
        try{
          disableAllInputs(true);
          await setDoc(doc(db, "user", userID), toSave);
          document.getElementById('my_modal_3').close();
          disableAllInputs(false);
        }catch{
          disableAllInputs(false);
        }
        
    }
    const createPromise = () => {
      toast.promise(
        addToDB(),
           {
             loading: 'Creating...',
             success: <b>Created!</b>,
             error: <b>Could not create a new user.</b>,
           }
         );
    }
    const sendForm = function (e) {
        e.preventDefault();
        createPromise();
    }
    return (<div>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <div className="card bg-base-100 rounded-none mb-10">
  <figure>
    <img
      src="https://mixwiththemasters.com/media/cache/resolve/video_squared_medium/videos/TH%208.png"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">Create a new user!</h2>
    <p>Fill the fields of the new member.</p>
    <form onSubmit={sendForm} id="formNewUser">
            <input type="text" className="input input-bordered w-full max-w-xs mt-5 inpt_username" required placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} /><br></br>
            <input type="text" className="input input-bordered w-full max-w-xs mt-5 inpt_password" required placeholder="User Password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} /><br></br>
            <input type="text" className="input input-bordered w-full max-w-xs mt-5 inpt_artistName" required placeholder="Artist Name" value={artistName} onChange={(e) => setArtistName(e.target.value)} /><br></br>
            <input type="text" className="input input-bordered w-full max-w-xs mt-5 inpt_picUrl" required placeholder="Pic URL" value={picURL} onChange={(e) => setPicURL(e.target.value)} /><br></br>
            <select className="select select-bordered w-full max-w-xs mt-5 inpt_role" required defaultValue="client" value={roleName} onChange={(e) => setRoleName(e.target.value)}>
                <option value="client" selected>Client</option>
                <option value="admin">Admin</option>
            </select><br></br>
    <div className="card-actions justify-end">
    <button type="submit" className="btn btn-neutral mt-5 inpt_create">Create</button>
    <button type="button" className="btn mt-5" onClick={() => {document.getElementById('my_modal_3').close()}}>Close</button>
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
    backgroundImage: "url(https://mixwiththemasters.com/build/images/events/weeklong.11d3eb36.jpg)",
  }}>
  <div className="hero-overlay bg-opacity-60"></div>
  <div className="hero-content text-neutral-content text-center">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold">Create User</h1>
      <p className="mb-5">
        Click here to start uploading your clients music.
      </p>
      <button className="btn btn-neutral" onClick={()=>document.getElementById('my_modal_3').showModal()}>Create</button>
    </div>
  </div>
</div>

    </div>);
}

export default CreateUser;