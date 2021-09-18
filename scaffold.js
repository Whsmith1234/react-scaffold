#! /usr/local/bin/node

var shell = require("shelljs");
const fs = require('fs');
var arguments = String(process.argv);
var args = arguments.split(",");
var details = args.slice(3);
var index = "./" + args[2] + "/src/index.js"
var mainPage = "./" + args[2] + "/src/App.js";
var NewPost = "./" + args[2] + "/src/newPost.js";
var Post = "./" + args[2] + "/src/Post.js";
var Header = "./" + args[2] + "/src/Header.js";
var SignIn = "./" + args[2] + "/src/signIn.js";
shell.exec("npx create-react-app " + args[2] + " --template cra-template-pwa");

var header = `
import React from 'react';
import './App.css';
import {route} from './index'
import {signOut,getAuth} from 'firebase/auth';
function Header(props) {
  return (
      <div>
    <nav>
    <div class="nav-wrapper">
      <a href="#" class="brand-logo">Posts</a>
      <ul id="nav-mobile" class="right">
      <li><a href="#" onClick={(e)=>{
          e.preventDefault();
          route("new")
      }
      }>New</a></li>
        <li><a href="#" onClick={(e)=>{
            e.preventDefault();
            signOut(getAuth());
        }
        }>Log Out</a></li>
        
      </ul>
    </div>
  </nav>
  <div id = "posts"></div>
  </div>
  );
}

export default Header;`;

var newPost = ` 
import './App.css';
import {route} from'./index';
import { getDatabase,ref, set} from "firebase/database";
function newPost() { 
   return(
      <center>
        <h3>New Post</h3>`;


var post = `
import React from 'react';
import './App.css';

function Post(props) {
  return (
    <div class="col s12 m6 l4">
    <div class="card white darken-1">
    <div class="card-content black-text">
    <span class="card-title">${details[0]}: {props.${details[0]}}</span>
    <p>`;
var posts = "<Post ";
for (var i = 0; i < details.length; i++) {
  newPost += `<input placeholder="${details[[i]]}" type="text" id="${details[i]}" />`
  posts += details[i] + "={posts[i]." + details[i] + "} ";
  if (i < details.length - 1) {
    post += details[i + 1] + ": {props." + details[i + 1] + "} <br/>"

  }

}
post += `
</p>
</div>
</div>
</div>
);
}

export default Post;`;
newPost += `
<span class= "btn" onClick={(e)=>{
  e.preventDefault();
  route("app")
  }}>Cancel</span>
   <span class= "btn" onClick={(e)=>{
  e.preventDefault();
  `
for (var i = 0; i < details.length; i++) {
  newPost += `var ${details[i]} = document.getElementById("${details[i]}").value;\n`;
}
newPost += `var Post ={
      `;
for (var i = 0; i < details.length - 1; i++) {
  newPost += `${details[i]}:${details[i]},
  `;
}
newPost += `
 ${details[details.length-1]}:${details[details.length-1]} }
  post(Post);
  route("app");
  }}>Post</span>
</center>
);
}
export default newPost;

function post(post){
    const db = getDatabase();
    const reference = ref(db,'/'+Date.now());
    set(reference,post);
}`
posts += "/>";


//var data = fs.writeFileSync(mainPage, mainCode); 
mainPageCode = `
import React from 'react';
import ReactDOM from 'react-dom';
import { getDatabase,ref,onValue } from "firebase/database";
import './App.css';
import Post from './Post';

function upDate(posts){
   ReactDOM.render(
     <React.StrictMode>
      <div class = "row">
     <PostArea posts = {posts}/>
     </div>
     </React.StrictMode>,
     document.getElementById('posts')
   );  
  }

function App() {
   var d = ref(getDatabase(),'/');
   onValue(d,(e)=>{
     if(e.val()){
     console.log(e.val());
     var posts=[];
     for(var i =0;i<Object.keys(e.val()).length;i++){
       posts[i] = e.val()[Object.keys(e.val())[i]];
       console.log(posts);
     }
    
       upDate(posts);
     
     console.log(posts);
   }
  });
    return (
      <div></div>
    );
  }
function PostArea(props){
   var renderPosts=[];
   var posts = [];
   posts=props.posts;
   for(var i =0;i<posts.length;i++){
    renderPosts[i]= ${posts}
   }
   return(
     renderPosts
   );
 }
 export default App;
 `;
//index
indexPage = `
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './Header';
import NewPost from './newPost';
import SignIn from './signIn';
import {initializeApp} from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const firebaseConfig = {
  //PUT YOUR FIREBASE CONFIG HERE
};

initializeApp(firebaseConfig);
const auth = getAuth();
console.log(auth);
export function logOut(){
  signOut(auth);
  route("signIn");
}
export function signIn(email,password){
  signInWithEmailAndPassword(auth,email,password);
}
export function signUp(email,password){
  createUserWithEmailAndPassword(auth,email,password);
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("uid",user.uid)
    localStorage.setItem("email",user.email);
    route("app");
    } else {
    route("signIn");
  }
});

serviceWorkerRegistration.register();

export function route(page){
    switch(page){
      case "signIn":
        ReactDOM.render(
        <React.StrictMode>
      
        <div class="container">
          <Header />
          <SignIn />
        </div>
     
        </React.StrictMode>,
        document.getElementById('root')
      );  
      ReactDOM.render(
        <React.StrictMode>
        </React.StrictMode>,
        document.getElementById('posts')
      );  
      break;
      case "app":
        ReactDOM.render(
        <React.StrictMode>
        <div class="container">
          <Header/>
          <App/>
        </div>
        </React.StrictMode>,
        document.getElementById('root')
      );  
      break;
      case "new":
        ReactDOM.render(
            <React.StrictMode>
            <div class="container">
              <Header/>
              <NewPost/>
            </div>
            </React.StrictMode>,
            document.getElementById('root')
          );  
        break;
      }
   }
   route("signIn");
 `;
//index
var indexHTML = `
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <title>${args[2]}</title>
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  </head>
  <body>

    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`;
var signIn = `
import React from 'react';
import './App.css';
import {signIn,signUp} from './index'
function SignIn() {

  return (
    <div>
    <div class = "row">
      <div class = "col s1 m3 l3 xl4"> </div>
        <div class="col s10 m6 l6 xl4">
          <div class="SignIn card">
          <div class="card-content black-text">
            <span class="card-title">Sign In / Sign Up</span>
            <input class = "black-text" placeholder = "email" type = "email" id = "email"></input>
            <input class = "black-text" placeholder = "password" type = "password" id = "password"></input>
          </div>
          <div class="card-action">
            <a onClick = {(e)=>{
              e.preventDefault();
              signIn(document.getElementById('email').value,document.getElementById('password').value);
            }} href="#">Sign In</a>
            <a onClick = {(e)=>{
              e.preventDefault();
              signUp(document.getElementById('email').value,document.getElementById('password').value);
            }} href="#">Sign Up</a>
          </div>
        </div>
        <div class = "col s1 m3 l3 xl4"> </div>
      </div>
    </div>
    </div>
  );
}

export default SignIn;
`;


fs.writeFileSync(Post, post);
fs.writeFileSync(index, indexPage);
fs.writeFileSync(SignIn, signIn);
fs.writeFileSync(Header, header);
fs.writeFileSync(mainPage, mainPageCode);
fs.writeFileSync(NewPost, newPost);
fs.writeFileSync("./" + args[2] + "/public/index.html", indexHTML);

console.log("Process complete...");
console.log("cd into "+args[2]);
console.log("Then run npm install firebase");
