(function() {
    'use strict';
    // globals
    let tileOne;
    let tileTwo;
    let guesses = 0;
    let matchesTillWin = 0;
    let matchCount = 0;
    let counter = 0;
    let showCurrentDiv = true;
    // add listener to start new game button and check for valid number of tiles
    const newGame = document.getElementById('game-button');
    newGame.addEventListener('click', () => {
        const numberOfTiles = document.getElementById('number-of-tiles').value;
        let numberErrorMessage = document.getElementById('number-required');
        // check that numberOfTiles is >= 4 and <= 1000 and is an EVEN number
        if(numberOfTiles < 4 || numberOfTiles > 1000) {
            numberErrorMessage.innerHTML = 'Number of Tiles must be between 4 and 1000.';
            numberErrorMessage.style.display = 'block';
        } else if(numberOfTiles % 2 !== 0) {
            // number is ODD
            numberErrorMessage.innerHTML = 'Number of Tiles must be an \'EVEN\' number.';
            numberErrorMessage.style.display = 'block';
        } else {
            // hide error message
            numberErrorMessage.style.display = 'none';
            // start new game
            startNewGame(numberOfTiles);
        }
    }); // end new game button

    // Create startNewGame function that creates a number of tiles using user input
    function startNewGame(numberOfTiles) {
        counter = 0;
        matchCount = 0;
        guesses = 0;
        let arrayOfTiles = createArrayOfTiles(numberOfTiles);
        let randomizedArray = shuffleArray(arrayOfTiles);
        // set number of matches before you win
        matchesTillWin = numberOfTiles/2;
        // create div tiles
        let arrayOfDivs = createTiles(randomizedArray);
        // add tiles to game
        addDivTiles(arrayOfDivs);
        addListenersToDivs(arrayOfDivs);
        showWinningMessage(false);
        updateStats();
    }
    // load starting game
    startNewGame(document.getElementById('number-of-tiles').value);

    function createArrayOfTiles(numberOfTiles) {
        // create n tiles
        // add double numbers to array, ex: 1,1,2,2,3,3...n/2 
        // return array of tiles
        let arrayOfTiles = [];
        let maxNumber = numberOfTiles/2;
        for(let i = 1; i <= maxNumber; i++){
            arrayOfTiles.push(i);
            arrayOfTiles.push(i);
        }
        return arrayOfTiles;
    }

    function randomNumber(maxNum){
        // return random number between 4 and numberOfTiles
        let min = 0;
        let max = Math.floor(maxNum - 1);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function shuffleArray(array) {
        // take an array and reorder elements randomly
        let randomizedArray = [];
        // get number from random index
        function getEle(ranNum){
            if(array[ranNum] === null){
                return getEle(randomNumber(array.length));
            }
            let index = array[ranNum];
            array[ranNum] = null;
            return index;
        }
        for(let i = 0; i < array.length; i++){
            randomizedArray.push(getEle(randomNumber(array.length)));
        }
        return randomizedArray;
    }
    function createTiles(arrayOfTiles) {
        let arrayOfDivs = [];
        arrayOfTiles.forEach( (num) => {
            let div = document.createElement('div');
            div.className = num + ' tile' ;
            arrayOfDivs.push(div);
        });
        return arrayOfDivs;
    }
    function addDivTiles(arrayOfDivs){
        let game = document.getElementById('game-container');
        // remove all children to start new game
        while(game.firstChild) {
            game.removeChild(game.firstChild);
        }
        // add new children to game
        arrayOfDivs.forEach( item => game.appendChild(item));
    }
    function checkForMatch() {
        // if its a match!
        if(tileOne.className === tileTwo.className) {
            // call function to set current divs className to 'match'
            updateTiles();
            // reset tiles
            tileOne = '';
            tileTwo = '';
    
            matchCount += 1;
        
            if(matchesTillWin === matchCount){
                // winner
                showWinningMessage(true);
            }
        } else {
            tileOne.addEventListener('click', handleClick);
            tileTwo.addEventListener('click', handleClick);
            changeTileBG(tileOne, 'remove');
            changeTileBG(tileTwo, 'remove');
            tileOne.innerHTML = '';
            tileTwo.innerHTML = '';

        }
        showCurrentDiv = true;
        guesses = 0;
    }
    function addListenersToDivs(arrayOfDivs) {
        arrayOfDivs.forEach( div => {
            div.addEventListener('click', handleClick);
        });
    }
    function handleClick(){
        showDiv(this);
        
    }
    function showDiv(div) {
        if(showCurrentDiv){
            // need the first class of div, the value 
            let arrayOfClassnames = div.className.split(' ');
            div.innerHTML = arrayOfClassnames[0];
            changeTileBG(div, 'add');
        }
        if(guesses === 0){
            tileOne = div;
            div.removeEventListener('click', handleClick);
        }
        if(guesses === 1){
            showCurrentDiv = false;
            tileTwo = div;
            div.removeEventListener('click', handleClick);
            setTimeout(checkForMatch, 700);
            guesses += 1;
            counter += 1;
            updateStats();
            return;
        } else {
            guesses += 1;
        }
    }
    function updateTiles() {
        tileOne.className = 'match';
        tileTwo.className = 'match';
    }
    function updateStats() {
        let count = document.getElementById('count');
        count.innerHTML = `Number of Guesses: ${counter}`;
        let minGuesses = document.getElementById('min-guesses');
        minGuesses.innerHTML = `Min. Number of Guesses: ${matchesTillWin}`;
    }
    function showWinningMessage(isTrue) {
        let winner = document.getElementById('winner-message');
        if(isTrue){
            winner.style.display = 'block';
        } else {
            winner.style.display = 'none';
        }
    }
    function changeTileBG(div, command) {
        let arrayOfClassnames = div.className.split(' ');
        if(command === 'add'){
            div.className = arrayOfClassnames[0] + ' currentTile';
        }
        if(command === 'remove'){
            div.className = arrayOfClassnames[0] + ' tile';
        }
        
    }
})();