#!/usr/bin/env node 

// import {defaultOutput,defaultInput} from './constants.js' 
const {defaultOutput,defaultInput} = require("./src/constants.js")
const {
    askModelQuestion,
    convertText,
    get_doctor_url,
    get_doctor_format,
    get_doctors,
    get_certs
} = require("./src/ai-model-utils.js")
var shouldWait = false;
async function convertText_old(txt,doctor){
    //mock conversion function
    if(shouldWait){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve(defaultOutput);
            },5000);
        });
    }
    return defaultOutput;
}


//this is a mock backend server for testing purposes

const express = require('express');
const https = require('https');
const options = get_certs()

const app = express();
app.use(express.static('public'));
app.use(express.json());
const PORT = 4433



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

app.get('/doctors', async (req, res) => {
    let docs = await get_doctors()
    let resp = JSON.stringify(docs)
    res.send(resp);
});


app.put("/convert/:docname",async (req,res)=>{
    let docname = req.params.docname;

    // console.log(`Converting for doc: [${docname}]`);
    let body = req.body.data;

    let result = await convertText(body,docname);
    // console.log(result)
    res.send(result);
})



// app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`);});

https.createServer(options, app).listen(PORT, () => {
  console.log('HTTPS Server running on port 4433');
});

