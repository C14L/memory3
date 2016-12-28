'use strict';


var myApp = angular.module('myApp', ['ngAnimate']);

myApp.value('cardItems', 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra');

myApp.value('cardMarks', '1 2');  // Name each card in a match group (default 2 cards per match).

/////////

myApp.controller('CardsController', cardsController);

cardsController.$inject = ['$scope', 'cardMarks', 'cardItems'];

function cardsController ($scope, cardMarks, cardItems) {

    $scope.cards = shuffleArray(getCardNames(cardMarks, cardItems.split(' ')));
    $scope.click = click;

    activate();

    ////////////////

    function activate() { }

    function click(card) {
        card.state = (card.state != 'revealed') ? 'revealed' : 'concealed';
    }

    function getCardNames(marks, items) {
        var names = [];
        marks.split(' ').forEach(function(n){
            names = names.concat(items.map(function(x){
                return {
                    name: x + '-' + n,
                    group: x,
                    state: 'untouched',
                };
            }));
        });
        return names;
    }

    function shuffleArray (arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

}

/////////

