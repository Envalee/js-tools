# JS-Tools [ JavaScript Tools ]

Some helpfull tools for Javascript. It should be as minimal as possible, but as much as possible to be useful. :)

## Installation

Just grab the js-tools.js and include it in your project.
Of course you can use the js-tools.min.js as well.

```html
<!-- Load JS Tools -->
<script type="text/javascript" src="js-tools.js"></script>
```

## Features

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
var value = 100;
var range = new jst.type.Range(0,200);
var perentage = new jst.Calculator.percent( value , range );
console.log(percentage); // --> percentage : 50
```
```javascript
// Exmaple for Formatter
var curdate = new Date(); // -> For example today is 26. Sep. 2018
// param1: the dateobject , param2: iso_format
console.log(jst.Formatter.get_datetimestring(curdate , true)); // --> 2018-09-26 13:30:14 (Year-Month-Day Hour:Minute:Second)
console.log(jst.Formatter.get_datetimestring(curdate)); // --> 26.09.2018 13:30:14 (Day.Month.Year Hour:Minute:Second)
```


#### Main Parts

* type - Datatypes that JS-Tools provides (jst.type.TheTypeName)
  * main - Main Types like Float or Integers
  * math - Math Types like Range or Vectors
  * exceptions - Error handling Object Types
  * names - Reference only for internal usage
  
* static - Ready to use instances which allow direct access to there functionality (jst.TheStaticClassname)
  * Formatter - Formating strings and dates
  * TypeChecker - Check build in types or some other type stuff
  * Calculator - Easy math to calculate some common things
  * Dom - HTML Dom manipulation, checks and tools
  * Extra - Some functions which are not clear where to put them but are usefull
 
* classes - Blueprints that can be used as a instance (jst.classes.TheClassnameForYourInstance)
  * LocalStorageManager - Tool to manage local storage in the browser in a easier way
  * ObjectManager - Holds an Object and mangage it. It allows to store it localy too.
  * ArrayManager - Holds an Array and manage it. It allows to store it localy too.

## Documentation
Wiki link incoming...
