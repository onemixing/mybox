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


const PanelStats = ({userData}) => {
    const percent = require('percent');
    const userDecode = JSON.parse(userData);

    const [panelSongs, setPanelSongs] = useState();
    const [panelUsers, setPanelUsers] = useState();
    const [panelBytesInUse, setPanelBytesInUse] = useState();
    const [panelAdmin, setPanelAdmin] = useState();
    const [panelBytesLimit, setPanelBytesLimit] = useState();
    const [percentage, setPercentage]=useState(); 

    const getPanelStatsData = async () =>{
        console.log("Getting panel stats...");
        //ACTUAL ADMIN
        const adminRef = collection(db,'user');
        const qAdmin = query(adminRef, where("userID", "==", userDecode.userID));
        const querySnapshotAdmin = await getDocs(qAdmin);
        setPanelAdmin(querySnapshotAdmin.docs[0].data());
        setPanelBytesLimit(querySnapshotAdmin.docs[0].data().bytesLimit);
        //USERS
        const usersRef = collection(db,'user');
        const qUsers = query(usersRef, where("addedByID", "==", userDecode.userID));
        const querySnapshotUser = await getDocs(qUsers);
        setPanelUsers(querySnapshotUser.docs.length)
        //SONGS
        const colRef = collection(db,'songs');
        const q = query(colRef, where("addedByID", "==", userDecode.userID));
        const querySnapshot = await getDocs(q);
        setPanelSongs(querySnapshot.docs.length)
        //CLOUD
        var actualSize = 0;
        for (var i=0; i < querySnapshot.docs.length; i++) {
            actualSize += querySnapshot.docs[i].data().fileSize;
        } 
        setPanelBytesInUse(actualSize);
        console.log("Showing panel stats");
    }
    useEffect(()=>{
        getPanelStatsData();
        //alert(orderValidate);
    }, []);

    return <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
    <div className="stat">
      <div className="stat-title">Clients</div>
      <div className="stat-value">{panelUsers}</div>
    </div>

    <div className="stat">
      <div className="stat-title">Songs</div>
      <div className="stat-value">{panelSongs}</div>
    </div>

    <div className="stat">
      <div className="stat-title">Cloud</div>
      <div className="stat-value">{percent.calc(panelBytesInUse, panelBytesLimit, 0)}%</div>
      <div className="stat-desc">{byteSize(panelBytesInUse).value + " " + byteSize(panelBytesInUse).unit} / {byteSize(panelBytesLimit).value + " " + byteSize(panelBytesLimit).unit}</div>
    </div>
  </div>;
}
export default PanelStats;