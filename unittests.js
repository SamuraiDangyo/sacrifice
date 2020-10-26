/*
sacrifice. Lightweight JSON library written in vanilla JavaScript
Copyright (C) 2020 Toni Helminen
*/

/*jshint esversion: 6 */

(function(){
'use strict';

function unittestStringify() {
  [true, false, null, 42, 42e4, [null," ",42], [3], [3,"42",42,["42"]], [3,null,42], [[{"key": 42},null,42]], [[333,3,null,[333,3,null]]]]
  .forEach(function(test){if (sacrifice.stringify(test) != JSON.stringify(test)) console.error(sacrifice.stringify(test), "<>", JSON.stringify(test));});
}

function unittestTrim() {
  [' true', 'null ', ' false', ' 42', ' 42.42  ', '[ null ]', '[ true, [ true ] ]', '[ false, false ]', '[ 42 ]', '[ null ]', '[ true ]', '[ false, false ]', '[ 42 ]', '[4,3,{"sss":3},[5],[3,7]]', '{"key" : false}',
    '{"key" : true}', '{"key" : null}', '{"key" : 42}', '{"key" : 42.01}', '{"key" : 4.2e+30}', '{"key" : -4.21e+30}', '{"key" : "value_a"}', '["value_1", "value_2"]',
    '{"key_a" : "value_a", "keyb" : "value_b", "arrays" : ["one", "2", "42"]}', '{"key_a" : {"key_a" : "value_a"}, "keyb" : "value_b"}']
  .forEach(function(test){if (sacrifice.trim(test) != JSON.stringify(JSON.parse(test))) console.error(test, sacrifice.trim(test), "<>", JSON.stringify(JSON.parse(test)));});
}

function unittestParseStringify() {
  [true, false, [false], [[false]], null, 'null', '[null,[null],[null]]', '[true,[true],[true]]', '[42,[42],[42]]', '{"key": 42}']
  .forEach(function(test){if (sacrifice.stringify(sacrifice.parse(test)) != JSON.stringify(JSON.parse(test))) console.error(test, sacrifice.stringify(sacrifice.parse(test)), "<>", JSON.stringify(JSON.parse(test)));});
}

function unittestBadJson() {
  ['[444,   7    77]', '{"sds": 42 "sds": 42}', '[ 3 ] s', '[4,3,3,,]', '[4,3,3,]', '[4,3,{"sss":3,},[5],[3,7]]', 'nulli', '["key_a" : false}', '[false : false]', '{false : false}', '4 7']
  .forEach(function(test){if (sacrifice.validate(test)) console.error(test, sacrifice.validate(test));});
}

function unittestGoodJson() {
  ['" "', '[ 3 ]'].forEach(function(test){if (!sacrifice.validate(test)) console.error(test, sacrifice.validate(test));});
}

sacrifice.unittests = function() {
  unittestStringify();
  unittestTrim();
  unittestParseStringify();
  unittestBadJson();
  unittestGoodJson();
};

})();
