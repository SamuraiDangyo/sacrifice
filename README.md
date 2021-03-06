![sacrifice](https://github.com/SamuraiDangyo/sacrifice/blob/master/logo.jpg)

# Overview
sacrifice. Lightweight JSON library written in vanilla JavaScript

## Installation
All you need is sacrifice.js. No complex build systems. Just ~5kB. Nothing else.
```
<script src="sacrifice.js"></script>
```

## Examples
#### Validate JSON string:
```
sacrifice.validate("[42]");     // true
sacrifice.validate("[ 42 ] s"); // false
```

#### Trim JSON string:
```
sacrifice.trim("[42, [ 42  ]]"); // "[42,[42]]"
```

#### JSON to string:
```
sacrifice.stringify([42, {"key": 42}]);  // "[42, {"key": 42}]"
sacrifice.stringify([42, function(){}]); // undefined ( see: sacrifice.errorMsg )
```

#### String to JSON:
```
sacrifice.parse("42");  // "42"
sacrifice.parse("4 2"); // undefined ( see: sacrifice.errorMsg )
```
