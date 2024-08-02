// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject} from "firebase/storage";
import { upload } from "@testing-library/user-event/dist/upload";
import {v4} from "uuid";
import toast, { Toaster } from 'react-hot-toast';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEVEVsrASUMHV0YvR-JQIBOC_TB2oSXKk",
    authDomain: "crudapp-62b1c.firebaseapp.com",
    projectId: "crudapp-62b1c",
    storageBucket: "crudapp-62b1c.appspot.com",
    messagingSenderId: "634727399951",
    appId: "1:634727399951:web:08bd454f10b895a94dd97a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);


export async function uploadFile(file, fileName){
    const storageRef = ref(storage, "songs/" + fileName);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
}
export async function deleteFile(file){
    // Create a reference to the file to delete
    const desertRef = ref(storage, file);
    // Delete the file
    deleteObject(desertRef).then(() => {
        //toast.success('Deleted!');
    }).catch((error) => {
       toast.error('Error deleting the file!')
    });
}
