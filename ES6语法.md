## ES6语法
> 非原创
### 1.let 和const命令

#### 1.let命令

**基本用法:**

ES6新增了let 命令,用来声明变量.它的用法类似于var,但是所声明的变量只能在let命令所在的代码块内有效.

```javascript
{
  let a =10;
  var b = 1;
}
a//ReferenceError: a is not defined
b//1
```

上面的代码在代码块之中,分别使用let和var声明了两个变量.然后在代码块之外调用这两个变量,结果let声明的变量报错,var声明的变量返回了正确的值.这表明.let声明的变量只在它所在的代码块有效.

  for循环的计数器,就很适用let命令.

```javascript
for (let i = 0 ; i <10; i++){
  
}
console.log(i);//ReferenceError: i is not defined
```

上面代码中,计数器i只在for循环体内有效,在循环体外面引用就会报错.

下面的代码如果使用var,最后输出的是10.

```javascript
var a = [];
for(var i = 0 ; i <10 ;i++){
  a[i] = function(){
  console.log(i);
}
}
a[6]();//10
```

上面的代码中,变量i是var声明的,在全局范围内有效,所以全局只有一个变量i.每一次循环,变量i的值都会发生改变,而循环内被赋给数组a的函数内部的 console.log(i),里面的i指向的就是全局的i,也就是说,所有数组a的成员里面的i,指向的都是同一个i,导致运行时输出的时最后一轮的i的值,也就是10.

如果使用let,声明的变量仅在块级作用域内有效,最后输出的是6.

```javascript
var a = [];
for(let i = 0 ; i <10 ;i++){
  a[i] = function(){
  console.log(i);
}
}
a[6]();//6
```

上面的代码中,变量i是let声明的,当前的i只在本轮循环中有效,所以每一次循环的i其实都是一个新的变量,所以最后输出的是6.因为JavaScript引擎内部会记住上一轮循环的值,初始化本轮的变量i时,就在上一轮循环的基础上进行计算.

另外.for循环还有一个特别的地方.就是设置循环变量的那部分是一个父作用域,而循环体内部是一个单独的子作用域.

```javascript
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

上面代码正确运行,输出了三次abc.这表明函数内部的变量i与循环变量i不在同一个作用域,有各自单独的作用域.

**不存在变量提升**

var 命令会发生"变量提升"现象,即变量可以在声明之前使用,值为undefined.这种现象多多少少是有些奇怪的,按照 一般的逻辑,变量应该在声明语句之后才可以使用.

为了纠正这个现象,let命令改变了语法行为,它所声明的变量一定要在声明后使用,否则会报错.

```javascript
//var 的情况
console.log(foo);//undefined
var foo = 2;
//let的情况
console.log(bar);//报错ReferenceError: bar is not defined
let bar = 2 ;
```

**暂时性死区**

只要块级作用域内存在let 命令,它所声明的变量就"绑定"这个区域,不再受外部影响.

```javascript
var temp = 123;
if(true){
  temp = "abc";
  let temp;
}
```

上面代码中，存在全局变量`tmp`，但是块级作用域内`let`又声明了一个局部变量`tmp`，导致后者绑定这个块级作用域，所以在`let`声明变量前，对`tmp`赋值会报错。

ES6明确规定,如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用`let`命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

```javascript
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError
  let tmp; // TDZ结束
  console.log(tmp); // undefined
  tmp = 123;
  console.log(tmp); // 123
}
```

上面代码中，在`let`命令声明变量`tmp`之前，都属于变量`tmp`的“死区”。

**不允许重复声明**

let不允许在相同作用域内,重复声明同一个变量

```javascript
//报错
function func(){
  let a = 10 ;
  var a = 1;
}
//报错
function func(){
  let a = 10;
  let a = 1 ;
}
```

因此,不能在函数内部重新声明参数

```javascript
function func(arg) {
  let arg; // 报错
}
function func(arg) {
  {
    let arg; // 不报错
  }
}
```

#### 2.const 命令

**基本用法:**

const 声明一个只读的常量,一旦声明,常量的值就不能改变.

```javascript
const PI = 3.1415;
PI//3.1415
PI = 3;
PI//Identifier 'PI' has already been declared
```

上面的代码表明改变常量的值会报错.

const 声明的变量不得改变值,这意味着,const一旦声明变量,就必须立即初始化,不能留到以后赋值.

```javascript
const foo;
// SyntaxError: Missing initializer in const declaration
```

上面代码表示，对于`const`来说，只声明不赋值，就会报错。

`const`的作用域与`let`命令相同：只在声明所在的块级作用域内有效。

```javascript
if(true){
  const Max = 5;
}
Max;//ReferenceError: Max is not defined
```

const命令声明的常量也是不提升,同样存在暂时性死区,只能在声明的位置后面使用.

```javascript
if (true) {
  console.log(MAX); // ReferenceError
  const MAX = 5;
}
```

上面代码在常量MAX声明之前就调用，结果报错。

const声明的常量,也与let一样不可以重复声明.

```javascript
var message = "Hello!";
let age = 25;

