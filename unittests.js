/*
sacrifice, a simple and lightweight JSON library written in JavaScript
Copyright (C) 2020 Toni Helminen

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/*jshint esversion: 6 */

(function(){
'use strict';

const TRIM_GOOD_JSON_STR = [
  '[null," ",42]',
  'null',
  '{"key":true}',
  '{"key":null}',
  '{"key":42}',
  '{"key":42.0}'
];

const GOOD_JSON_STR = [
  '42e+30',
  'true',
  'null',
  'false',
  '42',
  '[ null ]',
  '[ true ]',
  '[ false, false ]',
  '[ 42 ]',
  '[ +4.2E-2 ]',
  '[4,3,{"sss":3},[5],[3,7]]',
  '{"key" : false}',
  '{"key" : true}',
  '{"key" : null}',
  '{"key" : 42}',
  '{"key" : 42.0}',
  '{"key" : 42e+30}',
  '{"key" : -42.1E+30}',
  '{"key" : "value_a"}',
  '["value_1", "value_2"]',
  '{"key_a" : "value_a", "keyb" : "value_b", "arrays" : ["one", "2", "42"]}',
  '{"key_a" : {"key_a" : "value_a"}, "keyb" : "value_b"}'
];

const BAD_JSON_STR = [
  '[ 3 ] s',
  '[4,3,3,,]',
  '[4,3,3,]',
  '[4,3,{"sss":3,},[5],[3,7]]',
  'nulli',
  '["key_a" : false}',
  '[false : false]',
  '{false : false}',
  '4 5',
];

const JSON_TO_STRING = [
  [[null," ",42],             '[null," ",42]'],
  [[3],                       '[3]'],
  [[3,"42",42,["42"]],        '[3,"42",42,["42"]]'],
  [[3,null,42],               '[3,null,42]'],
  [[{"key": 42},null,42],     '[{"key": 42},null,42]'],
  [[333,3,null,[333,3,null]], '[333,3,null,[333,3,null]]']
];

function tokenizerUnittest() {
  let tokenizer = new sacrifice.Tokenizer("null");
  if (tokenizer.justParse().errors)
    console.log("ERROR: ", tokenizer.errorMsg);
}

function parserUnittest() {
  let parser = new sacrifice.Parser("null");
  if (parser.justParse().errors)
    console.log("ERROR: ", parser.errorMsg);
}

function jsonifierUnittest() {
  let jsonifier = new sacrifice.Jsonifier([42, function(){}]);
  if ( ! jsonifier.justParse().errors)
    console.log("ERROR: ", jsonifier, jsonifier.errorMsg);
}

function json2StrUnittest() {
  for (const test of JSON_TO_STRING)
    if (sacrifice.json2Str(test[0]) != test[1])
      console.log("ERROR: ", sacrifice.json2Str(test), test[1]);
}

function isValidJsonGoodUnittest() {
  for (const test of GOOD_JSON_STR)
    if ( ! sacrifice.isValidJsonStr(test))
      console.log("ERROR: ", sacrifice.isValidJsonStr(test), test);
}

function isValidJsonBadUnittest() {
  for (const test of BAD_JSON_STR)
    if (sacrifice.isValidJsonStr(test))
      console.log("ERROR: ", sacrifice.isValidJsonStr(test), test);
}

function trimJsonUnittest() {
  for (const test of TRIM_GOOD_JSON_STR)
    if (sacrifice.trimJson(test) != test)
      console.log("ERROR: ", sacrifice.trimJson(test), test);
}

sacrifice.unittests = function() {

  tokenizerUnittest();
  parserUnittest();
  jsonifierUnittest();

  json2StrUnittest();
  isValidJsonGoodUnittest();
  isValidJsonBadUnittest();
  trimJsonUnittest();

};

})();
