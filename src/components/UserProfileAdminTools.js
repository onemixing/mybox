import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, getDoc, deleteDoc, doc, onSnapshot, query, where, snapshotEqual, deleteField, updateDoc } from "firebase/firestore";
import { db, deleteFile } from "../firebaseConfig/firebase";
import { async } from "@firebase/util"
import { getDatabase, ref, child, get } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import byteSize from 'byte-size';
import {disableAllInputs} from "../components/gFunctions";

export const UserProfileAdminTools = function({userData}){
        const userDecode = JSON.parse(userData);

        const deleteUser = async (userID) => {
            try{
                document.querySelector(".loading").style.display = 'block';
                document.querySelector(".loading").disabled = true;
                disableAllInputs(true);
                const colRef = collection(db,'songs');
                const q = query(colRef, where("userID", "==", userDecode.userID));
                const querySnapshot = await getDocs(q);
                if(querySnapshot.docs.length > 0){
                    try{
                        for (var i=0; i < querySnapshot.docs.length; i++) {
                            //console.log(querySnapshot.docs[i].data());
                            //actualSize += querySnapshot.docs[i].data().fileSize;
                            await deleteDoc(doc(db, "songs", querySnapshot.docs[i].data().songID));
                            const fileToDelete = "songs/" + querySnapshot.docs[i].data().fileName;
                            deleteFile(fileToDelete);
                        } 
                        toast.success(querySnapshot.docs.length + ' songs were deleted!');
                    }catch{
                        toast.error('Error deleting user songs');
                    }   
                }
                try{
                    await deleteDoc(doc(db, "user", userID));
                    toast.success('User deleted!');
                    document.querySelector(".loading").style.display = 'none';
                    document.querySelector(".loading").disabled = false;
                    disableAllInputs(false);
                    window.location.reload();
                }catch{
                    toast.error('Error deleting user');
                }

            }catch{
                toast.error("This didn't work.");
                document.querySelector(".loading").style.display = 'none';
                document.querySelector(".loading").disabled = false;
                disableAllInputs(false);
            }
        }
        const [userName, setUserName] = useState(userDecode.user);
        const [userArtistName, setUserArtistName] = useState(userDecode.artistName);
        const [userArtistPic, setUserArtistPic] = useState(userDecode.artistPicURL);

        const updateUser = async (userID) => {
            try{
                disableAllInputs(true);
                const cityRef = doc(db, 'user', userID);
                await updateDoc(cityRef, {
                    user: userName,
                    artistName: userArtistName,
                    artistPicURL: userArtistPic
                });
                toast.success('Updated!');
                //alert(userName + userArtistName + userID);
                disableAllInputs(false);
                window.location.reload();
            }catch{
                toast.error("This didn't work.");
                disableAllInputs(false);
            }
        }
        const preventForm = (e) =>{
            e.preventDefault();
        }
        const [userBytesInUse, setUserBytesInUse] = useState(0);
        const [songsInTotal, setSongInTotal] = useState(0);
        const getBytesOfTheUser = async () => {
            const colRef = collection(db,'songs');
            const q = query(colRef, where("userID", "==", userDecode.userID));
            const querySnapshot = await getDocs(q);
            //console.log(querySnapshot);
            querySnapshot.forEach((doc) => {
                //console.log(doc.data());
                //console.log(doc.data().fileSize);
            });
            var actualSize = 0;
            for (var i=0; i < querySnapshot.docs.length; i++) {
                //console.log(querySnapshot.docs[i].data());
                actualSize += querySnapshot.docs[i].data().fileSize;
            } 
            setUserBytesInUse(actualSize);
            setSongInTotal(querySnapshot.docs.length);
        }
        useEffect(() =>{
            getBytesOfTheUser();
        })
        
        return <div>
            {/* DELETE USER */}
            <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Delete user</h3>
                <p className="py-4">You will detele the user and all of his songs, are you sure?</p>
                <div className="modal-action">
                <button className="btn btn-error" onClick={(e) => {deleteUser(userDecode.userID)}}>Delete</button>
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
            </dialog>
            {/* EDIT USER */}
            <dialog id="my_modal_7" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Update user</h3>
                <p className="py-4">Update your client data</p>


                <div className="card-body content-center justify-center justify-items-center items-center text-center w-full newSongBody">
                    <form  onSubmit={preventForm} id="formNewSong" className="w-full">
                        <p>Username</p>
                        <input type="text" className="input input-bordered w-full mt-5 inputUserName" value={userName} onChange={(e) => setUserName(e.target.value)} required placeholder="Username" /><br></br>
                        <p className="mt-5">Artist name</p>
                        <input type="text"  className="input input-bordered w-full mt-5 inputArtistName" value={userArtistName} onChange={(e) => setUserArtistName(e.target.value)} required placeholder="Artist name"  /><br></br>
                        <p className="mt-5">Profile pic URL</p>
                        <input type="text"  className="input input-bordered w-full mt-5 inputArtistPic" value={userArtistPic} onChange={(e) => setUserArtistPic(e.target.value)} required placeholder="Artist name"  /><br></br>
                    <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-neutral mt-5 btnUpdateUser" onClick={(e) => {updateUser(userDecode.userID)}}>Update</button>
                    </div>
                    </form>
                </div>


                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
            </dialog>
            <div className="container mx-auto mb-10">
            <div className="join w-full justify-center align-center">

            <button className="btn join-item">
            <svg
            viewBox="0 0 920 1000"
            fill="currentColor"
            height="1em"
            width="1em"
            >
            <path d="M460 40c126.667 0 235 45 325 135s135 198.333 135 325-45 235-135 325-198.333 135-325 135-235-45-325-135S0 626.667 0 500s45-235 135-325S333.333 40 460 40m0 610c41.333 0 76.667-14.667 106-44s44-64.667 44-106c0-42.667-14.333-78.333-43-107s-64.333-43-107-43c-41.333 0-76.667 14.667-106 44s-44 64.667-44 106 14.667 76.667 44 106 64.667 44 106 44" />
            </svg>
            <div className="badge badge-neutral">{songsInTotal}</div>
            </button> 

            <button className="btn join-item">
            <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1.2em"
            width="1.2em"
            >
            <path d="M811.4 418.7C765.6 297.9 648.9 212 512.2 212S258.8 297.8 213 418.6C127.3 441.1 64 519.1 64 612c0 110.5 89.5 200 199.9 200h496.2C870.5 812 960 722.5 960 612c0-92.7-63.1-170.7-148.6-193.3z" />
            </svg>
            <div className="badge badge-neutral">{byteSize(userBytesInUse).value + " " + byteSize(userBytesInUse).unit}</div>
            </button> 
        <button className="btn join-item" onClick={()=>document.getElementById('my_modal_7').showModal()}>
        <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1em"
            width="1em"
            >
            <path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z" />
            </svg>
            Edit
            </button>
        <button className="btn join-item btnDeleteUser" onClick={()=>document.getElementById('my_modal_6').showModal()}>
        <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1em"
            width="1em"
            >
            <path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z" />
            </svg>
            Delete <span className="loading loading-spinner hidden"></span></button>
      </div>
      </div></div>;
}