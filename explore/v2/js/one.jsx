console.log('hello index.html');

/*1、箭头函数*/
let user1 = '小A';
let user2 = '小B';

const NAME = 'rexhang';

var saySomeThings = (a, b, c) => console.log(a, b, c);
saySomeThings(user1, user2, NAME);

var array = [1,2,3];

array.forEach(function(v,i,a){
    console.log(v, i)
});

array.forEach((v, i) => console.log(v, i));

/*2、类的定义*/
class Animal {
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    sayName(){
        console.log('My Name is ' + this.name);
    }
}
/*2.1、类的继承*/
class Programmer extends Animal {
    program(){
        console.log(this)
        console.log('i am coding……');
    }
}

var animal = new Animal('cry');

var personal = new Programmer('jack', 24);

animal.sayName();

personal.sayName();

personal.program();

/*3、增强的对象字面量*/
var human = {
    hunt() {
        console.log('this is function in object');
    }
}
// 3.1、直接继承
var owns = {
    __proto__: human,
    company: 'freelancer',
    work() {
       console.log('working...');
    }
}
human.hunt();
owns.hunt();

/*4、字符串模板*/
let num = Math.random();
console.log(`your num is ${num}`);

/*5、解构*/
var [x,y] = getVal(); /*函数返回值解构*/
var [name,,age] = ['rexhang','b','24']; /*数组解构*/

function getVal(){
    return [1,2];
}
console.log('x:'+x+', y:'+y);
console.log(`name = ${name}&&&age = ${age}`);

/*6、参数默认值，不定参数，拓展参数*/
function sayHello(name){
    var name = name || 'default';
    console.log(`hello ${name}`);
}
sayHello('rexhang');
function sayHelloEs6(name='mily'){
    console.log(`hello ${name}`);
}
sayHelloEs6();
sayHelloEs6('guhang');
// 6.1 不定参数
function add(...s){
    return s;
}
console.log(add('one', 'one2', 'one3', 'one4'));
console.log(add('two'));
// 6.2 拓展参数
var people = ['a', 'b', 'c'];
function sayHello(people1,people2,people3){
    console.log(`Hello ${people1},${people2},${people3}`);
}
sayHello(...people);
//而在以前，如果需要传递数组当参数，我们需要使用函数的apply方法
sayHello.apply(null, people);//输出：Hello Wayou,John,Sherlock

/*7、模块*/
import {someFunction} from "./point.js";
import {Point} from "./point.js";

// 进行同步调用
someFunction();

var origin = new Point('rexhang', 24);
origin.sayName();

/*8、Symbol 让外部对象无法访问*/
var key = Symbol("ourkeys");
//var key = "ourkeys";
function inits(keys){
    var obj = {};
    obj[key] = keys;
    return obj;
}
console.log(inits('x'));

/*9、Math，Number，String，Object 的新API*/
var str = 'ABCDEFG';
console.log( str.includes("AB") ); // true
console.log(str.repeat(2)); // ABCDEFGABCDEFG

/*10、Promises*/
//创建promise
//创建promise
var promise = new Promise(function(resolve, reject) {
    // 进行一些异步或耗时操作
    if ( true ) {
        resolve("success");
    } else {
        reject( new Error('error') );
    }
});
promise.then(function(res) {
    console.log(res);
}, function(error) {
    console.error(error);
});
// 用处 层级调用
var index = 0;
var gobalObj = {};
function step1(resolve, reject){
    if(index === 0){
        gobalObj.code = '200'; // doing
        var resObj = {'code': '200', 'name': 'step1'}; // result object
        resolve(resObj);
    } else{
        reject('错误');
    }
}
function step2(resolve, reject){
    if(gobalObj.code === '200'){
        window.obj = {step2: 'ok'}; // doing
        var resObj = {'code': '200', 'name': 'step2'}; // result object
        resolve(resObj);
    } else{
        reject('错误');
    }
}
new Promise(step1).then(function(res){
    console.log(res);
    return new Promise(step2);
}, function(err){
    console.error(err);
}).then(function(res){
    console.log(res);
}, function(err){
    console.error(err);
});
