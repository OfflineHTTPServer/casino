"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Coins, RotateCcw, TrendingUp } from "lucide-react"

interface PlayingCard {
    suit: "♠" | "♥" | "♦" | "♣"
    value: string
    numericValue: number
    id: string
}

interface GameState {
    playerHand: PlayingCard[]
    dealerHand: PlayingCard[]
    deck: PlayingCard[]
    playerScore: number
    dealerScore: number
    gameStatus: "betting" | "playing" | "dealer-turn" | "game-over"
    result: string
    playerMoney: number
    currentBet: number
    isDealing: boolean
}

const suits: ("♠" | "♥" | "♦" | "♣")[] = ["♠", "♥", "♦", "♣"]
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function createDeck(): PlayingCard[] {
    const deck: PlayingCard[] = []
    suits.forEach((suit) => {
        values.forEach((value) => {
            let numericValue = Number.parseInt(value)
            if (value === "A") numericValue = 11
            else if (["J", "Q", "K"].includes(value)) numericValue = 10

            deck.push({
                suit,
                value,
                numericValue,
                id: `${suit}-${value}-${Math.random()}`,
            })
        })
    })
    return shuffleDeck(deck)
}

function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
    const newDeck = [...deck]
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
}

function calculateScore(hand: PlayingCard[]): number {
    let score = 0
    let aces = 0

    hand.forEach((card) => {
        if (card.value === "A") {
            aces++
            score += 11
        } else {
            score += card.numericValue
        }
    })

    while (score > 21 && aces > 0) {
        score -= 10
        aces--
    }

    return score
}

