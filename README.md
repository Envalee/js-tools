
<img src="https://github.com/Envalee/js-tools/blob/master/img/icon.svg" alt="logo" width="96">

# JS-Tools [ JavaScript Tools ] - Version 0.1

Some helpfull tools for Javascript. It should be as minimal as possible, but as much as possible to be useful. :)

## Installation

Just grab the js-tools.js and include it in your project.
Of course you can use the js-tools.min.js as well.

```html
<!-- Load JS Tools -->
<script type="text/javascript" src="js-tools.js"></script>
```

## Features

<img src="https://github.com/Envalee/js-tools/blob/master/img/overview.svg" alt="logo" width="920">

* Datatype Objects (Float, Int, Vector, String, and more to be a little bit like TypeScript without big build tools)
* Formatter for easy date strings (Date : Time) or easy number strings (Zerofill)
* Objetmanager for more options to manage data
* Arraymanager to manage arrays easier
* LocalStorageManager to manage local data easier
* Calculator for easy math and to have common functions in one place (average, sum, count, percentage, ...)
* Utility functions to wait until something happens or to get a random hex ID and more...
* more is comming...

## Usage

To use the tools just include the library in your project and use the `jst` variable in your code to
access all the tools.

#### Examples

```javascript
// Exmaple for Calculator
var value = new jst.type.Float(100);
var range = new jst.type.Range(0,200);
var perentage = new jst.Calculator.percent( value , range );
console.log(percentage); // --> percentage : 50
```

```javascript
// Exmaple for Formatter
var mydate = new Date('2018-05-01 13:30:14'); // -> For example 01. May. 2018 at 13:30 and 14 seconds
// param1: the dateobject , param2: iso_format -- param1 and param2 are optional. Default is curent date
console.log(jst.Formatter.get_datetimestring(mydate , true)); // --> 2018-05-01 13:30:14 (Year-Month-Day Hour:Minute:Second)
console.log(jst.Formatter.get_datetimestring(mydate)); // --> 01.05.2018 13:30:14 (Day.Month.Year Hour:Minute:Second)
```

```javascript
// Exmaple for Dom helper
var dom_boxes = jst.Dom.get('.boxes'); // <-- Select all HTML Elements with class 'boxes'
// dom_boxes = array with all HTML Elements / Nodes
for(var i in dom_boxes) jst.Dom.add_class('active' , dom_boxes[i]); // Add class "active" to the node elements
```

```javascript
// Exmaple for the Checker
var x = 1;
var y = null;
// return false if is null or undefined
jst.Checker.isset(x); // true
jst.Checker.isset(y); // false
jst.Checker.isset(z); // false

// Another Example
var a = 'my-string';
var b = '';
var c = {};
var d = null;
var e = false;
jst.Checker.is_empty(a); // false
jst.Checker.is_empty(b); // true
jst.Checker.is_empty(c); // true
jst.Checker.is_empty(d); // true
jst.Checker.is_empty(e); // false
```

#### Main Parts

* type - Datatypes that JS-Tools provides (jst.type.TheTypeName)
  * main - Main Types like Float or Integers
  * math - Math Types like Range or Vectors
  * exceptions - Error handling Object Types
  * names - Reference only for internal usage
  
* static - Ready to use instances which allow direct access to there functionality (jst.TheStaticClassname)
  * Formatter - Formating strings and dates
  * Checker - Check build in types or some other type stuff
  * Calculator - Easy math to calculate some common things
  * Dom - HTML Dom manipulation, checks and tools
  * Extra - Some functions which are not clear where to put them but are usefull
 
* classes - Blueprints that can be used as a instance (jst.classes.TheClassnameForYourInstance)
  * LocalStorageManager - Tool to manage local storage in the browser in a easier way
  * ObjectManager - Holds an Object and mangage it. It allows to store it localy too.
  * ArrayManager - Holds an Array and manage it. It allows to store it localy too.

## Documentation
https://github.com/Envalee/js-tools/wiki
