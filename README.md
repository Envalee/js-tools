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

* Datatype Objects (Float, Int, Vector, String, and more...)
* Formatter for easy date strings (Date:Time) or easy number strings (Zerofill)
* Objetmanager for more options to manage data
* Arraymanager to manage arrays easier
* LocalStorageManager to manage local data easier
* Calculator for easy math and to have common functions in one place (average, sum, count, percentage, ...)
* more is comming...

## Usage

To use the tools just include the library in your project and use the `jst` variable in your code to
access all the tools.

#### Examples

```javascript
var value = 100;
var range = new jst.type.math.Range(0,200);
var perentage = new jst.static.Calculator.percent( value , range );
// --> percentage : 50
```

#### Main Parts

* type - Datatypes that JS-Tools provides
  * main - Main Types like Float or Integers
  * math - Math Types like Range or Vectors
  * exceptions - Error handling Object Types
  * names - Reference only for internal usage
  
* static - Ready to use instances which allow direct access to there functionality
  * Formatter - Formating strings and dates
  * TypeChecker - Check build in types or some other type stuff
  * Calculator - Easy math to calculate some common things
  * Dom - HTML Dom manipulation, checks and tools
  * Extra - Some functions which are not clear where to put them but are usefull
 
* classes - Blueprints that can be used as a instance
  * LocalStorageManager - Tool to manage local storage in the browser in a easier way
  * ObjectManager - Holds an Object and mangage it. It allows to store it localy too.
  * ArrayManager - Holds an Array and manage it. It allows to store it localy too.

## Documentation
Wiki link incoming...
