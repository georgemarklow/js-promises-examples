// using callbacks
function loadImage(url){
    var promise = new Promise(
        function resolver(resolve, reject){
            var img = new Image();
            img.src = url;

            img.onload = function(){
                resolve(img);
            }

            img.onerror = function(e){
                reject(e)
            }
        }
    );

    return promise;
}

// call function
loadImage("test.png").then(function(img){
    console.log("image found");
}).catch(function (e){
    console.log("error occurred loading data");
    console.log(e);
})

// or...

var promise = loadImage("test.png");

promise.then(function(img){
    console.log("image found");
});

promise.catch(function(e){
    console.log("error occurred loading data");
    console.log(e);
});


// state of promise never changes after it is fulfilled or rejected
// the state of th promise can only be changed once
var promise = new Promise(function (resolve, reject){
    resolve(Math.PI);
    reject(0);              // nothing happens
    resolve(Math.sqrt(-1)); // nothing happens
});

promise.then(function(number){
    console.log('This number is ' + number);
    // This number is 3.14..s
});


// immediately resolving or rejecting a promise
new Promise(function(resolve, reject){
    resolve("the long way");
});
Promise.resolve("The short way");


// equivalent ways to create a rejected promise
new Promise(function(resolve, reject){
    reject("long rejection");
});
Promise.reject("Short rejection");


// Callback execution order
var promise = new Promise(function(resolve, reject){
    console.log("Inside the resolver function");        // 1
    resolve();
});

promise.then(function(){                                // 3
    console.log("Inside the onFulfilled handler");
});

console.log("This is the last line of the script");     // 2


// error propagation
Promise.reject(Error("bad news")).then(
    function step2(){
        console.log("this is never run");
    }
).then(
    function step3(){
        console.log("this is also never run");
    }
).catch(
    function(error){
        console.log("something failed")
        console.log(error);
    }
);

// Output
// something failed
// [Error object] { message: 'bad news' ... }


// the async ripple effect
function showPun(){
    console.log("show pun");
}

function getPun(){
    return ajax("url").then(function(json){
        var pun = JSON.parse(json);
        return pun.content;
    });
}


// caching a promise
var user = {
    loginPromise: null,

    login: function(){
        var me = this;
        if (this.loginPromise == null){
            this.loginPromise = ajax("url");

            this.loginPromise.catch(function(){
                me.loginPromise = null;
            });

            return this.loginPromise;
        }
    }
}

showPun().then(function(){
    console.log("stick to programming")
});


// running async tasks in parallel
var accounts = ["Current", "Savings"];

accounts.forEach(function(account){
    ajax("url").then(function(balance){
        console.log(account);
    });
});


// consolidate outcomes of parallel tasks
var requests = accounts.map(function(account){
    return ajax("url");
});

Promise.all(requests).then(function(balances){
    console.log(balance.length + " up-to-date");
}).catch(function(error){
    console.log("error occurred calculating balances");
    console.log(error);
});



// explicitly rejecting a promise
var rejectedPromise = new Promise(function(resolve, reject){
    reject(new Error("error"));
});

rejectedPromise.catch(function(err){
    console.log("rejected");
    console.log(err);
});


// Functions that return promises should not throw errors
function badFunction(url) {
    var image;
    image.src = url; // Error, image undefined
    return new Promise(function(resolve, reject){
        image.onload = resolve;
        image.onerror = reject;
    });
}

function goodFunction(url){
    return new Promise(function(resolve, reject){
        var image;
        image.src = url; // Error, image undefined
        image.onload = resolve;
        image.onerror = reject;
    });
}

// Passing errors
var db = {
    connect: function(){
        console.log("connecting...");
    },
    query: function(){
        console.log("querying...");
    }
}

function getReportData(){
    return db.connect().then(function(connection){
        return db.query(connection, "select report data");
    });
}

getReportData().then(function(data){
    data.sort();
    console.log(data);
}).catch(function(err){
    console.log("unable to show data");
    console.log(err);
});


// mimic try/catch/finally
function getData(){
    var dataPromise;
    var timestamp = performance.now();

    dataPromise = new Promise(function(resolve, reject){
        throw new Error("unexpected problem");
    });

    dataPromise.catch(function(err){
      // do not rethrow error  
    }).then(function(){
        // simulates finally block
        console.log("data fetch took " + (performance.now() - timestamp));
    });

    return dataPromise;
}
