// =========== 8.2 创建对象 ===========

{
	// 工厂模式
	function createPerson(name, age, job) {
		let o = new Object()
		o.age = age
		o.name = name
		o.job = job
		o.sayName = function () {
			console.log(this.name)
		}
		return o
	}

	let person1 = new createPerson("test", 29, "Doctor")
}

{
	// 构造模式
	function Person(name, age, job) {
		this.name = name
		this.age = age
		this.job = job
		this.sayName = function () {
			console.log(this.name)
		}
	}

	let person1 = new Person("test", 29, "Doctor")

	{
		// 作为构造函数调用
		let person = new Person("name", 29, "Doctor")
		person.sayName() // Doctor

		// 作为函数调用
		Person("Grey", 27, "Engineer") // 添加到Window对象
		window.sayName() // Engineer

		// 在另一个对象的作用域中调用
		let o = new Object()
		Person.call(o, "Kristen", 25, "Nurse")
		o.sayName() // "Kristen"
	}
}

// =========== 8.2.4 原型模式 ===========

{
	/**
	 * 构造函数可以是函数表达式
	 * 也可以是函数声明，因此以下两种形式都可以：
	 * function Person() {}
	 * let Person = function() {}
	 */
	function Person() {}
	Person.prototype.name = "Nicholas"

	/**
	 * 声明之后，构造函数就有了一个与之关联的原型对象
	 */

	console.log(typeof Person.prototype) // Object
	console.log(Person.prototype)
	// {
	// 	constructor: f Person(),
	// 	__proto__: Object
	// }

	/**
	 * 如前所述，构造函数有一个prototype属性
	 * 引用其原型对象，而这个原型对象也有一个constructor属性
	 * 引用这个构造函数
	 * 两者循环引用
	 */

	console.log(Person.prototype.constructor === Person) // true

	/**
	 * 正常的原型链都会终止于Object的原型对象
	 * Object原型的原型是null
	 */
	console.log(Person.prototype.__proto__ == Object.prototype) // true
	console.log(Person.prototype.__proto__.constructor == Object) // true
	console.log(Person.prototype.__proto__.__proto__ === null) // true

	console.log(Person.prototype.__proto__)
	// {
	// 	constructor: f Object(),
	// 	toString: ...
	// 	hasOwnProperty: ...
	// 	isPrototypeOf: ...
	// }

	let person1 = new Person(),
		person2 = new Person()

	/**
	 * 构造函数、原型对象和实例 是3个完全不同的对象
	 */

	console.log(person1 !== Person) // true
	console.log(person1 !== Person.prototype) // true
	console.log(Person.prototype !== Person) // true
	console.log(Person.prototype.constructor === Person) // true

	/**
	 * 实例通过__proto__链接到原型对象
	 * 它实际上指向隐藏特性[[Prototype]]
	 *
	 * 构造函数通过prototype属性链接到原型对象
	 *
	 * 实例与构造函数没有直接联系，与原型对象有直接联系
	 */

	console.log(person1.__proto__ === Person.prototype) // true
	console.log(person1.__proto__.constructor == Person) // true

	/**
	 * 同一个构造函数创建的两个实例，共享同一个原型对象
	 */
	console.log(person1.__proto__ == person2.__proto__) // true

	/**
	 * instanceof检查实例的原型链中
	 * 是否包含指定构造函数的原型
	 */
	console.log(person1 instanceof Person) // true
	console.log(person1 instanceof Object) // true
	console.log(Person.prototype instanceof Object) // true

	/**
	 * isPrototypeOf()方法会在传入参数的[[Prototype]]指向调用它的对象时返回true
	 */
	console.log(Person.prototype.isPrototypeOf(person1)) // true
	console.log(Person.prototype.isPrototypeOf(person2)) // true

	/**
	 * Object.getPrototypeOf()返回参数的内部特性[[prototype]]的值（传入对象的原型对象）
	 */

	console.log(Object.getPrototypeOf(person1) === Person.prototype)

	{
		// ========= hasOwnProperty =========
		console.log(person1.hasOwnProperty("name")) // false
		person1.name = "Grey"
		console.log(person1.hasOwnProperty("name")) // true
		console.log(person1.name) // Grey 来自实例
		delete person1.name
		console.log(person1.hasOwnProperty("name")) // false
		console.log(person1.name) // Nicholas 来自原型
	}

	// 确定某个属性是否存在于原型上
	function hasPrototypeProperty(object, name) {
		return !object.hasOwnProperty(name) && name in object
	}
}

// =========== 8.2.5 对象迭代 ===========
{
	const o = {
		foo: "bar",
		baz: 1,
		qux: {},
	}

	console.log(Object.values(o)) // ["bar", 1, {}]

	console.log(Object.entries(o)) // [["foo", "bar"], ["baz", 1], ["qux", {}]]

	{
		const o = {
			qux: {},
		}

		console.log(Object.values(o)[0] === o.qux) // true 执行对象的浅复制
		console.log(Object.entries(o)[0][1] == o.qux) // true 执行对象的浅复制
	}

	{
		// 符号属性会被忽略
		const sym = Symbol()
		const o = {
			[sym]: "foo",
		}

		console.log(Object.values(o)) // []

		console.log(Object.entries(o)) // []
	}
}
