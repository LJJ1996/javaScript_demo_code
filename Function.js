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
    'use strict'
    arguments[1] = 10;
    console.log(arguments[0] + num2);
  }

  doAdd(10, 20); // 30
}