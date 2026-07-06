const fs = require("fs")
const path = require("path")


// import fetch from 'node-fetch' 

// Define the model URL and query parameters                                                                
const modelUrl = 'http://localhost:12434/engines/llama.cpp/v1/chat/completions'; // Replace with your model's URL                            
                                                                   

function get_doctor_url(other=null){
    let pth = path.join(__dirname, 'doctor-charts')
    // console.log(pth)
    if(other != null){
        return path.join(pth,other)
    }
    return pth
}

async function get_doctors(){
    return fs.readdirSync(get_doctor_url())
}

async function get_doctor_format(the_doctor){
    let u = get_doctor_url(the_doctor)
    // console.log("gettting path",u)
    return await fs.readFileSync(u);
}




async function convertText(the_text,the_doctor){
    //mock conversion function

    let doc_format = await get_doctor_format(the_doctor)
    if(doc_format == null || doc_format.length < 10){
        console.error("no valid doc format for ",the_doctor)
        return [
            {
                message:{
                    content:`could not find doctor ${the_doctor}`
                }
            }
        ]
    }

    const the_body = {
        "model": "ai/llama3.2",
        "messages": [
            // {
            //     "role": "system",
            //     "content": "You are a helpful assistant. Please Provide the response formatted entirely as raw HTML (including appropriate tags like <p>, <ul>, <strong>, etc.) without any introductory or concluding markdown/text outside of the HTML structure."
            // },
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": `${the_doctor} likes information formatted in the following way
${doc_format}}`
            },
            {
                "role": "user",
                "content": `please convert the following text to the format that ${the_doctor} would like
${the_text}}`
            }
        ]
    }

    // console.log(JSON.stringify(the_body,undefined,4))

    const response = await fetch(modelUrl , {                                                 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(the_body),
    });



                                                                                                    
    if (response.ok) {
        const data = await response.json();
        const answers = data.choices
        // console.log(JSON.stringify(answers,undefined,4));
        return JSON.stringify(answers)
    } else {
        return response.statusText
        // console.error(`Error: ${response.statusText}`);                                                         
    }      

    return defaultOutput;
}





// Define the async function to ask the model a question                                                    
async function askModelQuestion(query) {      
    const the_body = {
        "model": "ai/llama3.2",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            {
                "role": "user",
                "content": query
            }
        ]
    }
    const response = await fetch(modelUrl , {                                                 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(the_body),
    });
    
    if (response.ok) {
        const data = await response.json();
        const answers = data.choices
        // console.log(JSON.stringify(answers,undefined,4));
    } else {
        console.error(`Error: ${response.statusText}`);                                                         
    }                                                                                                         
}

function get_certs(){
    return {
        key: fs.readFileSync('priv/server.key'),
        cert: fs.readFileSync('priv/server.cert')
    };
}

module.exports = {
    askModelQuestion,
    convertText,
    get_doctor_url,
    get_doctor_format,
    get_doctors,
    get_certs
}

