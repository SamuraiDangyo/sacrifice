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

//
// Consts
//

const NAME                    = "sacrifice";
const VERSION                 = "1.02";
const AUTHOR                  = "Toni Helminen";

const TOKEN_ID_LEFT_BRACE     = 0;  // {
const TOKEN_ID_RIGHT_BRACE    = 1;  // }
const TOKEN_ID_LEFT_BRACKET   = 2;  // [
const TOKEN_ID_RIGHT_BRACKET  = 3;  // ]
const TOKEN_ID_COLON          = 4;  // :
const TOKEN_ID_COMMA          = 5;  // ,
const TOKEN_ID_NULL           = 6;  // null
const TOKEN_ID_TRUE           = 7;  // true
const TOKEN_ID_FALSE          = 8;  // false
const TOKEN_ID_NUMBER         = 9;  // 3.22
const TOKEN_ID_STRING         = 10; // "lorem ipsum"
//const TOKEN_ID_ARRAY          = 11; // [...]
//const TOKEN_ID_OBJECT         = 12; // {...}

const TOKEN_TUPLES            = [
                                  [TOKEN_ID_LEFT_BRACKET,  "["],
                                  [TOKEN_ID_RIGHT_BRACKET, "]"],
                                  [TOKEN_ID_LEFT_BRACE,    "{"],
                                  [TOKEN_ID_RIGHT_BRACE,   "}"],
                                  [TOKEN_ID_COMMA,         ","],
                                  [TOKEN_ID_COLON,         ":"]
                                ];

const NUMBER_RE               = /[-+]?\d*\.?\d+([eE][-+]?\d+)|[+-]?\d*\.?\d+/; // [1.22, 2.2+e5, -2.20+E5, ...]

//
// Error handling
//

class MyError {
  constructor() {
    sacrifice.errors   = false;
    sacrifice.errorMsg = 0;
  }

  error(msg = "Errors") {
    sacrifice.errors   = true;
    sacrifice.errorMsg = msg;
    return this;
  }
}

//
// Tokenizer
//

class Tokenizer extends MyError {
  constructor(str) {
    super();
    this.tokens  = [];
    this.counter = 0;
    this.str     = str;
  }

  add(tokenId, tokenValue = 0) {
    this.tokens.push({tokenId: tokenId, tokenValue: tokenValue});
  }

  tokenOne() {
    for (const tuple of TOKEN_TUPLES)
      if (tuple[1] === this.str[this.counter]) {
        this.counter++;
        this.add(tuple[0], tuple[1]);
        return true;
      }
    return false;
  }

  tokenString() {
    if (this.str[this.counter] == "\"") {
      this.counter++;
      let str = "";

      while (this.counter < this.str.length) {
        const ch = this.str[this.counter];
        this.counter++;
        if (ch == "\"") {
          this.add(TOKEN_ID_STRING, str);
          break;
        }
        str += ch;
      }
      return true;
    }
    return false;
  }

  tokenWhitespace() {
    if (/^\s/.test(this.str[this.counter])) {
      this.counter++;
      return true;
    }
    return false;
  }

  tokenNull() {
    if (/^null/.test(this.str.slice(this.counter))) {
      this.counter += 4;
      this.add(TOKEN_ID_NULL, "null");
      return true;
    }

    return false;
  }

  tokenTrue() {
    if (/^true/.test(this.str.slice(this.counter))) {
      this.counter += 4;
      this.add(TOKEN_ID_TRUE, "true");
      return true;
    }
    return false;
  }

  tokenFalse() {
    if (/^false/.test(this.str.slice(this.counter))) {
      this.counter += 5;
      this.add(TOKEN_ID_FALSE, "false");
      return true;
    }
    return false;
  }

  tokenNumber() {
    const res = NUMBER_RE.exec(this.str.slice(this.counter));
    if (res !== null) {
      this.add(TOKEN_ID_NUMBER, res[0]);
      this.counter += res[0].length;
      return true;
    }
    return false;
  }

