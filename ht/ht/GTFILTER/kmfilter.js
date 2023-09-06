const resultBtns2 = document.querySelectorAll('.js-click-img')
const modal2 = document.querySelector('.js-modal2')
const modalclose2 = document.querySelector('.js-close2')

lastest_json = []

function showResultImg0() {
    modal2.classList.add('open');
    if(lastest_json.length > 0) {
        document.getElementById("img_res").src = 'data:image/png;base64,' + lastest_json[0];
        document.getElementById("download").href = 'data:image/png;base64,' + lastest_json[0];
    }
}

function showResultImg1() {
    modal2.classList.add('open');
    if(lastest_json.length > 0) {
        document.getElementById("img_res").src = 'data:image/png;base64,' + lastest_json[1];
        document.getElementById("download").href = 'data:image/png;base64,' + lastest_json[1];
    }
}

function showResultImg2() {
    modal2.classList.add('open');
    if(lastest_json.length > 0) {
        document.getElementById("img_res").src = 'data:image/png;base64,' + lastest_json[2];
        document.getElementById("download").href = 'data:image/png;base64,' + lastest_json[2];
    }
}

function showResultImg3() {
    modal2.classList.add('open');
    if(lastest_json.length > 0) {
        document.getElementById("img_res").src = 'data:image/png;base64,' + lastest_json[3];
        document.getElementById("download").href = 'data:image/png;base64,' + lastest_json[3];
    }
}

function hideResultImg2() {
    modal2.classList.remove('open');
}

resultBtns2[0].addEventListener('click', showResultImg0);
resultBtns2[1].addEventListener('click', showResultImg1);
resultBtns2[2].addEventListener('click', showResultImg2);
resultBtns2[3].addEventListener('click', showResultImg3);

modalclose2.addEventListener('click', hideResultImg2)



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


document.querySelectorAll('#examples img').forEach(
    img => img.addEventListener('click', evt => { APP.source.src = img.src;  })
)

function rf(source){
    console.log(source);
    var formdata = new FormData();
    formdata.append("snap", source);
    fetch("http://127.0.0.1:5000/k-mean", {
        method: 'POST',
        body: formdata,
    }).then(function(response) {
        response.json().then(parsedJson => {
            lastest_json = parsedJson;
            document.getElementById("km3").src = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("km5").src = 'data:image/png;base64,' + parsedJson[1];
            document.getElementById("km8").src = 'data:image/png;base64,' + parsedJson[2];
            document.getElementById("km12").src = 'data:image/png;base64,' +parsedJson[3];
        });
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });
}