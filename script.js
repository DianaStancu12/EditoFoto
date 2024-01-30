let imgSel = null;
let selectie = false;
let start = { x: 0, y: 0 };
let sfarsit = { x: 0, y: 0 };
let imgMod = null;
let imgInitiala=null;




function afisareImagine() {
    const fileInput = document.getElementById('fileInput');
    const imageContainer = document.getElementById('imageContainer');

    if (fileInput.files && fileInput.files[0] && !imgSel) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;

            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
            imgSel = img;

            imgInitiala=new Image();
            imgInitiala.src=e.target.result;

            const canvas = document.getElementById('editorCanvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}

function startSel(event) {
    if (imgSel) {
        selectie = true;
        const rect = event.target.getBoundingClientRect();
        start = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        sfarsit = { x: start.x, y: start.y };
    }
}

function updateSel(event) {
    if (selectie) {
        const rect = event.target.getBoundingClientRect();
        sfarsit = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        drawSel();
    }
}

function endSel(event) {
    selectie = false;
}

function drawSel() {
    const canvas = document.getElementById('editorCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgSel, 0, 0, imgSel.width, imgSel.height);

    const width = sfarsit.x - start.x;
    const height = sfarsit.y - start.y;

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(start.x, start.y, width, height);
}

function decupare() {
    if (imgSel) {

        drawSel();

        const canvas = document.getElementById('editorCanvas');
        const ctx = canvas.getContext('2d');

        const width = sfarsit.x - start.x;
        const height = sfarsit.y - start.y;

        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        const croppedCtx = croppedCanvas.getContext('2d');

        croppedCtx.drawImage(imgSel,start.x,start.y,width,height,0,0,width,height);

        imgMod = new Image();
        imgMod.src=croppedCanvas.toDataURL('image/png');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(croppedCanvas, 0, 0, width, height);

        selectie = false;
    }
}

function albNegruEff(canvas) {
    const ctx = canvas.getContext('2d');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const gray = 0.3 * red + 0.59 * green + 0.11 * blue;

        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }


    ctx.putImageData(imageData, 0, 0);

    imgMod = new Image();
    imgMod.src = canvas.toDataURL('image/png');
}


function seteazaEfect() {
    if (imgSel) {
        const canvas = document.getElementById('editorCanvas');
        const ctx = canvas.getContext('2d');

        const width = sfarsit.x - start.x;
        const height = sfarsit.y - start.y;


        const selectedCanvas = document.createElement('canvas');
        selectedCanvas.width = width;
        selectedCanvas.height = height;
        const selectedCtx = selectedCanvas.getContext('2d');


        selectedCtx.drawImage(imgSel, start.x, start.y, width, height, 0, 0, width, height);

        albNegruEff(selectedCanvas);


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imgSel, 0, 0);
        ctx.drawImage(selectedCanvas, start.x, start.y, width, height);
    } else {
        alert('Selectați o zonă pe imagine înainte de a aplica efectul.');
    }
}



function stergerePixeli() {
    if (imgSel) {
        const canvas = document.getElementById('editorCanvas');
        const ctx = canvas.getContext('2d');

        const width = sfarsit.x - start.x;
        const height = sfarsit.y - start.y;


        const selectedCanvas = document.createElement('canvas');
        selectedCanvas.width = width;
        selectedCanvas.height = height;
        const selectedCtx = selectedCanvas.getContext('2d');


        selectedCtx.drawImage(imgSel, start.x, start.y, width, height, 0, 0, width, height);


        const imageData = selectedCtx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {

            data[i] = 255;  
            data[i + 1] = 255; 
            data[i + 2] = 255; 

        }


        imgMod = new Image();
        imgMod.src = selectedCanvas.toDataURL('image/png');

        ctx.putImageData(imageData, start.x, start.y);
    

    } else {
        alert('Selectați o zonă pe imagine înainte de a șterge selecția.');
    }
}


function promptMarimi() {
    const newWidth = prompt('Introdu noua latime:');
    const newHeight = prompt('Introdu noua inaltime:');

    if (newWidth !== null && newHeight !== null) {
        const parsedWidth = parseInt(newWidth);
        const parsedHeight = parseInt(newHeight);

        if (!isNaN(parsedWidth) && !isNaN(parsedHeight) && parsedWidth > 0 && parsedHeight > 0) {
            scalareImagine(parsedWidth, parsedHeight);
        } else {
            alert('Dimensiuni invalide. Introdu numere naturale pozitive.');
        }
    }
}

function scalareImagine(newWidth, newHeight) {
    if (imgSel) {
        const canvas = document.getElementById('editorCanvas');
        const ctx = canvas.getContext('2d');

        const scaledCanvas = document.createElement('canvas');
        scaledCanvas.width = newWidth;
        scaledCanvas.height = newHeight;
        const scaledCtx = scaledCanvas.getContext('2d');

        scaledCtx.drawImage(imgMod, 0, 0, newWidth, newHeight);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(scaledCanvas, 0, 0, newWidth, newHeight);
    }
}

function resetare(){
    if(imgInitiala){
        const canvas=document.getElementById('editorCanvas');
        const ctx=canvas.getContext('2d');

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(imgInitiala,0,0);
    }else{
        alert('Nu a fost incarcatat nicio imagine');
    }
}


function salvare() {
    if (imgMod) {
        const numeFisier = prompt('Introduceți numele fișierului:', 'saved_image');

        if (numeFisier !== null) { 
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imgMod.width;
            canvas.height = imgMod.height;


            ctx.drawImage(imgMod, 0, 0);


            const dataUrl = canvas.toDataURL('image/png');

            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${numeFisier}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } else {
        alert('Nu a fost selectată nicio imagine.');
    }
}






