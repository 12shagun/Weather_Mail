const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependancies = [
    ['_','lodash'],
    ['mongoose','mongoose'],
    ['passport','passport'], 
    ['async','async'],
    
];

simpleDependancies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname,'/controllers'));

container.register('container',function(){
    return container;
});

module.exports = container;