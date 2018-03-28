

//Class used to represent a card
let Card = function(cssClass, x, y) {
	this.cardClass = cssClass;
	this.xPos = x;
	this.yPos = y;
};

/*
 * Class used to represent the card game.
 */


let MatchingGame = function() {
	let self = this;
	/*
	 * Create a list that holds all of your cards
	 */
	//all possible card positions 4 across, 4 down, 16 in all.
		let cardPositions = [
			[0,0], [0,1], [0,2], [0,3],
			[1,0], [1,1], [1,2], [1,3],
			[2,0], [2,1], [2,2], [2,3],
			[3,0], [3,1], [3,2], [3,3],
		];

	//types of cards to be matched, 8 in all.
		let listOfCardTypes = [
			"fa fa-diamond",
			"fa fa-paper-plane-o",
			"fa fa-anchor",
			"fa fa-bolt",
			"fa fa-cube",
			"fa fa-leaf",
			"fa fa-bicycle",
			"fa fa-bomb"
		];

	//first clicked card
		let firstCard = null;
		
		//second clicked card.
		let secondCard = null;

		//number of moves made in the game.
		let numOfMoves = -1;

		//game rating, declines based on the number of moves.
		let starRating = 3;

		// timmer display 
		//let formattedTime = "00:00:00";

		//overlay that disables clicks
		let overlay = window.document.getElementById("overlay");

		let initializeCardArrays = function(){
			cardPositions = [
					[0,0], [0,1], [0,2], [0,3],
					[1,0], [1,1], [1,2], [1,3],
					[2,0], [2,1], [2,2], [2,3],
					[3,0], [3,1], [3,2], [3,3],
			];
			listOfCardTypes = [
					"fa fa-diamond",
					"fa fa-paper-plane-o",
					"fa fa-anchor",
					"fa fa-bolt",
					"fa fa-cube",
					"fa fa-leaf",
					"fa fa-bicycle",
					"fa fa-bomb"
			];
		};
	/*
	 * Display the cards on the page
	 *   - shuffle the list of cards using the provided "shuffle" method below
	 *   - loop through each card and create its HTML
	 *   - add each card's HTML to the page
	 */
	/*
	 * A list that holds all of the cards
	 */

	let arrayOfCards = [[], [], [], []];
	

	/*
	 * This method initializes array of card objects represented on the screen.
	 */

	let initArrayOfCards = function(cardPositions) {
		for(let i=0, len=listOfCardTypes.length; i<len; i++) {
			let cardType = listOfCardTypes.pop();
			for(let j=0, numOfCards=2; j<numOfCards; j++) {
				let currCardPos = cardPositions.pop();
				let xPos = currCardPos[0];
				let yPos = currCardPos[1];
				let currCard = new Card(cardType, xPos, yPos);
				arrayOfCards[xPos].push(currCard);
			}
		}
	};
	let displayCards = function() {
		let cardHTML = "";
		for(let i=0, len=arrayOfCards.length; i < len; i++) {
			let rowOfCards = arrayOfCards[i];
			for(let j=0, len=rowOfCards.length; j < len; j++) {
				let cssClass = rowOfCards[j].cardClass;
				let cardId = "card_"+i+"_"+j;
				cardHTML += `<li id="${cardId}" data-row="${i}" data-col="${j}" class="flip-container" style="" onclick="this.classList.add('flip');"><div class="flipper">
							<div class="front card"></div><div class="back card ${cssClass}" ></div></div></li>`;
			}
		}
		let cardList = window.document.getElementById("cardList");
		cardList.innerHTML = cardHTML;
		
		let cardArray = window.document.getElementsByTagName("li");
		for(let k=0, len=cardArray.length; k<len; k++) {
			let card = cardArray[k];
			card.addEventListener('click', clickCard, false);
		}
	};

	// Shuffle function from http://stackoverflow.com/a/2450976
	function shuffle(array) {
	    var currentIndex = array.length, temporaryValue, randomIndex;

	    while (currentIndex !== 0) {
	        randomIndex = Math.floor(Math.random() * currentIndex);
	        currentIndex -= 1;
	        temporaryValue = array[currentIndex];
	        array[currentIndex] = array[randomIndex];
	        array[randomIndex] = temporaryValue;
	    }

	    return array;
	}

	let clickCard = function() {
	    let cardItem = this;

	    /* There are 3 scenarios for clickCard.
	     * 1. no cards are clicked. In this case the first card clicked is stored as firstCard. 
	     * 2. 1 card is clicked. In this case the second card clicked is stored as secondCard. 
	     * 3. 2 cards are clicked. Don't store any cards because we're trying to match 2 cards at a time.
	     */

	    if(firstCard === null && secondCard === null) {
	        firstCard = cardItem;
	    } else if(firstCard !== null && secondCard === null) {
	        secondCard = cardItem;

	        //clicking the same card twice should not count as a match.
				if (firstCard === secondCard) {
					secondCard = null;
	    		return;
				}

				//display overlay to prevent user from clicking on more than 2 cards.
				overlay.style.display = "block";

	        window.setTimeout(function() {
	            checkForMatchingCards(secondCard, firstCard);            
	        }, 1000);
	        displayMoves();
	        //make every pair of clicks a move.
	    } else {
	        return;
	    }

	    cardItem.classList.add("open");
	     
	    displayRating();
	    if(elapsedTimeInSeconds === 0)
			myClock = setInterval(displayClock, 1000);
	};
	/*
		 * This method checks if the cards match based on class name.
		 */

		let checkForMatchingCards = function(currClickedCard, prevClickedCard) {
			let cardClass = currClickedCard.children[0].children[1].classList.toString();
			let prevCardClass = prevClickedCard.children[0].children[1].classList.toString();

			prevClickedCard.classList.remove("open");
			currClickedCard.classList.remove("open");		
			
			if(cardClass === prevCardClass) {
				handleMatchingCards(prevClickedCard, currClickedCard);
			} else {
				handleNonMatchingCards(prevClickedCard, currClickedCard);
			}

			checkWinningMove();
			
			firstCard = null;
			secondCard = null;
		};

		let  handleMatchingCards = function(firstMatchedCard, secondMatchedCard) {
				firstMatchedCard.classList.add("rubberband", "animated", "match");
				secondMatchedCard.classList.add("rubberband", "animated", "match");


				window.setTimeout(function() {
					firstMatchedCard.classList.remove("rubberband", "animated");
					secondMatchedCard.classList.remove("rubberband", "animated");
					overlay.style.display = "none";
				}, 1000);
		};

		let  handleNonMatchingCards = function(firstMatchedCard, secondMatchedCard) {
				var cardChild1 = firstMatchedCard.children[0].children[1];
				var cardChild2 = secondMatchedCard.children[0].children[1];			
				firstMatchedCard.classList.add("wobble", "animated");
				secondMatchedCard.classList.add("wobble", "animated");
				cardChild1.classList.add("failed-match");
				cardChild2.classList.add("failed-match");
				firstMatchedCard.classList.remove("flip");
				secondMatchedCard.classList.remove("flip");
				window.setTimeout(function() {
					firstMatchedCard.classList.remove("wobble", "animated", "failed-match");
					secondMatchedCard.classList.remove("wobble", "animated", "failed-match");
					cardChild1.classList.remove("failed-match");
					cardChild2.classList.remove("failed-match");
					overlay.style.display = "none";
				}, 1000);	

		};
		
		let checkWinningMove = function() {
			var numberOfMatchedCards = window.document.getElementsByClassName("match").length;
			if(numberOfMatchedCards === 16)
				displayWinnerScreen();
		};
		
		let displayWinnerScreen = function(){
			let victoryScreen = window.document.getElementById("winner-screen");
			victoryScreen.style.display = "block";
			hideCardListScreen();
			let victoryTemplate = `<h1 class="winnerHeader"> 
						Congratulations! You Won! 					
						<div class="winnerMessage">With ${numOfMoves} moves and ${elapsedTimeInSeconds} seconds With ${starRating} stars Woohoo! </div> 
					</h1> 
				<button class="playAgainButton" onClick="matchingGame.restart()"> Play again! </button>`;
			victoryScreen.innerHTML = victoryTemplate;	
			clearInterval(myClock);
			window.document.getElementById("time").innerText = ("00:00:00");
		};

		let hideCardListScreen = function(){
			let cardListScreen  = window.document.getElementById("cardList");
			cardListScreen.style.display = "none";

		}

		let displayCardListScreen = function(){
			let cardListScreen  = window.document.getElementById("cardList");
			cardListScreen.style.display = "flex";

		}
		
		this.hideWinnerScreen = function(){
			let victoryScreen = window.document.getElementById("winner-screen");
			victoryScreen.style.display = "none";	
		};
		
		let displayMoves = function() {
			numOfMoves++;
			let movesDisplay = window.document.getElementById("moves-counter");
			movesDisplay.innerText = numOfMoves + " Moves";
		};
		
		let displayRating = function() {
			if(numOfMoves <= 20)
				starRating = 3;
			else if((numOfMoves > 20) && (numOfMoves <= 30))
				starRating = 2;
			else
				starRating = 1;

			let ratingHTML = "";
			for(let i=0; i<starRating; i++) {
				ratingHTML += "<li><i class='fa fa-star'></i></li>";		
			}
			let ratingDisplay = window.document.getElementById("rating-display");
			ratingDisplay.innerHTML = ratingHTML;
		};

		let elapsedTimeInSeconds = 0;

		/*
		 * This method keeps time of how long it takes the player to complete the game.
		 */

		let displayClock = function() {
		  elapsedTimeInSeconds++;

		  let seconds = elapsedTimeInSeconds % 60;
		  if(seconds < 10)
			seconds = "0" + seconds;

		  let minutes = Math.floor(elapsedTimeInSeconds / 60);
		  if(minutes < 10)
			minutes = "0" + minutes;
		  else if(minutes >= 60)
			minutes = minutes % 60;

		  let hours = Math.floor(elapsedTimeInSeconds / 3600 );
		  if(hours < 10)
			hours = "0" + hours;

		  formattedTime = hours+" : "+minutes+" : "+seconds;
		  
		  window.document.getElementById("time").innerText = formattedTime;
		};

		this.restart = function(){
			cardPositions = [
				[0,0], [0,1], [0,2], [0,3],
				[1,0], [1,1], [1,2], [1,3],
				[2,0], [2,1], [2,2], [2,3],
				[3,0], [3,1], [3,2], [3,3],
			];	
			listOfCardTypes = [
				"fa fa-diamond",
				"fa fa-paper-plane-o",
				"fa fa-anchor",
				"fa fa-bolt",
				"fa fa-cube",
				"fa fa-leaf",
				"fa fa-bicycle",
				"fa fa-bomb"
			];
			arrayOfCards = [[],[],[],[]];
			startGame();
			window.document.getElementById("time").innerText = "00:00:00";
			self.hideWinnerScreen();
			displayCardListScreen();
		};

		let startGame = function() {
			//console.log('Inside startGame');
			numOfMoves = -1;
			starRating = 3;
			elapsedTimeInSeconds = 0;
			initializeCardArrays();
			let shuffledCardPositions = shuffle(cardPositions);
			initArrayOfCards(shuffledCardPositions);
			displayCards();
			displayMoves();
			displayRating();	
			var restartButton = window.document.getElementById("restart-button");
			restartButton.addEventListener("click", self.restart, false);
		};

		startGame();

		/*
		 * set up the event listener for a card. If a card is clicked:
		 *  - display the card's symbol (put this functionality in another function that you call from this one)
		 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
		 *  - if the list already has another card, check to see if the two cards match
		 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
		 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
		 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
		 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
		 */
		/*
		 * Card class used to represent card on the screen.
		 * each card has a x position, y position and a css class.
		 */
	 };

	 //Initialize and start game
	let matchingGame = new MatchingGame();
