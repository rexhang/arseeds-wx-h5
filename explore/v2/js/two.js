console.log('\n');
console.log('-----------------------');
console.log('two.js');

window.jq.each(['a',2,'c'], (index, item) => console.log(index, item) );

import moduleFunction from './module.js';
var theHref = moduleFunction.getLocationHref();

let personal = ['amliy', 24, 170, '90 60 94'];
var beauty  = new moduleFunction.BeautifulGirl(...personal);
var isChosen = beauty.beChosen();

console.log(theHref);
console.log(isChosen);



