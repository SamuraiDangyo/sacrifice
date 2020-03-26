## Overview
sacrifice is a simple and lightweight JSON library written in JavaScript

![sacrifice](https://github.com/SamuraiDangyo/sacrifice/blob/master/logo.jpg)

### Examples
Is JSON string valid ?
- ```sacrifice.isValidJsonStr("[42]");      // true```
- ```sacrifice.isValidJsonStr("[ 3 ] s");   // false```

Trim JSON string
- ```sacrifice.trimJson("[42, [ 42  ]]");   // "[42, [ 42  ]]"```

JSON to string
- ```sacrifice.json2Str([42, {"key": 42}]);  // "[42, {"key": 42}]"```
- ```sacrifice.json2Str([42, function(){}]); // undefined ( see: *sacrifice.errorMSg* )```

String to JSON
- ```sacrifice.str2Json("4 2");              // undefined ( see: *sacrifice.errorMSg* )```

Show version
- ```sacrifice.version();                   // "sacrifice 1.0"```
