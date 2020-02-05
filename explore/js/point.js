// 导出方法
export function someFunction() {
    console.log('This is modules');
}

// 导出类
export class Point {
    constructor (name, age) {
        this.name = name;
        this.age = age;
    }
    sayName(){
        console.log(`My name is ${this.name} & My age is ${this.age}`);
    }
}

// 这个函数没有被导出
function resizeCanvas() {

}