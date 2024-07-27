
class Iter{
  constructor(){
    this.strs = ["abc", "def", "ghi"]
  }

  *[Symbol.iterator](){
    // yield *this.strs.entries()
    for(let item of this.strs){
      yield item
    }
  }
}

let it = new Iter()

for(let i of it){
  console.log(i)
}