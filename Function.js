// 函数名
{
	function foo() {}
	let bar = function () {}
	let baz = () => {}

	console.log(foo.name) // foo
	console.log(bar.name) // bar
	console.log(baz.name) // baz
	console.log((() => {}).name) // "" (空字符串)
	console.log(new Function().name) // anonymous

	console.log(foo.bind(null).name) // bound foo

	let dog = {
		years: 1,
		get age() {
			return this.year
		},
		set age(newAge) {
			this.years = newAge
		},
	}

	let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, "age")
	console.log(propertyDescriptor.get.name) // get age
	console.log(propertyDescriptor.set.name) // set age
}

// 参数
{
	function doAdd(num1, num2) {
		arguments[1] = 10
		console.log(arguments[0] + num2)
	}

	doAdd(10, 20) // 20

	doAdd(10) // NaN
}

{
	// 严格模式，arguments赋值不影响传入参数的值
	function doAdd(num1, num2) {
		"use strict"
		arguments[1] = 10
		console.log(arguments[0] + num2)
	}

	doAdd(10, 20) // 30
}
// this
{
	function King() {
		this.royaltyName = "Henry"
		// this引用King的实例
		setTimeout(() => console.log(this.royaltyName), 1000)
	}

	function Queen() {
		this.royaltyName = "Elizabeth"
		setTimeout(function () {
			// this 引用window对象
			console.log(this.royaltyName)
		}, 1000)
	}

	new King() // Henry
	new Queen() // undefined
}

// 闭包中的this
{
	window.identity = "The window"
	let object = {
		identity: "My Object",
		getIndentityFunc() {
			return function () {
				return this.identity
			}
		},
	}

	console.log(object.getIndentityFunc()()) // The window
}

{
	window.identity = "The window"
	let object = {
		identity: "My Object",
		getIndentity() {
			return this.identity
		},
	}

	object.getIndentity(); // My Object
	(object.getIndentity)(); // My Object
	(object.getIndentity = object.getIndentity)(); // The Window


}
