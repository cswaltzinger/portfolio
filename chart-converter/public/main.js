
const doctorSelect = document.getElementById("doctor-select");
const input = document.getElementById("input");
const output = document.getElementById("output");
const submit_btn = document.getElementById("convert-btn");

input.value = defaultInput.trim();


var clicked = 0 



function displayOutput() {
    
   
}
function buttonProofOfConcept(){
    if(clicked == 1){
        setTimeout(()=>{
            output.value = defaultOutput.trim();
        },5000);
    }else{
        output.value = defaultOutput.trim();
        clicked = 0;
    }
}

function buttonActualRequest(){
    output.value = "Using AI to convert text... ";
   let docname = doctorSelect.value || "defaultdoc"
//    console.log(input.value)
   fetch(`/convert/${docname}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({data: input.value})
   })
   .then(res=>res.json())
   .then(data => data[0].message.content)
   .then(data=>{
        // output.innerHTML = data;
        output.value = data
   })
   .catch(err=>{
        console.error("Error during fetch:", err);
   });
}





document.querySelectorAll("textarea").forEach((ta) => {
    ta.addEventListener("keydown", (e) => {
        if (e.key !== "Tab") return;
        e.preventDefault();

        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = ta.value.slice(start, end);

        if (!e.shiftKey) {
            // Tab: insert a tab or indent each selected line
            if (selected.includes("\n")) {
                const indented = selected.split("\n").map(line => "\t" + line).join("\n");
                ta.value = ta.value.slice(0, start) + indented + ta.value.slice(end);
                ta.selectionStart = start;
                ta.selectionEnd = start + indented.length;
            } else {
                ta.value = ta.value.slice(0, start) + "\t" + ta.value.slice(end);
                ta.selectionStart = ta.selectionEnd = start + 1;
            }
        } else {
            // Shift+Tab: outdent current line or all selected lines
            if (selected.includes("\n")) {
                const outdented = selected.split("\n").map(line => line.startsWith("\t") ? line.slice(1) : line).join("\n");
                ta.value = ta.value.slice(0, start) + outdented + ta.value.slice(end);
                ta.selectionStart = start;
                ta.selectionEnd = start + outdented.length;
            } else {
                const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
                if (ta.value[lineStart] === "\t") {
                    ta.value = ta.value.slice(0, lineStart) + ta.value.slice(lineStart + 1);
                    const shift = start > lineStart ? 1 : 0;
                    ta.selectionStart = ta.selectionEnd = start - shift;
                }
            }
        }
    });
})



let btnFunction = window.location.href.includes("localhost") ? buttonActualRequest : buttonProofOfConcept;
btnFunction = buttonProofOfConcept


submit_btn.addEventListener("click",()=>{
    output.value = `Using AI to convert chart to ${doctorSelect.value}'s format... `;
    clicked++;
    btnFunction();
});


setTimeout(() => {
    document.querySelector(".warning").style.display = "none";
    
    btnFunction();
},500);


if(window.location.protocol != 'file:'){

fetch("doctors")
    .then(res => res.json())
    .then(js =>{
        js.forEach(item =>{
            let the_element = document.createElement("option")
            the_element.innerText = `Dr.${item}`
            the_element.value = item 
            doctorSelect.appendChild(the_element)
        })

    }).catch(err=>{
        doctorSelect.innerHTML = `<option value="no-connection">no-connection</option>
        <option value="Dr.Pengragon">Dr.Pengragon</option>
            <option value="Dr.le'Fe">Dr.le'Fe</option>
            <option value="Dr.Merlin">Dr.Merlin</option>`
        btnFunction = buttonProofOfConcept
    })
}else{
     doctorSelect.innerHTML = `<option value="no-connection">no-connection</option>
        <option value="Dr.Pengragon">Dr.Pengragon</option>
            <option value="Dr.le'Fe">Dr.le'Fe</option>
            <option value="Dr.Merlin">Dr.Merlin</option>`
        btnFunction = buttonProofOfConcept

}

