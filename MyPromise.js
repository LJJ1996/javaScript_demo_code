// 类有什么属性
// 有什么方法
// 初始化

const STATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

const resolvePromise = (promise2, x, resolve, reject) => {
  // 循环
  if (promise2 === x) {
    reject(new Error(""));
  }

  // x如果返回的是promise

  let called;

  if (typeof x === "function" || (typeof x === "object" && x !== null)) {
    let then = x.then;
    try {
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (e) => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err);
    }
  }
};

class MyPromise {
  constructor(executor) {
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.fulfillCallbacks = [];
    this.rejectedCallbacks = [];
    this.finallyCallbacks = [];
    // 执行函数
    executor(this.resolve, this.reject);
  }

  // 更改状态，同时将值保存为promise的值
  resolve = (value) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.FULFILLED;
      this.value = value;
      this.fulfillCallbacks.forEach((element) => {
        element(this.value);
      });
      this.finallyCallbacks.forEach((element) => element());
    }
  };

  reject = (error) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.REJECTED;
      this.reason = error;
      this.rejectedCallbacks.forEach((element) => {
        element(this.reason);
      });
      this.finallyCallbacks.forEach((element) => element());
    }
  };

  then = (onFulfilled, onRejected) => {
    const onFulfilledFn =
      typeof onFulfilled === "function" ? onFulfilled : () => onFulfilled;
    const onRejectedFn =
      typeof onRejected === "function" ? onRejected : () => onRejected;

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === STATUS.PENDING) {
        // pending状态不执行
        let _this = this;

        this.fulfillCallbacks.push(() => {
          setTimeout(() => {
            let x = onFulfilled.call(_this, _this.value);
            resolvePromise(promise2, x, resolve, reject);
          }, 0);
        });
        this.rejectedCallbacks.push(() => {
          setTimeout(() => {
            let x = onRejected.call(_this, _this.value);
            resolvePromise(promise2, x, resolve, reject);
          }, 0);
        });
      }

      if (this.status === STATUS.FULFILLED) {
        // fulfilled状态直接执行
        let _this = this;
        setTimeout(() => {
          let x = onFulfilled.call(_this, _this.value);
          resolvePromise(promise2, x, resolve, reject);
        }, 0);
      }

      if (this.status === STATUS.REJECTED) {
        // reject状态直接执行
        let _this = this;
        setTimeout(() => {
          let x = onRejected.call(_this, _this.value);
          resolvePromise(promise2, x, resolve, reject);
        }, 0);
      }
    });

    return promise2;
  };

  catch = (onReject) => {
    if (typeof onReject === "function") {
      this.rejectedCallbacks.push(onReject);
    }
  };

  finally = (onFinally) => {
    if (typeof onFinally === "function") {
      this.finallyCallbacks.push(onFinally);
    }
  };

  static resolve(onFulfilled) {
    if (typeof onFulfilled === "MyPromise") {
    }
  }
}

let myPromise1 = new MyPromise((resolve, reject) => {
  //   setTimeout(() => {
  resolve(1);
  //   }, 1000);
});

myPromise1.then(
  (value) => {
    console.log("myPromise1 value: ", value);
    return 20;
  },
  (err) => {
    console.log("myPromise1 onReject: ", err);
  }
);

// myPromise1.then((value) => {
//     console.log("myPromise1 value: ", value);
//     return 20;
//   }).then(10).then(res => {
//       console.log("myPromise2 value: ", res)
//   });

let myPromise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(Error("this is an error"));
  }, 1000);
});

// myPromise2.then(
//   (value) => {
//     console.log("myPromise2 value: ", value);
//     return 20;
//   },
//   (err) => {
//     console.log("myPromise2 onReject: ", err);
//   }
// );

myPromise2.catch((err) => {
  console.log("myPromise catch: ", err);
});
