// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQnNC43q2D5M_cU3PiKUdgOeLqKmEeMUo",
  authDomain: "kastamonuguideapp-efcd4.firebaseapp.com",
  projectId: "kastamonuguideapp-efcd4",
  storageBucket: "kastamonuguideapp-efcd4.appspot.com",
  messagingSenderId: "193950487456",
  appId: "1:193950487456:web:d309a91220a1071de34ac5"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, get, set, child, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

var categoryname = document.getElementById("Categoryname");
var categorynumber = document.getElementById("Categorynumber");
var categorystatus = document.getElementById("Categorystatus");

const db = getDatabase();
var id = 0;
var tbody = document.getElementById('tbodydata');
var cid=0;

function InsertData() {
    const dbref = ref(db);
    get(child(dbref, "Categories"))
    .then((snapshot)=>{
        var categories = [];
        snapshot.forEach(childSnapshot => {
            categories.push(childSnapshot.val());
        });
        categories.forEach(element => {
            cid = element.PlacesId + 1;
        });
        set(ref(db, "Categories/"+cid), {
            PlacesId: cid,
            Name: categoryname.value,
            LineNumber: categorynumber.value,
            Status: categorystatus.value
        })
        .then(() => {
            alert("Kategori başarıyla kaydedildi!");
            window.location.href = "settingspage_category.html";
        })
        .catch((error) => {
            alert("Bir hata ile karşılaşıldı, Hata" + error);
        });
    });
}

function UpdateData(getid) {
    update(ref(db,"Categories/"+getid),{
        Name: categoryname.value,
        LineNumber: categorynumber.value,
        Status: categorystatus.value
    })
    .then(()=>{
        alert("Kategori başarıyla güncellendi!");
    })
    .catch((error)=>{
        alert("Bir hata ile karşılaşıldı, Hata"+error);
    });
}

function DeleteData(getid) {
    remove(ref(db, "Categories/" + getid))
    .then(() => {
        alert("Kategori başarıyla silindi!");
    })
    .catch((error) => {
        alert("Bir hata ile karşılaşıldı, Hata" + error);
    });
}

function AddItemToTable(name,number,status,pid) {
    let trow = document.createElement("tr");
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');

    td1.className = "mdl-data-table__cell--non-numeric";
    td2.className = "mdl-data-table__cell--non-numeric";
    td3.className = "mdl-data-table__cell--non-numeric";
    td4.className = "mdl-data-table__cell--non-numeric";
    td5.className = "mdl-data-table__cell--non-numeric";
    td6.className = "mdl-data-table__cell--non-numeric";

    td1.innerHTML = ++id;
    td2.innerHTML = name;
    td3.innerHTML = number;
    if (status == "Active") { td4.innerHTML = "<span id='activeLabel' class='label label--mini background-color--primary'>Aktif</span>"; }
    else { td4.innerHTML = "<span id='passiveLabel' class='label label--mini background-color--secondary'>Pasif</span>"; }
    td5.innerHTML = "<a href='update_category.php?id=" + pid + "'><button id='update_category' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect button--colored-green'>Düzenle</button></a>";
    td6.innerHTML = "<button id='delete_category' onclick='DeleteData(" + pid + ")' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect button--colored-red'>Sil</button>";

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);

    tbody.appendChild(trow);
}

function AddAllItemsToTable(TheCategory){
    id = 0;
    tbody.innerHTML = "";
    TheCategory.forEach(element => {
        AddItemToTable(element.Name, element.LineNumber, element.Status, element.PlacesId);
    });
}

function GetAllDataOnce() {
    const dbref = ref(db);
    get(child(dbref, "Categories"))
    .then((snapshot)=>{
        var categories = [];
        snapshot.forEach(childSnapshot => {
            categories.push(childSnapshot.val());
        });
        AddAllItemsToTable(categories);
    });
}

function GetAllDataRealtime() {
    const dbref = ref(db,"Categories");
    onValue(dbref, (snapshot)=>{
        var categories = [];
        snapshot.forEach(childSnapshot => {
            categories.push(childSnapshot.val());
        });
        AddAllItemsToTable(categories);
    });
}

function SelectData() {
    const dbref = ref(db);

    get(child(dbref,"Categories/1")).then((snapshot)=>{
        if(snapshot.exists()){
            categoryname.value = snapshot.val().Name;
            categorynumber.value = snapshot.val().Number;
            categorystatus.value = snapshot.val().Status;
        }
        else{ 
            alert("Bu kategori bulunamadı!"); 
        }
    }).catch((error)=>{
        alert("Bir hata ile karşılaşıldı. Hata: "+error)
    });
}

export { InsertData, DeleteData, UpdateData, GetAllDataRealtime, GetAllDataOnce, SelectData }