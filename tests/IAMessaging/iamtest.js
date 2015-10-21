/**
 * Created by mkahn on 10/20/15.
 */

var iam = require('../../api/services/IAMessaging');
var util = require('util');

iam._hello();

iam.postMessage('io.overplay.dude',{ msg: "Hello dude"});
iam.postMessage('io.overplay.lad',{ msg: "Hello lad"});
iam.postMessage('io.overplay.wine',{ msg: "Hello wine"});

console.log(util.inspect(iam.getMM()));

console.log(util.inspect(iam.popMessages('io.overplay.lad')));

console.log(util.inspect(iam.getMM()));
