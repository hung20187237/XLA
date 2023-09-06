const buyBtns = document.querySelectorAll('.js-buy-ticket')
const resultBtns = document.querySelectorAll('.js-load-img')
const modal = document.querySelector('.js-modal')
const modalclose = document.querySelector('.js-close')
const container = document.querySelector('.js-container')

lastest_json = [];

function showBuyTickets() {
    modal.classList.add('open')
}
function hideBuyTickets() {
    modal.classList.remove('open')
}
document.getElementById('0').addEventListener('click', function() {
    modal.classList.add('open');
    lo = '0';
    console.log("GO 0");
    console.log(lastest_json);
    if(lastest_json.length > 0) {
        document.getElementById("img_res2").src = 'data:image/png;base64,' + lastest_json[0];
        document.getElementById("download2").href = 'data:image/png;base64,' + lastest_json[0];
    }
});

document.getElementById('1').addEventListener('click', function() {
    modal.classList.add('open');
    lo = '1';
    console.log("GO 1");
    if(lastest_json.length > 0) {
        document.getElementById("img_res2").src = 'data:image/png;base64,' + lastest_json[1];
        document.getElementById("download2").href = 'data:image/png;base64,' + lastest_json[1];
    }
});

document.getElementById('2').addEventListener('click', function() {
    modal.classList.add('open');
    lo = '2';
    console.log("GO 2");
    if(lastest_json.length > 0) {
        document.getElementById("img_res2").src = 'data:image/png;base64,' + lastest_json[2];
        document.getElementById("download2").href = 'data:image/png;base64,' + lastest_json[2];
    }
});
modalclose.addEventListener('click', hideBuyTickets)

modal.addEventListener('click', hideBuyTickets)

container.addEventListener('click', function (event) {
    event.stopPropagation()
})

//home_convert
function showResultbt() {
    modal.classList.add('open')
}
function hideResultbt() {
    modal.classList.remove('open')
}

document.getElementById('bt1').addEventListener('click', function() {
    modal.classList.add('open');
    if(lastest_json.length > 0) {
        document.getElementById("img_res2").src = 'data:image/png;base64,' + lastest_json[0];
        document.getElementById("download2").href = 'data:image/png;base64,' + lastest_json[0];
    }
});
document.getElementById('bt2').addEventListener('click', function() {
    modal.classList.add('open');
    if(lastest_json.length > 0) {
        document.getElementById("img_res2").src = 'data:image/png;base64,' + lastest_json[1];
        document.getElementById("download2").href = 'data:image/png;base64,' + lastest_json[1];
    }
});
modalclose.addEventListener('click', hideResultbt)





var header = document.getElementById('header')
var mobileMenu = document.getElementById('mobile-menu')
var headerHeight = header.clientHeight
/* đóng mở menu*/
mobileMenu.onclick = function(){
    var isClose = header.clientHeight === headerHeight;
    if(isClose){
        header.style.height = 'auto';
    }else {
        header.style.height = null;
    }
}
/* đóng khi chọn menu*/
var menuItems = document.querySelectorAll('#nav li a[href*="#"]')
for (var i = 0; i < menuItems.length; i++){
    var menuItem = menuItems[i];

    menuItem.onclick = function(checkNav){
        var isParentmenu = this.nextElementSibling && this.nextElementSibling.classList.contains('subnav');
        if(isParentmenu){
            checkNav.preventDefault();
        }else{
            header.style.height = null;
        }
    }
}
// tf.setBackend("wasm").then(() => runModel());

const APP = {
    source: document.getElementById("source"),
    source2: document.getElementById("source2"),
    source3: document.getElementById("source3"),
    canvas: document.getElementById("result"),
    status:document.getElementById("status"),
    download: document.getElementById("download"),
};

document.getElementById("file2").addEventListener("change", evt => {
    console.log('Change file 2');
    const files = document.getElementById("file2").files[0];
    if (files) {
        console.log('Change file 2 due 2');
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            APP.source2.src = this.result;
            rf2(APP.source2.src);
        });    
    }
});

document.getElementById("file").addEventListener("change", evt => {
    console.log('Change file');
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
document.getElementById("file3").addEventListener("change", evt => {
    console.log('Change file 3');
    const files = document.getElementById("file3").files[0];
    if (files) {
        console.log('Change file 3 due 3');
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            APP.source3.src = this.result;
            rf3(APP.source3.src);
        });    
    }
});

function rf2(source2){
    console.log(source2);
    var formdata = new FormData();
    formdata.append("snap", source2);
    fetch("http://127.0.0.1:5000/home-bottom-filter", {
        method: 'POST',
        body: formdata,
    }).then(function(response) {
        response.json().then(parsedJson => {
            console.log(parsedJson);
            lastest_json = parsedJson;
            document.getElementById("im1").src = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("im2").src = 'data:image/png;base64,' + parsedJson[1];
            document.getElementById("im3").src = 'data:image/png;base64,' + parsedJson[2];
        });
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });
}
function rf3(source3){
    console.log(source3);
    var formdata = new FormData();
    formdata.append("snap", source3);
    fetch("http://127.0.0.1:5000/home-convert-filter", {
        method: 'POST',
        body: formdata,
    }).then(function(response) {
        response.json().then(parsedJson => {
            console.log(parsedJson);
            lastest_json = parsedJson;
            document.getElementById("bt1").src = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("bt2").src = 'data:image/png;base64,' + parsedJson[1];
        });
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });
}

function rf(source){
    console.log(source);
    var formdata = new FormData();
    formdata.append("snap", source);
    fetch("http://127.0.0.1:5000/home-filter", {
        method: 'POST',
        body: formdata,
    }).then(function(response) {
        response.json().then(parsedJson => {
            console.log(parsedJson);
            lastest_json = parsedJson;
            document.getElementById("img_res").src = 'data:image/png;base64,' + parsedJson[0];
            document.getElementById("download").href = 'data:image/png;base64,' + parsedJson[0];
        });
    }).catch(function(err) {
        console.log('Fetch problem: ' + err.message);
    });
}


document.querySelectorAll('#examples img').forEach(
    img => img.addEventListener('click', evt => { APP.source.src = img.src })
)
