# sacrifice
A simple and lightweight JSON library written in JavaScript

## Examples
Is JSON string valid ?
```sacrifice.isValidJsonStr("[42]");      // true```
```sacrifice.isValidJsonStr("[ 3 ] s");   // false```

Trim JSON string
```sacrifice.trimJson("[42, [ 42  ]]");   // "[42, [ 42  ]]"```

JSON to string
```sacrifice.json2Str([42, {"key": 42}]); // "[42, {"key": 42}]"```

String to JSON
```let sac = sacrifice.str2Json("4 2");   // "sac.errors = true"```

Show version
```sacrifice.version();                   // "sacrifice 1.0"```
