const getJSON = require('get-json');
var jsonfile = require('jsonfile');
var fileE = './trivia/triviaEasy.json';
var fileM = './trivia/triviaMedium.json';
var fileH = './trivia/triviaHard.json';

var easyQs = [];
var hardQs = [];
var mediumQs = [];

var exports = module.exports = {};


exports.goGetTrivia = function(triviaCategory){

  let webAddressEasy = "https://opentdb.com/api.php?amount=5&category="+ triviaCategory + "&difficulty=easy&type=multiple";
  let webAddressMed = "https://opentdb.com/api.php?amount=5&category="+triviaCategory+"&difficulty=medium&type=multiple";
  let webAddressHard = "https://opentdb.com/api.php?amount=5&category="+triviaCategory+"&difficulty=hard&type=multiple";

 getJSON(webAddressEasy,function(error, response){
    easyQs = easyQs.concat(response.results);
    // jsonfile.writeFile(fileE, obj, {flag: 'a'}, function (err) {
    //   if(err){console.error(err)};
    // })
  });

  getJSON(webAddressMed,function(error, response){
    mediumQs = mediumQs.concat(response.results);
    // jsonfile.writeFile(fileM, obj, {flag: 'a'}, function (err) {
    //   if(err){console.error(err)};
    // })
  });

  getJSON(webAddressHard,function(error, response){
    hardQs = hardQs.concat(response.results);
    // jsonfile.writeFile(fileH, obj, {flag: 'a'}, function (err) {
    //   if(err){console.error(err)};
    // })
  });


}

exports.returnTrivia = function(){
  return([easyQs, hardQs, mediumQs]);
}
