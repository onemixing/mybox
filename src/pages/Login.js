import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useParams} from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util";
import { getDatabase, ref, child, get, onValue} from "firebase/database";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Cookies from 'universal-cookie';
import uniqid from 'uniqid';
import toast, { Toaster } from 'react-hot-toast';

export const Login = function(){

  const cookies = new Cookies();
  const [issetUser, setIssetUser] = useState(3);
  const[userToSearch, setUserToSearch] = useState(null);
  const[userPasswordToSearch, setUserPasswordToSearch] = useState(null);

    
    const getUserFromDB = async () => {
      document.querySelector(".inputUsername").disabled = true;
      document.querySelector(".inputPassword").disabled = true;
      document.querySelector(".btnSendLogin").disabled = true;
      document.querySelector(".loading").style.display = 'block';

      const colRef = collection(db,'user');
      //Queries
      const q = query(colRef, where("user", "==", userToSearch), where("password", "==", userPasswordToSearch));
      //RealTime collection Data
      await getDocs(q).then((snapshot) => {
          const userExist = snapshot.docs.length;
          if(userExist != 0){
              //Existe el usuario
              setIssetUser(1);
              //alert("The user exists");
              snapshot.docs.forEach((res)=> {
                  console.log(res.data());
                  toast.success('Successfully!');
                  const d = new Date();
                  cookies.set("user", res.data().token, {
                    expires: new Date(d.getTime() * 1000)
                  });
                  window.location.reload();
                  //setUserProfileData(JSON.stringify(res.data()));
              });
          }else{
              setIssetUser(0);
              toast.error("This didn't work.")
              document.querySelector(".inputUsername").disabled = false;
              document.querySelector(".inputPassword").disabled = false;
              document.querySelector(".btnSendLogin").disabled = false;
              document.querySelector(".loading").style.display = 'none';
          }
      });
    }
    /*
    useEffect(()=>{
      //getUserFromDB();
      //alert(orderValidate);
    },[userToken])*/
  const sendForm = function (e) {
    e.preventDefault();
    getUserFromDB();
  }



    return <div>
        <div className="hero bg-gradient-to-r from-base-content to-blue-500 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse" >
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl overflow-hidden">

    <div className="bg-neutral w-full flex text-center align-center justify-center p-10">
    <img src="https://firebasestorage.googleapis.com/v0/b/crudapp-62b1c.appspot.com/o/assets%2Fimages%2Fmybox-logo.png?alt=media&token=953012d7-a9e4-4b67-9d79-3133bba8e493" width="300" ></img>
    </div>
      <form className="card-body formLogin" onSubmit={sendForm}>
        {/*}
        <div className="text-center lg:text-left">
        <h1 className="text-5xl font-bold">Login</h1>
        <p className="py-6">
          All your music in one place.
        </p>
      </div>
      {*/}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input onChange={(e) => setUserToSearch(e.target.value)} placeholder="Username" required className="input input-bordered inputUsername"/>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input onChange={(e) => setUserPasswordToSearch(e.target.value)} type="password" required placeholder="Password" className="input input-bordered inputPassword"/>
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-neutral btnSendLogin" type="submit">
            Login
            <span className="loading loading-spinner" style={{display: 'none'}}></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    </div>;
}