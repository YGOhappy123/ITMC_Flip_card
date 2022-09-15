// Handle sound
class AudioController {
    constructor () {
        this.backgroundMusic = new Audio('./Assets/Audio/creepy.mp3')
        this.flipSound = new Audio('./Assets/Audio/flip.wav')
        this.matchSound = new Audio('./Assets/Audio/match.wav')
        this.gameOverSound = new Audio('./Assets/Audio/gameOver.wav')
        this.victorySound = new Audio('./Assets/Audio/gameOver.wav')
        this.backgroundMusic.volume = 0.5
        this.backgroundMusic.loop = true
    }

    startMusic () {
        this.backgroundMusic.play()
    }

    stopMusic () {
        this.backgroundMusic.pause()
        this.backgroundMusic.currentTime = 0
    }

    flip () {
        this.flipSound.play()
    }

    match () {
        this.matchSound.play()
    }

    victory () {
        this.stopMusic()
        this.victorySound.play()
    }

    gameOver () {
        this.stopMusic()
        this.gameOverSound.play()
    }
}

// Handle game moves
class MixOrMatch {
    constructor (totalTime, cards) {
        this.totalTime = totalTime
        this.cardsArray = cards
        this.timeRemaining = totalTime
        this.timer = document.getElementById('time-ramaining')
        this.ticker = document.getElementById('flip-count')
        this.audioController = new AudioController()
    }

    startGame () {
        this.cardToCheck = null
        this.totalClick = 0
        this.timeRemaining = this.totalTime
        this.matchedList = []
        this.busy = true
        this.timer.innerText = this.totalTime

        // Wait to the transition
        setTimeout(() => {
            this.shuffleCards()
            this.audioController.startMusic()
            this.countDown = this.startCountDown()
            this.busy = false
        },500)

        // Reset the game stage
        this.hideCards()
        this.ticker.innerText = this.totalClick
        this.timer.timeRemaining = this.timeRemaining
    }

    hideCards () {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible')
            card.classList.remove('matched')
        })
    }

    flipCard (card) {
        if (this.flipAble(card)) {
            this.audioController.flip()
            this.totalClick++
            this.ticker.innerText = this.totalClick
            card.classList.add('visible')
        
            // Check for matching pair
            if (this.cardToCheck) {
                this.checkForCardMatch(card)
            } else {
                this.cardToCheck = card
            }
        }
    }

    checkForCardMatch (card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatched(card, this.cardToCheck)
        } else {
            this.cardMisMatched(card, this.cardToCheck)
        }

        this.cardToCheck = null
    }

    cardMatched (card1, card2) {
        this.matchedList.push(card1)
        this.matchedList.push(card2)
        card1.classList.add('matched')
        card2.classList.add('matched')
        this.audioController.match()

        // Check if player got victory
        // Immediately stop the time and wait 2s for cards' dancing effect
        if(this.matchedList.length === this.cardsArray.length) {
            clearInterval(this.countDown)
            setTimeout(() => {
                this.victory()
            },2000)
        }
    } 

    cardMisMatched (card1, card2) {
        this.busy = true

        // Delay 1s for player to remember the cards info before flip them back
        setTimeout (() => {
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false
        },1000)
    }

    getCardType (card) {
        return card.querySelector('.card-value').src
    }

    shuffleCards () {
        const cardsQuantity = this.cardsArray.length
        for (let i = cardsQuantity - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * cardsQuantity)
            this.cardsArray[randomIndex].style.order = i
            this.cardsArray[i].style.order = randomIndex
        }
    }

    flipAble (card) {
        return !this.busy && !this.matchedList.includes(card) && card !== this.cardToCheck
    }

    startCountDown () {
        return setInterval(() => {
            this.timeRemaining --
            this.timer.innerText = this.timeRemaining
            if (this.timeRemaining == 0) {
                this.gameOver()
            }
        }, 1000);
    }

    gameOver () {
        clearInterval(this.countDown)
        this.audioController.gameOver()
        document.getElementById('game-over').classList.add('visible')
    }

    victory () {
        this.audioController.victory()
        document.getElementById('game-victory').classList.add('visible')
    }
}

// Start the game when done loading progress
function ready () {
    const overlays = document.querySelectorAll('.text-overlay')
    const cards = document.querySelectorAll('.card')
    const game = new MixOrMatch(100, cards)

    overlays.forEach(overlay => {
        overlay.onclick = function () {
            overlay.classList.remove('visible')
            game.startGame()
        }
    })

    cards.forEach(card => {
        card.onclick = function () {
            game.flipCard(card)
        }
    })
}

// Check if everything is loaded before starting the game
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready())
} else {
    ready()
}
