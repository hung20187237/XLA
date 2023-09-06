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
    img => img.addEventListener('click', evt => { APP.source.src = img.src })
)

function rf(source){
    console.log(source);
    var formdata = new FormData();
    formdata.append("snap", source);
    fetch("http://127.0.0.1:5000/fr-filter", {
        method: 'POST',
        body: formdata,
    }).then(function(response) {
        response.json().then(parsedJson => {
            console.log(parsedJson);
            document.getElementById("img_res").src = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("download").href = 'data:image/png;base64,' + parsedJson[0];
        });
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });
}