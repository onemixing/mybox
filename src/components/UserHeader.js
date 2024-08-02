import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import byteSize from 'byte-size';

export const UserHeader = function({userData}){
    const userDecode = JSON.parse(userData);
    return <div>
            <div className="hero bg-base-200 min-h-80 mb-10 p-10">
    <div className="hero-content text-center">
        <div className="max-w-md">
         <div className="avatar">
        <div className="w-48 rounded-full">
            <img src={userDecode.artistPicURL} className="imgToAverage" />
        </div>
        </div>
        <h1 className="text-5xl font-bold">{userDecode.artistName}</h1>
        <p className="py-6">
            @{userDecode.user}
        </p>
        {/*}<button className="btn btn-primary">Get Started</button>{*/}
        </div>
    </div>
    </div>
    </div>;
    
    
}