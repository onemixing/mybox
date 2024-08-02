import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useParams} from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';
import byteSize from 'byte-size';

const UserShow = function ({userData}) {

    const userDecode = JSON.parse(userData);
    //console.log(userDecode);
    //uses
    const [data, setData] = useState({});
    const [issetSongs, setIssetSongs] = useState(3);
    //Query Search
    const queryCollection = collection(db, "songs");
    const rowProducts = async () => {
        const colRef = collection(db,'songs');
        //Queries
        const q = query(colRef, where("userID", "==", userDecode.userID));
        //RealTime collection Data
        await getDocs(q).then((snapshot) => {
            const userExist = snapshot.docs.length;
            if(userExist != 0){
                //Existe el usuario
                setIssetSongs(1);
                //alert("The user exists");
                /*
                snapshot.docs.forEach((res)=> {
                    //console.log(res.data());
                    //setUserToken(res.data().token);
                    setData(res.data());
                });*/
                setData(snapshot.docs.map(song => ({
                    id: song.id,
                    ...song.data()
                })));
            }else{
                setIssetSongs(0);
            }

        });
    }

    //UseEffect (When pages load)
    useEffect(() => {
        rowProducts();
    },[])
    //console.log(data);
    //Row items
    //console.log(data.length);
    if(data.length != null){
      
      return (<div className="overflow-x-auto container mx-auto">
        <button onClick={rowProducts} className="btn btn-neutral mb-10">Refresh</button>
          <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>Title</th>
          <th>Service</th>
          <th>Upload date</th>
          <th>Cloud</th>
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
                        <div className="text-sm opacity-50">{item.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                  <div className="badge badge-neutral">Mixing & Mastering</div>
                  </td>
                  <td>{formattedDate}</td>
                  <td><div className="badge badge-neutral"><strong>{byteSize(item.fileSize).value + " " + byteSize(item.fileSize).unit}</strong></div></td>
                </tr>
              })}{  }
          </tbody>
          </table>
      </div>)
    }else{
      return (<div className="overflow-x-auto container mx-auto"><div role="alert" className="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info h-6 w-6 shrink-0">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>You don't have any songs yet.</span>
      </div></div>)
    }

    
}
export default UserShow;