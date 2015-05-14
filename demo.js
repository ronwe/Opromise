var O = require('./Opromise.js')
var fs = require('fs')


var pwd = __dirname



O.set(pwd)
    .then(fs.exists)
    .then(function(exists ,cbk){
        cbk (null , pwd + '/t.txt' )
        } , false)
    .then(fs.writeFile)
    .then(function(f , cbk){
        console.log('file' , f)
        cbk(null , f)
    })
    .then(function(){
        console.log('>>>>' , arguments)
    })
