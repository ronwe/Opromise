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

		if (err) 	return errFn && errFn(err)

		if (!util.isArray(result)) result = [result]
		if ('function' == typeof seqFn){
			result.push(cbk)
			var ret = seqFn.apply(null , result)
			//非回调形式的 有返回值
			if (undefined != ret) cbk(null , ret)
		} else {
			//并行调用
			callParal(seqFn , result, cbk)
		}
	}

	function callParal(seqFns, argsIn ,  cbk){
		var parallel_keys = Object.keys(seqFns)
		var cf = parallel_keys.length
		var retParel = {}
			,errParel = {}
			,hasErr = false

		function cbkParel(key , err , result){
			if (err) {
				hasErr = true
				errParel[key] = err
			}else {
				retParel[key] = result
			}

			cf--
			if (cf <= 0 ){
				cbk(hasErr && errParel , retParel )
			}
		}
		if (!util.isArray(argsIn)) argsIn = [argsIn]
		argsIn.push(null)

		for (var i = 0 , j = parallel_keys.length ; i < j ; i++){
			var key = parallel_keys[i]
			argsIn.pop()
			var pCbk = cbkParel.bind(null , key)
			argsIn.push(pCbk)
			var r = seqFns[key].apply(null , argsIn)
			if (undefined != r) pCbk(null , r)
		}
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
