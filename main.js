'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', {scope: './'}).then(function(reg) {
        console.log('main.js --> ServiceWorker was installed:', reg);
    }).catch(function(err) {
        console.error('main.js --> ServiceWorker installation error:', err);
    });
} else {
    console.log('main.js --> Browser does not support ServiceWorker.');
}

/////////

var myApp = angular.module('myApp', ['ngAnimate']);

myApp.value('cardItems', 'cat dog elephant giraffe hippo kudu monkey panda pig seal squirrel zebra');

myApp.value('matchSize', 2);  // TODO: How many cards in a match. Default its a pair (2).

/////////

myApp.controller('CardsController', cardsController);

cardsController.$inject = ['$timeout', '$interval', '$scope', 'matchSize', 'cardItems'];

function cardsController ($timeout, $interval, $scope, matchSize, cardItems) {

    activate();

    /////////////////

    function activate() {
        $scope.isFinished = false;
        $scope.isFinishedTurn = false;
        $scope.isFinishedTimer = false;
        $scope.points = 0;
        $scope.turnedCounter = 0;
        $scope.matchedCounter = 0;
        $scope.timer = 0;
        $scope.cards = shuffleArray(getCardNames());
        $scope.click = click;
    }

    $scope.restart = function() {
        console.log('--> should restart() now...');
        activate();
    }

    /**
     * On first click, start timer.
     */
    let _timerPromise;
    function startTimer() {
        if (!_timerPromise) {
            _timerPromise = $interval(function(){ $scope.timer += 1; }, 1000);
        }
    }
    function stopTimer() {
        if (_timerPromise) {
            $interval.cancel(_timerPromise);
            _timerPromise = undefined;
        }
    }

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

            if ($scope.matchedCounter >= ($scope.cards.length/2)) {
                stopTimer();

                $scope.isFinished = true;
                $timeout(function() { $scope.isFinishedTurn = true; }, 1000);
                $timeout(function() { $scope.isFinishedTimer = true; }, 2000);
                $timeout(function() {
                    $scope.points = Math.floor(($scope.cards.length * 10) - (($scope.timer / 10) + ($scope.turnedCounter * 4)));
                }, 3000);
            }
        }, 800);
        return true;
    }

    /*

For example: 
  - 24 cards
  - 28 turns
  - 77 seconds
  - 10 points per card
  
--> 24 cards x 10 ppc = 240 points
--> (77 seconds / 10) + (28 turns x 4) = 119 penalty points.
--> 240 points - 119 points = 121 points

     */

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
        
        startTimer();

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
