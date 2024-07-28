import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import {createPdf} from './services/api';
import {gapi} from 'gapi-script'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'


const clientId = "482660746898-itg9s06c5855mfhdon9mqqnf1b9agk00.apps.googleusercontent.com";
const API_KEY = "AIzaSyCrqaaXEpLjzKVCbZgiykwmrl-BjnqPlps";
const SCOPES = "https://www.googleapis.com/auth/documents";


function App() {

useEffect(()=>{
 
  function start() {
    gapi.auth2.init({  
      apiKey: API_KEY,
      clientId : clientId,
      scopes: SCOPES,
      cookie_policy: 'single_host_origin' 
    })
  };

  gapi.load('client:auth2', start);
},[])

  const [ items, setData ] = useState([
    { type: '', keyword: '', incluir: '' },
  ])


  const responseGoogle = (response) => {
    console.log(response);
  }
  async function criarBriefing(){


    
    let accesToken = gapi.auth.getToken();
    console.log(accesToken);
    fetch('https://docs.googleapis.com/v1/documents', {
      method: "POST",
      headers: new Headers({'Authorization' : 'Bearer '+ accesToken, {'content-type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    }).then((res) => {
      return res.json();
    }).then(function (val){
      console.log(val);
      console.log(val.documents);
    })


      const data = {
        data : items,
       }
       try {
         const briefing = await createPdf(data); 
         console.log(briefing.data?.url);  
         window. open(briefing.data?.url)            
         } catch (error) {
         console.log(error);
       }
       let fetch_url = `https://docs.googleapis.com/v1/documents?key=${API_KEY}`;
       
       let fetch_options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Example of a Doc created programmatically",
        }),
       };
       
       fetch(fetch_url, fetch_options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        });
      }


}

  const columns = [
    {
      ...keyColumn('type', textColumn),
      title: 'TIPO',
    },
    {
      ...keyColumn('keyword', textColumn),
      title: 'KEYWORD',
    },
    {
      ...keyColumn('incluir', textColumn),
      title: 'INCLUIR',
    },
  ]

  return (

    <>
        <DataSheetGrid
      value={items}
      onChange={setData}
      columns={columns}
    />
    
    <GoogleLogin
    clientId={clientId}
    buttonText="Login"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />

    </>
  )
}

export default App;
