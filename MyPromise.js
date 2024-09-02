// 类有什么属性
// 有什么方法
// 初始化

const STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

class MyPromise {
  constructor(executor) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    // 执行函数
    executor(this.resolve, this.reject);
  }

  // 更改状态，同时将值保存为promise的值
  resolve = (value) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.FULFILLED;
      this.value = value;
    }
  };

  reject = (error) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.REJECTED;
      this.value = error;
    }
  };
}

let myPromise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

console.log(myPromise1);

setTimeout(() => {
  console.log(myPromise1);
}, 3000);
