{
	try {
		throw new Error("foo")
	} catch (e) {
		console.log(e) // Error: foo
	}
  // Promise.reject抛出的异常，try/catch不能捕获
  // 可以用.catch(e => {console.log(e)})捕获promise的错误
	try {
		Promise.reject(new Error("bar"))
	} catch (e) {
		console.log(e)
	}

	// Uncaught (in promise) Error: bar
}
