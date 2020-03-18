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

const GOOD = [
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

const BAD = [
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

const EVEN_BETTER = [
  [[3],                       '[3]'],
  [[3,null,42],               '[3,null,42]'],
  [[{"key": 42},null,42],     '[{"key": 42},null,42]'],
  [[333,3,null,[333,3,null]], '[333,3,null,[333,3,null]]']
];

sacrifice.unittests = function() {
  //console.log(sacrifice.isValidJsonStr("[4,3,3,[5],[7]]")); return;
  //console.log(  sacrifice.json2Str(sacrifice.str2Json("42e+30").result)  );
  //console.log(  sacrifice.json2Str([3])  );

  for (const test of GOOD)
    if (sacrifice.trimJson(test) !== sacrifice.trimJson(sacrifice.json2Str(sacrifice.str2Json(test).result))) {
      console.log("ERRORS: Unit tests:", test);
      return false;
    }

  for (const test of GOOD)
    if ( ! sacrifice.isValidJsonStr(test)) {
      console.log("ERRORS: Unit tests:", test);
      return false;
    }

  for (const test of BAD)
    if (sacrifice.isValidJsonStr(test)) {
      console.log("ERRORS: Unit tests:", test);
      return false;
    }

  for (const test of EVEN_BETTER)
    if (sacrifice.json2Str(test[0]) != test[1]) {
      console.log("ERRORS: Unit tests:", test[1]);
      return false;
    }

  return true;
};

})();
