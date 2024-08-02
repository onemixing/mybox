import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useParams} from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual } from "firebase/firestore";
import { db } from "./firebaseConfig/firebase";
import { async } from "@firebase/util";
import { getDatabase, ref, child, get, onValue} from "firebase/database";
import React, { useState, useEffect, act } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import {Home} from "./pages/Home";
import {Login} from "./pages/Login";
import {Logout} from "./pages/Logout";
import {NotFound} from "./pages/NotFound";
import {Loading} from "./components/Loading";
import {Admin} from "./pages/Admin";
import {Profile} from "./pages/Profile";
import {Settings} from "./pages/Settings";
import {Song} from "./pages/Song";
import {Update} from "./pages/Update";
import {Share} from "./pages/Share";
import Cookies from 'universal-cookie';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [userToken, setUserToken] = useState(0);

  const cookies = new Cookies();
  const[user, setUser] = useState(null);
    //DARKMODE
    const [isdark, setIsdark] = useState(
      JSON.parse(localStorage.getItem('isdark'))
    );
    const [darkTheme, setDarkTheme] = useState("dark");
    const darkSlider = () =>{
      setIsdark(!isdark);
    }
    const checkForDark = () =>{
      if(isdark == true){
        document.documentElement.setAttribute('data-theme', darkTheme);
      }else{
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
    const actualUserToken = cookies.get("user");
    //Search User
    const [issetUser, setIssetUser] = useState(3);
    const [userProfileData, setUserProfileData] = useState();
    if(actualUserToken != null){
      
    }
    const getUserFromDB = async () => {
        if(actualUserToken != null){
          const colRef = collection(db,'user');
          //Queries
          const q = query(colRef, where("token", "==", actualUserToken));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            const userExist = doc.data().length;
            if(userExist != 0){
                //Existe el usuario
                setIssetUser(1);
                //alert("The user exists");
                setUserToken(doc.data().token);
                setUserProfileData(JSON.stringify(doc.data()));
            }else{
                setIssetUser(0);
            }

          });
        }
        console.log("SEARCHING FOR USER");
      }
    useEffect(()=>{
        getUserFromDB();
        //alert(orderValidate);
    },[issetUser]);
    useEffect(() => {
      localStorage.setItem('isdark', JSON.stringify(isdark));
      checkForDark();
    }, [isdark])

      //CHECK FOR THE USER COOKIE
  if (cookies.get("user") == null){
    console.log("NO HAY COOKIE DE USUARIO");
    return (
      <div>
    <Router>
        <Routes>
            <Route path="*" element={<NotFound/>}></Route>
            <Route path="/" exact element={<Login/>}/>
            <Route path="/share/:id" element={<Share/>}/>
        </Routes>
        <Toaster/>
    </Router>
      </div>
  );
  }else{
    if (issetUser == 3){
      return (<div><Loading/></div>)
  }else if(issetUser == 1){
    console.log(userToken);
    return (
      <div>
    <Router>
        <Header userData={userProfileData}></Header>
        <Routes>
            <Route path="*" element={<NotFound/>}></Route>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/song/:id" element={<Song userData={userProfileData}/>}/>
            <Route path="/update/:id" element={<Update userData={userProfileData}/>}/>
            <Route path="/share/:id" element={<Share userData={userProfileData}/>}/>
            <Route path="/profile/:username" element={<Profile userData={userProfileData}/>}/>
            <Route path="/settings" element={<Settings darkTheme={darkTheme} darkCheck={darkSlider} actualDarkValue={isdark} userData={userProfileData}/>}/>
            <Route path="/admin" element={<Admin userData={userProfileData}/>}/>
            <Route path="/" element={<Home userData={userProfileData}/>}/>
            {/*}<Route path="/" exact element={<Home/>}/>{*/}
        </Routes>
        <Toaster/>
    </Router>
      </div>
  );
  }else if(issetUser == 0){
      console.log("The user doesn't exists");
      return (<div><h1>NOT FOUND</h1></div>)
  }
  }
  //console.log(cookies.get("user"));
    









}

export default App;
