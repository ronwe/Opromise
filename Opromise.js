var util = require('util')


exports.set = function(){
    var args  =  Array.prototype.slice.call(arguments)
    var seqs = []

    function cbk(err , result){
        var nextFn = seqs.splice(0 , 1)[0]
        if (!nextFn) return result
        var errFn = nextFn[1]
        var seqFn = nextFn[0]

        if (false === errFn){
            result = Array.prototype.slice.call(arguments)
            err = null
        }

        if (err)    return errFn && errFn(err)

        if (!util.isArray(result)) result = [result]
        result.push(cbk)
        seqFn.apply(null , result)
    }

    args.push(cbk)
    var inO = {
        'then' : function(seqFn ,errFn){
            seqs.push([seqFn ,errFn])
            return inO
        }
    }
    setImmediate(function(){
        cbk(null , args)

    })
    return inO

}
