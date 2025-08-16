const gameBtns = document.querySelectorAll(".game-btn");
const gameChoices = [
    {
        name: "rock",
        imagePath: "../images/rock.png",
        emoji: "✊",
        beats: "scissors",
    },
    {
        name: "paper",
        imagePath: "../images/paper.png",
        emoji: "✋",
        beats: "rock",
    },
    {
        name: "scissors",
        imagePath: "../images/scissors.png",
        emoji: "✌️",
        beats: "paper",
    },
];
const playerSide = [...document.querySelector(".player-side").children];
const computerSide = [...document.querySelector(".computer-side").children];
let playerChoices = [];
let computerChoices = [];
let currentInput = 0;
const numberOfInputs = 2;

function* randomChoiceGenerator() {
    while (true) {
        yield gameChoices[Math.floor(Math.random() * gameChoices.length)];
    }
}
const choiceIterator = randomChoiceGenerator();
gameBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        let value = btn.dataset.action;
        getSelections(value);
    });
});
function getSelections(selectionName) {
    playerChoices.push(gameChoices.find((choice) => choice.name === selectionName));
    displaySelections(playerSide[currentInput], playerChoices[currentInput]);
    currentInput++;
    if(currentInput === numberOfInputs) {
        eliminate();
        // disable buttons
        gameBtns.forEach(btn => {
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.5";
        })
        currentInput = 0;
    }
}
function eliminate() {
    computerChoices.push(choiceIterator.next().value);
    computerChoices.push(choiceIterator.next().value);
    for(let i = 0; i < 2; i++) {
        displaySelections(computerSide[i], computerChoices[i]);
    }
    playerSide.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            let otherChoice = playerSide.filter((btn, i) => index !== i);
            otherChoice[0].classList.add("eliminated");
            let value = e.target.dataset.action;
            let chosen = playerChoices.find((choice) => choice.name === value);
            e.target.classList.add("selected");
            // console.log(chosen);
            end(chosen, computerEliminate());
        })
    })
}
function computerEliminate() {
    let lastChoice = computerChoices[Math.floor(Math.random() * 2)];
    let triggered = false;
    computerSide.forEach(choice => {
        let value = choice.dataset.action;
        console.log(value);
        if(value === lastChoice.name) {
            if(triggered) {
                choice.classList.add("eliminated");
            } else {
                choice.classList.add("selected");
                triggered = true;
            }
        }
        else choice.classList.add("eliminated");
    })
    return lastChoice;
}
function end(chosen, computerLastChoice) {
    // console.log(chosen);
    console.log(computerLastChoice);
    console.log(`You ${play(chosen, computerLastChoice)}`);
    showPopup(`You ${play(chosen, computerLastChoice)}`);
}
function displaySelections(element, gameObj) {
    element.appendChild(document.createTextNode(gameObj.emoji));
    element.dataset.action = gameObj.name;
}
function play(playerChoice, compChoice) {
    if (playerChoice.name === compChoice.name) {
        // showPopup("Draw");
        return "Draw";
        return;
    }
    if (isWinner(playerChoice, compChoice)) {
        // showPopup("You Win");
        return "Win";
    } else {
        // showPopup("You Lose");
        return "Lose";
    }
}
function isWinner(player, opponent) {
    return player.beats === opponent.name;

}

function showPopup(msg) {
    const popup = document.querySelector(".popup");
    popup.children[0].textContent = msg;
    popup.classList.add("show");
    setTimeout(() => {
        popup.classList.remove("show");
    }, 2000);
}