  trim() {
    let str = "";
    for (let i = 0; i < this.tokens.length; i++) {
      switch (this.tokens[i].tokenId) {
        case TOKEN_ID_STRING : str += `"${this.tokens[i].tokenValue}"`; break;
        case TOKEN_ID_NULL   : str += "null"; break;
        default              : str += this.tokens[i].tokenValue; break;
      }
    }
    return str;
  }

  debugTokens() {
    for (let i = 0; i < this.tokens.length; i++)
      console.log(i, this.tokens[i]);
  }

  parse() {
    if (typeof this.str !== "string") this.error("Illegal input");

    while (this.counter < this.str.length && ! sacrifice.errors) {
      if (this.tokenWhitespace() || this.tokenNull() || this.tokenTrue() || this.tokenFalse() || this.tokenOne() || this.tokenString() || this.tokenNumber()) continue;
      this.error(`Illegal character: '${this.str[this.counter]}'`);
    }

    return ! sacrifice.errors;
  }
}

//
// Parser
//

class Parser extends MyError {
  constructor(str) {
    super();

    this.position  = 0;
    this.result    = 0;
    this.tokenizer = new Tokenizer(str);
    this.tokenizer.parse();
    this.tokens    = this.tokenizer.tokens;
  }

  peek(tokenId, index = 0) {
    return this.position + index < this.tokens.length && this.tokens[this.position + index].tokenId == tokenId;
  }

  expect(tokenId) {
    if ( ! this.good() || this.current().tokenId !== tokenId)
      this.error(`Expected: '${tokenId}' but found: '${this.current().tokenValue}'`);
  }

  good() {
    return this.position < this.tokens.length;
  }

  current() {
    return this.tokens[this.position];
  }

  step() {
    this.position++;
  }

  createObject() {
    if (sacrifice.errors) return this;

    let obj       = {};
    let commaOpen = false;

    this.expect(TOKEN_ID_LEFT_BRACE);
    this.step();

    while (this.good()) {
      if (sacrifice.errors) return this;

      if (this.peek(TOKEN_ID_RIGHT_BRACE)) {
        if (commaOpen)
          return this.error(`Illegal token`);
        this.step();
        return obj;
      }

      this.expect(TOKEN_ID_STRING);
      const key = this.current().tokenValue;
      this.step();

      this.expect(TOKEN_ID_COLON);
      this.step();

      commaOpen = false;

      if (this.peek(TOKEN_ID_TRUE)) {
        obj[key] = true;
        this.step();
      } else if (this.peek(TOKEN_ID_FALSE)) {
        obj[key] = false;
        this.step();
      } else if (this.peek(TOKEN_ID_NULL)) {
        obj[key] = null;
        this.step();
      } else if (this.peek(TOKEN_ID_STRING)) {
        obj[key] = this.current().tokenValue;
        this.step();
      } else if (this.peek(TOKEN_ID_NUMBER)) {
        obj[key] = parseFloat(this.current().tokenValue);
        this.step();
      } else {
        obj[key] = this.parseTokens();
      }

      if (this.peek(TOKEN_ID_COMMA)) {
        commaOpen = true;
        this.step();
      }
    }

    return this.error("Illegal");
  }

  createArray() {
    if (sacrifice.errors) return this;

    let array     = [];
    let commaOpen = false;

    this.expect(TOKEN_ID_LEFT_BRACKET);
    this.step();

    while (this.good()) {
      if (this.peek(TOKEN_ID_RIGHT_BRACKET)) {
        if (commaOpen) return this.error(`Illegal token`);
        this.step();
        return array;
      }

      commaOpen = false;

      if (this.peek(TOKEN_ID_NULL)) {
        array.push(null);
        this.step();
      } else if (this.peek(TOKEN_ID_FALSE)) {
        array.push(false);
        this.step();
      }  else if (this.peek(TOKEN_ID_TRUE)) {
        array.push(true);
        this.step();
      } else if (this.peek(TOKEN_ID_STRING)) {
        array.push(this.current().tokenValue);
        this.step();
      } else if (this.peek(TOKEN_ID_NUMBER)) {
        array.push(parseFloat(this.current().tokenValue));
        this.step();
      } else if (this.peek(TOKEN_ID_LEFT_BRACE)) {
        array.push(this.createObject());
      } else if (this.peek(TOKEN_ID_LEFT_BRACKET)) {
        array.push(this.createArray());
      } else {
        return this.error(`Illegal token`);
      }

      if (this.peek(TOKEN_ID_COMMA)) {
        commaOpen = true;
        this.step();
      }
    }

    return this.error(`Illegal token`);
  }

