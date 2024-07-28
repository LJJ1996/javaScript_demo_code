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

// =========== 8.3 继承 ===========

// =========== 8.3.1 原型链 ===========

{
	function SuperType() {
		this.property = true
	}

	SuperType.prototype.getSuperValue = function () {
		return this.property
	}

	function SubType() {
		this.subProperty = false
	}

	// 继承SuperType
	SubType.prototype = new SuperType()

	SubType.prototype.getSubValue = function () {
		return this.subProperty
	}

	let instance = new SubType()

	console.log(instance.getSuperValue()) // true
}

// =========== 8.3.2 盗用构造函数（对象伪装/经典继承） ===========

{
	function SuperType() {
		this.colors = ["red", "blue"]
	}

	function SubType() {
		// 继承SuperType
		// 通过call()（或apply()）方法，SuperType构造函数在
		// 为SubType的实例创建的新对象的上下文中执行了
		SuperType.call(this)
	}

	let instance1 = new SubType()
	instance1.colors.push("black")
	console.log(instance1.colors) // ["red", "blue", "black"]

	let instance2 = new SubType()
	console.log(instance2.colors) // 	["red", "blue"]
}

// =========== 8.3.3 组合继承（原型链+盗用构造函数） ===========

{
	function SuperType(name) {
		this.name = name
		this.colors = ["red", "blue", "green"]
	}

	SuperType.prototype.sayName = function () {
		console.log(this.name)
	}

	function SubType(name, age) {
		// 继承SuperType的属性
		SuperType.call(this, name)
		this.age = age
	}
	// 继承方法
	SubType.prototype = new SuperType()

	SubType.prototype.sayAge = function () {
		console.log(this.age)
	}

	let instance1 = new SubType("Nicholas", 29)
	instance1.colors.push("black")
	console.log(instance1.colors) // ['red', 'blue', 'green', 'black']
	instance1.sayName() // "Nicholas"
	instance1.sayAge() // 29

	let instance2 = new SubType("Grey", 27)
	console.log(instance2.colors) // ["red", "blue", 'green']
	instance2.sayName() // "Grey"
	instance2.sayAge() // 27
}

// =========== 8.3.4 原型式继承 ===========
{
	// object()是对传入的对象执行了一次浅复制
	function object(o) {
		function F() {}
		F.prototype = o
		return new F()
	}

	// ECMAScript 5通过增加Object.create()方法将原型式继承的概念规范化
	// 只有一个参数时，Object.create()与object方法效果相同
	let person = {
		name: "Nicholas",
		friends: ["Shelby", "Court", "Van"],
	}
	let anotherPerson = Object.create(person, {
		name: {
			value: "Greg",
		},
	})

	console.log(anotherPerson.name) // Greg
}

// =========== 8.3.5 寄生式继承 ===========
{
	function createAnother(original) {
		let clone = object(original) // 通过调用函数创建一个新对象
		clone.sayHi = function () {
			// 以某种方式增强这个对象
			console.log("hi")
		}
		return clone // 返回这个对象
	}

	let person = {
		name: "Nicholas",
		friends: ["Shelby", "Court", "Van"],
	}

	let anotherPerson = createAnother(person)
	anotherPerson.sayHi() // "hi"
}

// =========== 8.3.5 寄生式组合继承 ===========
{
	function inheritPrototype(subType, superType) {
		let prototype = object(superType.prototype) // 创建对象
		prototype.constructor = subType // 增强对象
		subType.prototype = prototype // 复制对象
	}

	function SuperType(name) {
		this.name = name
		this.colors = ["red", "blue", "green"]
	}

	SuperType.prototype.sayName = function () {
		console.log(this.name)
	}

	function SubType(name, age) {
		// 继承SuperType的属性
		SuperType.call(this, name)
		this.age = age
	}

	inheritPrototype(SubType, SuperType)

	SubType.prototype.sayHi = function () {
		console.log(this.age)
	}
}

// =========== 8.4 类 ===========

// =========== 8.4.2 构造函数 ===========
{
	class Person {
		constructor(override) {
			this.foo = "foo"
			if (override) {
				return {
					bar: "bar",
				}
			}
		}
	}

	let p1 = new Person(),
		p2 = new Person(true)

	console.log(p1) // Person { foo: 'foo' }
	console.log(p1 instanceof Person) // true

	console.log(p2) // { bar: 'bar' }
	console.log(p2 instanceof Person) // false
}

// =========== 8.4.3 实例、原型和类成员 ===========
{
	class Person {
		constructor() {
			// 添加到this的所有内容都会存在于不同的实例上
			this.locate = () => console.log("instance")
		}

		// 在类块中定义的所有内容都会定义在类的原型上
		locate() {
			console.log("prototype")
		}

		// 定义在类本身上
		static locate() {
			console.log("class", this)
		}
	}

	let p = new Person()
	p.locate() // instance
	Person.prototype.locate() // prototype
	Person.locate() // class, class Person {}
}

{
	class Person {
		constructor() {
			this.nicknames = ["Jack", "Jake", "J-Dog"]
		}
		// 生成器方法
		*[Symbol.iterator]() {
			yield* this.nicknames.entries()
			// 等同于
			// for(let item of this.nicknames.entries()){
			// 	yield item
			// }
		}

		// 也可以只返回迭代器实例
		// [Symbol.iterator]() {
		// 	return this.nicknames.entries()
		// }
	}

	let p = new Person()

	for (let [idx, nicknames] of p) {
		console.log(nicknames)
	}
	// Jack
	// Jake
	// J-Dog
}

// =========== 8.4.4 继承 ===========
{
	class Vehicle {
		constructor() {
			this.hasEngine = true
		}

		static identify() {
			console.log("Vehicle")
		}
	}

	class Bus extends Vehicle {
		constructor() {
			// 不要在调用super()之前引用this，否则会抛出ReferenceError
			super() // 相当于super.constructor()

			console.log(this instanceof Vehicle) // true
			console.log(this) // Bus { hasEngine: true }
		}

		static identify() {
			super.identify()
		}
	}

	Bus.identify() // "Vehicle"
}

{
	// 抽象基类
	class Vehicle {
		constructor() {
			console.log(new.target)
			if (new.target === Vehicle) {
				throw new Error("Vehicle cannot be directly instantiated")
			}

			if (!this.foo) {
				throw new Error("Inheriting class must define foo()")
			}

			console.log("success")
		}
	}

	class Bus extends Vehicle {
		foo() {}
	}

	class Van extends Vehicle {}

	new Bus() // "success"
	new Van() // Error: Inheriting class must define foo()
}
