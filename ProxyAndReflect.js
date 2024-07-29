// =========== 9.1 代理与反射 ===========
{
	const target = {
		id: "target",
	}

	const handler = {}

	const proxy = new Proxy(target, handler)
	// id属性会访问同一个值
	console.log(target.id) // target
	console.log(proxy.id) // target

	// 给目标属性赋值会反映到两个对象上
	// 因为两个对象访问的事同一个值
	target.id = "foo"
	console.log(target.id) // foo
	console.log(proxy.id) // foo

	// 给代理属性赋值会反映在两个对象上
	// 因为这个赋值会转移到目标对象
	proxy.id = "bar"
	console.log(target.id) // bar
	console.log(proxy.id) // bar

	// hasOwnProperty()方法在两个地方都会应用到目标对象
	console.log(target.hasOwnProperty("id")) // true
	console.log(proxy.hasOwnProperty("id")) // true

	// Proxy.prototype是undefined
	// 因此不能使用instanceof操作符
	console.log(target instanceof Proxy) // TypeError: Function has non-object prototype 'undefined' in instanceof check
	console.log(proxy instanceof Proxy) // TypeError: Function has non-object prototype 'undefined' in instanceof check

	// 严格相等可以用来区分代理和目标
	console.log(target === proxy) // false
}

{
	const target = {
		foo: "bar",
	}

	const handler = {
		// 捕获器在处理程序对象中以方法名为键
		get() {
			return "handler override"
		},
	}

	const proxy = new Proxy(target, handler)

	console.log(target.foo) // bar
	console.log(proxy.foo) // handler override

	console.log(target["foo"]) // bar
	console.log(proxy["foo"]) // handler override

	console.log(Object.create(target)["foo"]) // bar
	console.log(Object.create(proxy)["foo"]) // handler override
}

{
	const target = {
		foo: "bar",
	}

	const handler = {
		// 参数：目标对象、要查询的属性和代理对象
		get(trapTarget, property, receiver) {
			console.log(trapTarget === target)
			console.log(property)
			console.log(receiver === proxy)
			// 重建被捕获方法的原始行为
			return trapTarget[property]
		},
	}

	const proxy = new Proxy(target, handler)

	proxy.foo
	// true
	// foo
	// true
}

{
	// 使用Reflect重建被捕获方法的原始行为
	const target = {
		foo: "bar",
	}

	const handler = {
		// 参数：目标对象、要查询的属性和代理对象
		get(trapTarget, property, receiver) {
			console.log(trapTarget === target)
			console.log(property)
			console.log(receiver === proxy)
			// 重建被捕获方法的原始行为
			// return trapTarget[property]
			return Reflect.get(...arguments)
		},

		set() {
      // Reflect 重建 原始行为
			return Reflect.set
		},
	}

	const proxy = new Proxy(target, handler)
  // 创建捕获所有方法，将每个方法转发给对应反射API的空代理
	const proxy1 = new Proxy(target, Reflect)
}
