'use strict';


var myApp = angular.module('myApp', ['ngAnimate']);

myApp.value('cardItems', 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra');

myApp.value('matchSize', 2);  // TODO: How many cards in a match. Default its a pair (2).

/////////

myApp.controller('CardsController', cardsController);

cardsController.$inject = ['$timeout', '$scope', 'matchSize', 'cardItems'];

function cardsController ($timeout, $scope, matchSize, cardItems) {

    $scope.turnedCounter = 0;
    $scope.matchedCounter = 0;
    $scope.timer = 0;
    $scope.cards = shuffleArray(getCardNames());
    $scope.click = click;

    ////////////////

    /**
     * Return the list of currently revealed cards.
     */
    function getRevealedCards() {
        return $scope.cards.filter(function(c) { return c.state == 'revealed' });
    }

    /**
     * Checks if a full pair of matching cards is currently revealed.
     * If so, waits for the last card to turn and adds "remove" state
     * to initiate the remove animation.
     */
    function removeIfMatching() {
        const revealedCards = getRevealedCards();
        if (revealedCards.length < matchSize) return false;

        $scope.turnedCounter += 1;
        
        for (let i=1; i<revealedCards.length; i++) {
            if (revealedCards[0].group != revealedCards[i].group) {
                return false;
            }
        }

        $timeout(function(){
            $scope.matchedCounter += 1;
            revealedCards.map(function(c){ c.state = 'remove' });
        }, 800);
        return true;
    }

    function concealAllCards() {
        $scope.cards.map(function(c){ 
            if (c.state == 'revealed') c.state = 'concealed';
        });
    }

    /**
     * Handler for a click on a card.
     */
    function click(card) {
        const revealedCards = getRevealedCards();

        if (revealedCards.length < matchSize) {
            card.state = (card.state != 'revealed') ? 'revealed' : card.state;
            removeIfMatching();
        } else {
            concealAllCards();
        }
    }

    /**
     * Return a list of card objects made from the cardItems names.
     */
    function getCardNames() {
        const items = cardItems.split(' ');
        let names = [];
        for (let i=1; i<=matchSize; i++) {
            names = names.concat(items.map(function(x){
                return {
                    name: x + '-' + i,
                    group: x,
                    state: 'untouched',
                };
            }));
        }
        return names;
    }

    /**
     * Randomly order an array.
     */
    function shuffleArray (arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

}

/////////

