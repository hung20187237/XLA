const resultBtns2 = document.querySelectorAll('.js-click-img')
const modal3 = document.querySelector('.js-modal3')
const modalclose3 = document.querySelector('.js-close3')

lo = null;

function showResultImg2() {
    modal3.classList.add('open')
}

function hideResultImg2() {
    modal3.classList.remove('open')
}

document.getElementById('0').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '0';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('1').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '1';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('2').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '2';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('3').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '3';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('4').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '4';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('5').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '5';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('6').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '6';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('7').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '7';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('8').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '8';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

document.getElementById('9').addEventListener('click', function() {
    modal3.classList.add('open');
    lo = '9';
    document.getElementById("img_res").src = "";
    document.getElementById("download").href = "";
});

modalclose3.addEventListener('click', hideResultImg2)



// tf.setBackend("wasm").then(() => runModel());

const APP = {
    source: document.getElementById("source"),
    canvas: document.getElementById("result"),
    status: document.getElementById("status"),
    download: document.getElementById("download"),
};

document.getElementById("file").addEventListener("change", evt => {
    const files = document.getElementById("file").files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            APP.source.src = this.result;
            rf(APP.source.src);
        });    
    }
});

function rf(source){
    console.log(source);
    var formdata = new FormData();
    formdata.append("snap", source);
    formdata.append("type", lo);
    fetch("http://127.0.0.1:5000/th-filter", {
        method: 'POST',
        body: formdata,
    }).then(function(response) {
        response.json().then(parsedJson => {
            console.log(parsedJson);
            document.getElementById("img_res").src = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("download").href = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("file").value = "";
        });
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });
}

document.querySelectorAll('#examples img').forEach(
    img => img.addEventListener('click', evt => { APP.source.src = img.src })
)