function PlayingCardComponent({
    card,
    isHidden = false,
    delay = 0,
}: {
    card: PlayingCard
    isHidden?: boolean
    delay?: number
}) {
    const isRed = card.suit === "♥" || card.suit === "♦"

    return (
        <div
            className="relative w-16 h-24 sm:w-20 sm:h-28 transition-all duration-500 ease-out hover:scale-105"
            style={{
                animationDelay: `${delay}ms`,
                animation: "slideIn 0.6s ease-out forwards",
            }}
        >
            <div
                className={`w-full h-full rounded-lg border-2 shadow-lg transition-all duration-300 ${isHidden
                    ? "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-700"
                    : "bg-white border-gray-200 hover:shadow-xl"
                    }`}
            >
                {isHidden ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-blue-400 rounded-full opacity-30"></div>
                    </div>
                ) : (
                    <div className="p-1.5 sm:p-2 h-full flex flex-col justify-between relative overflow-hidden">
                        {/* Top left corner */}
                        <div className={`text-xs sm:text-sm font-bold leading-none ${isRed ? "text-red-500" : "text-gray-800"}`}>
                            <div>{card.value}</div>
                            <div className="text-sm sm:text-base leading-none">{card.suit}</div>
                        </div>

                        {/* Center symbol */}
                        <div className={`text-xl sm:text-2xl self-center ${isRed ? "text-red-500" : "text-gray-800"}`}>
                            {card.suit}
                        </div>

                        {/* Bottom right corner (rotated) */}
                        <div
                            className={`text-xs sm:text-sm font-bold leading-none self-end transform rotate-180 ${isRed ? "text-red-500" : "text-gray-800"}`}
                        >
                            <div>{card.value}</div>
                            <div className="text-sm sm:text-base leading-none">{card.suit}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function BlackjackGame() {
    const [gameState, setGameState] = useState<GameState>({
        playerHand: [],
        dealerHand: [],
        deck: createDeck(),
        playerScore: 0,
        dealerScore: 0,
        gameStatus: "betting",
        result: "",
        playerMoney: 1000,
        currentBet: 0,
        isDealing: false,
    })

    const [dealingIndex, setDealingIndex] = useState(0)

    useEffect(() => {
        const playerScore = calculateScore(gameState.playerHand)
        const dealerScore = calculateScore(gameState.dealerHand)

        setGameState((prev) => ({
            ...prev,
            playerScore,
            dealerScore,
        }))

        // Check for blackjack or bust
        if (gameState.gameStatus === "playing") {
            if (playerScore > 21) {
                endGame("bust")
            } else if (playerScore === 21 && gameState.playerHand.length === 2) {
                if (dealerScore === 21 && gameState.dealerHand.length === 2) {
                    endGame("push")
                } else {
                    setGameState((prev) => ({ ...prev, gameStatus: "dealer-turn" }))
                    setTimeout(() => dealerPlay(), 1000)
                }
            }
        }
    }, [gameState.playerHand, gameState.dealerHand])

    const placeBet = (amount: number) => {
        if (amount <= gameState.playerMoney) {
            setGameState((prev) => ({
                ...prev,
                currentBet: amount,
                playerMoney: prev.playerMoney - amount,
                gameStatus: "playing",
                isDealing: true,
            }))
            dealInitialCards()
        }
    }

    const dealInitialCards = () => {
        const newDeck = [...gameState.deck]
        const playerHand: PlayingCard[] = []
        const dealerHand: PlayingCard[] = []

        // Deal cards with animation timing
        setTimeout(() => {
            playerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, playerHand: [...playerHand], deck: newDeck }))
        }, 200)

        setTimeout(() => {
            dealerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, dealerHand: [...dealerHand], deck: newDeck }))
        }, 600)

        setTimeout(() => {
            playerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, playerHand: [...playerHand], deck: newDeck }))
        }, 1000)

        setTimeout(() => {
            dealerHand.push(newDeck.pop()!)
            setGameState((prev) => ({
                ...prev,
                dealerHand: [...dealerHand],
                deck: newDeck,
                isDealing: false,
            }))
        }, 1400)
    }

    const hit = () => {
        if (gameState.gameStatus === "playing" && gameState.deck.length > 0) {
            const newDeck = [...gameState.deck]
            const newCard = newDeck.pop()!

            setGameState((prev) => ({
                ...prev,
                playerHand: [...prev.playerHand, newCard],
                deck: newDeck,
            }))
        }
    }

    const stand = () => {
        setGameState((prev) => ({ ...prev, gameStatus: "dealer-turn" }))
        setTimeout(() => dealerPlay(), 500)
    }

    const dealerPlay = () => {
        const dealerTurn = () => {
            setGameState((prev) => {
                const dealerScore = calculateScore(prev.dealerHand)

                if (dealerScore < 17) {
                    const newDeck = [...prev.deck]
                    const newCard = newDeck.pop()!

                    setTimeout(() => {
                        setGameState((current) => ({
                            ...current,
                            dealerHand: [...current.dealerHand, newCard],
                            deck: newDeck,
                        }))
                    }, 100)

                    return prev
                } else {
                    // Dealer stands - determine winner
                    const playerScore = calculateScore(prev.playerHand)
                    let result = ""

                    if (dealerScore > 21) {
                        result = "dealer-bust"
                    } else if (playerScore > dealerScore) {
                        result = "win"
                    } else if (playerScore < dealerScore) {
                        result = "lose"
                    } else {
                        result = "push"
                    }

                    setTimeout(() => endGame(result), 1000)
                    return prev
                }
            })
        }

        // Start dealer turn sequence
        setTimeout(() => {
            const checkAndContinue = () => {
                setGameState((prev) => {
                    const currentDealerScore = calculateScore(prev.dealerHand)

                    if (currentDealerScore < 17) {
                        // Dealer needs another card
                        const newDeck = [...prev.deck]
                        const newCard = newDeck.pop()!

                        const newHand = [...prev.dealerHand, newCard]
                        const newScore = calculateScore(newHand)

                        // Schedule next check
                        setTimeout(() => {
                            if (newScore < 17) {
                                checkAndContinue()
                            } else {
                                // Dealer is done, determine winner
                                const playerScore = calculateScore(prev.playerHand)
                                let result = ""

                                if (newScore > 21) {
                                    result = "dealer-bust"
                                } else if (playerScore > newScore) {
                                    result = "win"
                                } else if (playerScore < newScore) {
                                    result = "lose"
                                } else {
                                    result = "push"
                                }

                                setTimeout(() => endGame(result), 1000)
                            }
                        }, 1500)

                        return {
                            ...prev,
                            dealerHand: newHand,
                            deck: newDeck,
                        }
                    } else {
                        // Dealer stands immediately
                        const playerScore = calculateScore(prev.playerHand)
                        let result = ""

                        if (currentDealerScore > 21) {
                            result = "dealer-bust"
                        } else if (playerScore > currentDealerScore) {
                            result = "win"
                        } else if (playerScore < currentDealerScore) {
                            result = "lose"
                        } else {
                            result = "push"
                        }

                        setTimeout(() => endGame(result), 1000)
                        return prev
                    }
                })
            }

            checkAndContinue()
        }, 500)
    }

    const endGame = (result: string) => {
        let winnings = 0
        let resultText = ""

        switch (result) {
            case "blackjack":
                winnings = Math.floor(gameState.currentBet * 2.5)
                resultText = "Blackjack! You win!"
                break
            case "win":
            case "dealer-bust":
                winnings = gameState.currentBet * 2
                resultText = result === "dealer-bust" ? "Dealer busts! You win!" : "You win!"
                break
            case "push":
                winnings = gameState.currentBet
                resultText = "Push! It's a tie!"
                break
            case "bust":
                resultText = "Bust! You lose!"
                break
            case "lose":
                resultText = "You lose!"
                break
        }

        setGameState((prev) => ({
            ...prev,
            gameStatus: "game-over",
            result: resultText,
            playerMoney: prev.playerMoney + winnings,
        }))
    }

    const newGame = () => {
        setGameState({
            playerHand: [],
            dealerHand: [],
            deck: createDeck(),
            playerScore: 0,
            dealerScore: 0,
            gameStatus: "betting",
            result: "",
            playerMoney: gameState.playerMoney,
            currentBet: 0,
            isDealing: false,
        })
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 pt-40">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">Blackjack</h1>
                    <p className="text-gray-600">Beat the dealer without going over 21!</p>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                    <Badge variant="outline" className="px-4 py-2 bg-white">
                        <Coins className="w-4 h-4 mr-2" />
                        Money: ${gameState.playerMoney}
                    </Badge>
                    {gameState.currentBet > 0 && (
                        <Badge variant="outline" className="px-4 py-2 bg-yellow-50 border-yellow-200">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Bet: ${gameState.currentBet}
                        </Badge>
                    )}
                </div>

                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Dealer</h2>
                                <Badge variant="secondary" className="bg-gray-100">
                                    {gameState.gameStatus === "playing" || gameState.gameStatus === "betting"
                                        ? "?"
                                        : gameState.dealerScore}
                                </Badge>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                                {gameState.dealerHand.map((card, index) => (
                                    <PlayingCardComponent
                                        key={card.id}
                                        card={card}
                                        isHidden={index === 1 && (gameState.gameStatus === "playing" || gameState.gameStatus === "betting")}
                                        delay={index * 400 + 600}
                                    />
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Player Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">You</h2>
                                <Badge variant="secondary" className="bg-blue-100">
                                    {gameState.playerScore}
                                </Badge>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                                {gameState.playerHand.map((card, index) => (
                                    <PlayingCardComponent key={card.id} card={card} delay={index * 400 + (index < 2 ? 200 : 0)} />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Game Controls */}
                <div className="text-center">
                    {gameState.gameStatus === "betting" && (
                        <div className="space-y-4">
                            <p className="text-lg text-gray-700 mb-4">Place your bet:</p>
                            <div className="flex gap-2 justify-center flex-wrap">
                                {[10, 25, 50, 100].map((amount) => (
                                    <Button
                                        key={amount}
                                        onClick={() => placeBet(amount)}
                                        disabled={amount > gameState.playerMoney}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {gameState.gameStatus === "playing" && !gameState.isDealing && (
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button onClick={hit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                                Hit
                            </Button>
                            <Button onClick={stand} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                                Stand
                            </Button>
                        </div>
                    )}

                    {gameState.gameStatus === "dealer-turn" && <div className="text-lg text-gray-600">Dealer is playing...</div>}

                    {gameState.gameStatus === "game-over" && (
                        <div className="space-y-4">
                            <div
                                className={`text-2xl font-bold ${gameState.result.includes("win") || gameState.result.includes("Blackjack")
                                    ? "text-green-600"
                                    : gameState.result.includes("Push")
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {gameState.result}
                            </div>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Button onClick={newGame} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    New Game
                                </Button>
                                {gameState.playerMoney === 0 && (
                                    <Button onClick={resetMoney} variant="outline" className="px-8 py-3 text-lg">
                                        Reset Money
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
        </div>
    )
}