// 以下两行都会报错
const message = "Goodbye!";
const age = 30;	
```

**ES6声明变量的六种方法**

ES5只有两种声明变量的方法:var 命令和function命令.ES6除了添加let和const命令,后面章节还会提到另外两种变量声明的方法:import命令和class命令.所以,ES6一共有6种声明变量的方法.

#### 3. 顶层对象的属性

顶层对象,在浏览器环境指的时window对象,在Node指的时global对象.ES5之中,顶层对象的属性与全局变量是等价的,

```javascript
window.a = 1;
a//1
a = 2 ;
window.a //2
```

 上面代码中,顶层对象的属性赋值与全局变量的赋值是同一件事.

ES6为了保持兼容性,var命令和function命令声明的全局变量,依旧是顶层对象的属性;另一方面规定.let命令,const命令,class命令声明的全局变量,不属于顶层对象的属性;也就是说ES6开始.全局变量将逐步与顶层对象的属性脱钩.

```javascript
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1
let b = 1;
window.b // undefined
```

上面代码中，全局变量`a`由`var`命令声明，所以它是顶层对象的属性；全局变量`b`由`let`命令声明，所以它不是顶层对象的属性，返回`undefined`。

#### 4.global对象

ES5的顶层对象,本身也是一个问题,因为它在各种实现里面是不统一的.

- 浏览器里面,顶层对象是window,但是Node和Web Worker 没有window.
- 浏览器和Web Worker里面,self也指向顶层对象,但是Node没有self.
- Node里面,顶层对象是golbal,但其它环境都不支持.

同一段代码为了能够在各种环境都能取到顶层对象,现在一般是使用this变量,但是有局限性.

- 全局环境中,this会返回顶层对象.但是Node模块和ES6中,this返回的是当前的模块.
- 函数里面的this,如果函数不是作为对象的方法运行,而是单纯作为函数运行,this会指向顶层对象.但是,严格模式下,这时this会返回undefined.
- 不管是严格模式还是普通模式,new Function("return this")(),总是会返回全局对象.但是,如果浏览器用来CSP(Content Security Policy，内容安全政策),那么eval,new Function这些方法都可能无法使用.

```javascript
//方法一:
(typeof window !== 'undefined' ? window :(typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this );
//方法二:
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
```

### 2.变量的解构赋值

#### 1.数组的解构赋值

**基本用法:**

ES6允许按照一定模式,从数组和对象中提取值,这被成为解构.

以前,为变量赋值,只能直接指定值.

```javascript
let a = 1;
let b = 2;
let c =3;
```

ES6允许写成下面这样.

```
let [a,b,c] = [1,2,3]
```

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些使用嵌套数组进行解构的例子。

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo // 1
bar // 2
baz // 3

let [ , , third] = ["foo", "bar", "baz"];
third//'baz'

let [x, , y] = [1, 2, 3];
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4];//...+命名表示数组对象
head//1
tail//[2,3,4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```

当解构不成功时,变量的值就等于undefined.

另一种情况时不完全解构,即等号左边的模式,至匹配一部分的等号右边的数组.这种情况依然可以解构成功.

```javascript
let [x, y] = [1, 2, 3];
x // 1
y // 2

let [a, [b], d] = [1, [2, 3], 4];
a // 1
b // 2
d // 4
```

如果等号的右边不是数组(严格说是不可遍历的结构)那么将会报错.

```javascript
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```

对于set结构,也可以使用数组的解构赋值.

```javascript
let [x,y,z] = new Set(['a','b','c']);
```

事实上,只要某种数据结构具有iterator接口,都可以采用数组形式的解构赋值.

```javascript
function* fibs(){
  let a = 0;
  let b = 1;
  while(true){
  yield a;
    [a,b] = [b,a+b];
}
}
let [first, second, third, fourth, fifth, sixth] = fibs();

```

上面代码中，`fibs`是一个 Generator 函数（参见《Generator 函数》一章），原生具有 Iterator 接口。解构赋值会依次从这个接口获取值。

**默认值**

解构赋值允许指定默认值.

```javascript
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```

注意，ES6 内部使用严格相等运算符（`===`），判断一个位置是否有值。所以，只有当一个数组成员严格等于`undefined`，默认值才会生效。

```javascript
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

上面代码中，如果一个数组成员是`null`，默认值就不会生效，因为`null`不严格等于`undefined`。

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

```javascript
function f(){
  console.log('aaa');
}
let [x = f()] =[1];
```

上面代码中，因为`x`能取到值，所以函数`f`根本不会执行。上面的代码其实等价于下面的代码,

```javascript
let x;
if([1][0] === undefined){
   x =f();
}else{
  x = [1][0];
}
```

默认值可以引用解构赋值的其它变量,但该变量必须已经声明.

```javascript
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

上面最后一个表达式之所以会报错，是因为x用y做默认值时，y还没有声明。

#### 2.对象的解构赋值

解构不仅可以用于数组,还可以用于对象.

```javascript
let { foo ,bar } = { foo:'aaa',bar:'bbb'};
foo//'aaa'
bar//'bbb'
```

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值.

```javascript
let { bar, foo } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined
```

如果变量名与属性名不一致，必须写成下面这样。

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

这实际上说明，对象的解构赋值是下面形式的简写（参见《对象的扩展》一章）。

```javascript
let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
```

也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```javascript
let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined
```

上面代码中，foo是匹配的模式，baz才是变量。真正被赋值的是变量baz，而不是模式foo。

与数组一样,解构也可以用于嵌套解构的对象.

```javascript
let obj = {
  p:[
  'hello',
  { y: 'World'}
]
};
let { p:[x, {y}]} = obj;
x // "Hello"
y // "World"
```

注意,这时p是模式,不是变量,因此不会被赋值.如果p也要作为变量赋值,可以写成下面这样.

```javascript
let obj = {
  p:[
  'hello',
  { y: 'World'}
]
};
let { p ,p:[x,{y}]} = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```

下面是另一个例子.

```javascript
const node = {
  loc:{
  start:{
    line:1,
    column:5
}
}
};
let {loc,loc:{start},loc:{start:{line}}} = node;
line //1
loc // {start: {line: 1,column:5}}
start //{line:1,column:5}
```

下面是嵌套赋值的例子.

```javascript
let obj = {};
let arr = [];
({ foo: obj.prop, bar: arr[0] } = { foo: 123, bar: true });
obj // {prop:123}
arr // [true]
```

对象的解构也可以指定默认值.

```javascript
var {x = 3} = {};
x//3

var {x,y = 5} = { x : 1};
x//1
y//5

var {x: y = 3} = {x:5};
y//5

var{ message:msg = 'something went wrong'} = {};
msg//'something went wrong'
```

默认生效的条件是,对象的属性值严格等于undefined.

```javascript
var { x = 3 } = { x: undefined};
x//3

var { x = 3 } = { x: null};
x //null
```

上面代码中，属性`x`等于`null`，因为`null`与`undefined`不严格相等，所以是个有效的赋值，导致默认值`3`不会生效。

如果解构失败，变量的值等于`undefined`。

```javascript
let {foo} = {bar: 'baz'};
foo//undefined
```

如果解构模式是嵌套的对象,而且子对象所在的父属性不存在,那么将会报错.

```javascript
let { foo: {bar}} = {baz: 'baz'};
```

上面的代码中,等号左边对象的foos属性,对应一个子对象.该子对象的bar属性,解构时会报错.原因很简单,因为foo这时等于undefined,再取子属性就会报错.

如果将一个已经声明的变量用于解构赋值,必须非常小心.

```javascript
//错误写法
let x ;
{x} = {x:1};

//正确写法
let x ;
( {x} = {x: 1});
```

第一种写法会报错,因为javascript引擎会将{x}理解为一个代码块,从而发生语法错误.只有不将大括号写在首行,避免javascript将其解释为代码块,才能解决问题.

第二种写法,代码将整个解构赋值语句，放在一个圆括号里面，就可以正确执行。关于圆括号与解构赋值的关系，参见下文.

解构赋值允许等号左边的模式之中,不放置任何变量名.因此,可以写出非常古怪的赋值表达式.

```javascript
({} = [true,false]);
({} = 'abc');
({} = []);
```

上面的表达式虽然毫无意义,但是语法是合法的,可以执行.

对象的解构赋值,可以很方便地将现有对象的方法,赋值到某个变量.

```javascript
let {log, sin, cos } = Math;
```

上面代码将Math对象的对数,正弦,余弦三个方法,赋值到对应的变量上,使用起来会非常方便.

由于数组本质是特殊的对象,因此可以对数组进行对象属性的解构.

```javascript
let arr = [1,2,3];
let {0 :first,[arr.length - 1] : last} = arr;
first//1
last //3
```

#### 3.字符串的解构赋值

字符串也可以解构赋值,这时因为此时,字符串被转换成了一个类似数组的对象.

```javascript
const [a, b, c, d, e] = 'hello';
a //'h'
b//'e'
c//'l'
d//'l'
e//'o'
```

类似数组的对象都有一个length属性,因此还可以对这个属性解构赋值.

```javascript
let {length:len} = 'hello';
len //5
```

#### 4.数组和布尔值的解构赋值

解构赋值时,如果等号右边时数值和布尔值,则会先转为对象.

```javascript
let {toString :s} = 123;
s === Number.prototype.toString //true

let {toString: s} = true;
s ===Boolean.prototype.toString //true
```

上面代码中,数值和布尔值的包装对象都有toString属性,因此变量s都能取到值.

解构赋值的规则是,只要等号右边的值不是对象或数组,就先将其转为对象.由于undefined和null无法转为对象,所以对它们进行解构赋值,都会报错.

```javascript
let {prop: x} = undefined;// TypeError
let {prop: y} = null;// TypeError
```

#### 5.函数参数的解构赋值

函数的参数也可以使用解构赋值.

```javascript
function add([x,y]){
  return x+y;
}
add([1,2]) //3
```

上面的代码中,函数add的参数表面上是一个数组,但在传入参数的那一刻,数组参数就被解构成变量x和y.对于函数内部的代码来说,他们能感受到的参数就是x和y.

下面是另外一个例子,

```javascript
[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [ 3, 7 ]
```

函数参数的解构也可以使用默认值.

```javascript
function move({x = 0, y = 0} = {}){
  return [x, y ];
}
move({x:3 ,y:8});//[3,8]
move({x:3});//[3,0]
move({});//[0,0]
move();[0,0]
```

上面代码中，函数`move`的参数是一个对象，通过对这个对象进行解构，得到变量`x`和`y`的值。如果解构失败，`x`和`y`等于默认值。

undefined 就会触发函数参数的默认值.

```javascript
[1,undefined, 3].map((x = 'yes') => x);
//[1, "yes", 3]
```

#### 6.圆括号问题

解构赋值虽然很方便,但是解析起来并不容易.对于编译器来说,一个式子到底是模式还是表达式,无法一开始就知道.必须解析到等号才能知道.

由此带来的问题时,如果模式中出现圆括号怎么处理,ES6的规则是,只要有可能导致解构的歧义就不能使用圆括号.

但是,这条规则实际上不那么容易辨别,处理起来相当麻烦,因此建议只要有可能就不要在模式中放置圆括号.

**不能使用圆括号的情况**

- 变量声明语句

```javascript
let [(a)] = [1];
let{x: (c)} = {};
let({x: c}) = {};
let{(x: c)} = {};
let{(x): c} = {};

let { o: ({ p: p})} = { o: { p: 2}};
```

- 函数参数

  函数参数也属于变量声明,因此不能带有圆括号.

  ```javascript
  //报错
  function f([(z)]){return z;}
  //报错
  function f([z,(x)]){return x;}
  ```


- 赋值语句的模式

  ```javascript
  ({ p: a }) = { p: 42 };
  ([a]) = [5];
  ```

  上面代码将整个模式放在圆括号之中，导致报错。

  ```javascript
  [({ p: a }), { x: c }] = [{}, {}];
  ```

  上面代码将一部分模式放在圆括号之中,导致报错.

  **可以使用圆括号的情况**

  可以使用圆括号的情况只有一种:赋值语句的非模式部分,可以使用圆括号.

  ```
  [(b)] = [3];
  ({ p: (d)}) = {};
  [(parseInt.prop)] =[3];

  ```

  上面三行语句都可以正确执行，因为首先它们都是赋值语句，而不是声明语句；其次它们的圆括号都不属于模式的一部分。第一行语句中，模式是取数组的第一个成员，跟圆括号无关；第二行语句中，模式是p，而不是d；第三行语句与第一行语句的性质一致。

#### 7. 用途

变量的解构赋值用途很多

- 交换变量的值

```javascript
let x =1 ;
let y =2 ;
[x,y] = [y,x]
```

上面代码交换变量`x`和`y`的值，这样的写法不仅简洁，而且易读，语义非常清晰。

- 从函数返回多个值

  函数只能返回一个值,如果要返回多个值,只能将它们放在数组或对象里返回.有了解构赋值,取出这些值就非常方便.

  ```javascript
  function example(){
    return [1,2,3]
  }
  let [a,b,c] = example();
  //返回一个对象
  function example(){
    return{
      foo:1,
      bar:2
  };
  }
  let {foo,bar} = example();
  ```


- 函数参数的定义

  结构赋值可以方便地将一组参数与变量名对应起来

  ```javascript
  //参数是一组有次序的值
  function f([x,y,z]){...}
  f([1,2,3]);
  //参数是一组无次序的值
   function f({x,y,z}){...} 
   f({z:3 ,y:2, x:1});
  ```


- 提取JSON数据

  解构赋值对提取JSON对象中的数据,尤其有用

  ```javascript
  let jsonData = {
    id:42,
    status:'ok',
    data:[867,5309]
  };
  let {id, status,data:number} = jsonData;
  console.log(id,status,number);
  ```

  上面的代码可以快速提取JSON数据的值.

- 函数参数的默认值

  ```javascript
  jQuery.ajax = function(url,{
    async = true;
    beforeSend = function(){},
    cache = true,
    complete = function(){},
    crossDomain = false,
    global = true,
  } = {}){
    
  };
  ```

  指定参数的默认值,就避免了在函数体内部在写var foo = config.foo ||'default foo'这样的语句.

- 遍历Map结构

  任何部署了Iterator接口的对象,都可以用for...of循环遍历,Map解构原生支持Iterator接口,配合变量的解构赋值,获取键名和键值就非常方便.

  ```javascript
  const map = new Map();
  map.set('first','hello');
  map.set('second','world');
  for(let [key,value] of map){
    console.log(key+'is'+value);
  }
  ```

  如果只想获取键名,或者只想获取键值,可以写成下面这样.

  ```javascript
  //获取键名
  for(let [key] of map){
    //...
  }
  //获取键值
   for (let [value] of map){
    //...
  }
  ```

- 输入模块的指定方法

  加载模块时,往往需要指定输入哪些方法,解构赋值使得输入语句非常清晰.

  ```javascript
  const {SourceMapConsumer ,SourceNode } = require("source-map");
  ```

  ​