  parseTokens() {
    if (sacrifice.errors) return this;

    if (this.peek(TOKEN_ID_LEFT_BRACE))   {const obj   = this.createObject(); return sacrifice.errors ? this : obj;}
    if (this.peek(TOKEN_ID_LEFT_BRACKET)) {const array = this.createArray();  return sacrifice.errors ? this : array;}

    if (this.peek(TOKEN_ID_TRUE))  {this.step(); return true;}
    if (this.peek(TOKEN_ID_FALSE)) {this.step(); return false;}
    if (this.peek(TOKEN_ID_NULL))  {this.step(); return null;}

    if (this.peek(TOKEN_ID_STRING)) {const res = this.current().tokenValue;             this.step(); return res;}
    if (this.peek(TOKEN_ID_NUMBER)) {const res = parseFloat(this.current().tokenValue); this.step(); return res;}

    return this.error("Illegal JSON");
  }

  parse(str) {
    if (sacrifice.errors) return false;
    this.result = this.parseTokens();
    if (this.position < this.tokens.length) this.error("Illegal JSON");
    return ! sacrifice.errors;
  }
}

//
// JSON to String
//

class Stringifier extends MyError {
  constructor(json) {
    super();
    this.json   = json;
    this.result = 0;
  }

  createObject(obj) {
    let str      = "{";
    let moreKeys = false;
    const keys   = Object.keys(obj);

    for (const key of keys) {
      str      += (moreKeys ? "," : "") + `"${key}":` + this.convert(obj[key]);
      moreKeys  = true;
    }

    return str + "}";
  }

  createArray(array) {
    let str      = "[";
    let moreKeys = false;

    for (let i = 0; i < array.length; i++) {
      str += (moreKeys ? "," : "") + this.convert(array[i]);
      moreKeys = true;
    }

    return str + "]";
  }

  convert(val) {
    if (val === null)           return "null";
    if (val === false)          return "false";
    if (val === true)           return "true";
    if (Array.isArray(val))     return this.createArray(val);
    if (typeof val == "number") return val;
    if (typeof val == "object") return this.createObject(val);
    if (typeof val == "string") return `"${val}"`;

    return this.error("Illegal JSON object");
  }

  parse() {
    this.result = this.convert(this.json);
    return ! sacrifice.errors;
  }
}

//
// Helper functions
//

function trim(str) {
  const tokenizer = new Tokenizer(str);
  return tokenizer.parse() ? tokenizer.trim() : undefined;
}

function parse(str) {
  if (Array.isArray(str)) return parse(str[0]);
  if (typeof str != "string") return str;

  const parser = new Parser(str);
  return parser.parse() ? parser.result : undefined;
}

function stringify(json) {
  const stringifier = new Stringifier(json);
  return stringifier.parse() ? stringifier.result : undefined;
}

function validate(str) {
  const parser = new Parser(str);
  return parser.parse();
}

//
// Expose objects to the world
//

const sacrifice     = {errors: false, errorMsg: 0};

sacrifice.stringify = stringify;
sacrifice.trim      = trim;
sacrifice.parse     = parse;
sacrifice.validate  = validate;
sacrifice.version   = function() {return `${NAME} ${VERSION} by ${AUTHOR}`;};
sacrifice.Parser    = Parser; // contains .tokenizer

window.sacrifice    = sacrifice;

})();
