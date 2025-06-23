"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Coins, TrendingUp, RotateCcw, Crown, User } from "lucide-react"

interface PlayingCard {
    suit: "♠" | "♥" | "♦" | "♣"
    value: string
    numericValue: number
    id: string
}

interface GameState {
    playerHand: PlayingCard[]
    bankerHand: PlayingCard[]
    deck: PlayingCard[]
    playerScore: number
    bankerScore: number
    playerMoney: number
    bets: { type: "player" | "banker" | "tie"; amount: number }[]
    totalBet: number
    gamePhase: "betting" | "dealing" | "result"
    result: string
    winner: "player" | "banker" | "tie" | null
    isDealing: boolean
}

const suits: ("♠" | "♥" | "♦" | "♣")[] = ["♠", "♥", "♦", "♣"]
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function createDeck(): PlayingCard[] {
    const deck: PlayingCard[] = []
    suits.forEach((suit) => {
        values.forEach((value) => {
            let numericValue = Number.parseInt(value)
            if (value === "A") numericValue = 1
            else if (["J", "Q", "K", "10"].includes(value)) numericValue = 0

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

function calculateBaccaratScore(hand: PlayingCard[]): number {
    const total = hand.reduce((sum, card) => sum + card.numericValue, 0)
    return total % 10
}

function PlayingCardComponent({ card, delay = 0 }: { card: PlayingCard; delay?: number }) {
    const isRed = card.suit === "♥" || card.suit === "♦"

    return (
        <div
            className="relative w-16 h-24 sm:w-20 sm:h-28 transition-all duration-500 ease-out"
            style={{
                animationDelay: `${delay}ms`,
                animation: "slideIn 0.6s ease-out forwards",
            }}
        >
            <div className="w-full h-full rounded-lg border-2 bg-white border-gray-200 shadow-lg">
                <div className="p-1.5 sm:p-2 h-full flex flex-col justify-between relative overflow-hidden">
                    <div className={`text-xs sm:text-sm font-bold leading-none ${isRed ? "text-red-500" : "text-gray-800"}`}>
                        <div>{card.value}</div>
                        <div className="text-sm sm:text-base leading-none">{card.suit}</div>
                    </div>
                    <div className={`text-xl sm:text-2xl self-center ${isRed ? "text-red-500" : "text-gray-800"}`}>
                        {card.suit}
                    </div>
                    <div
                        className={`text-xs sm:text-sm font-bold leading-none self-end transform rotate-180 ${isRed ? "text-red-500" : "text-gray-800"}`}
                    >
                        <div>{card.value}</div>
                        <div className="text-sm sm:text-base leading-none">{card.suit}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function BaccaratGame() {
    const [gameState, setGameState] = useState<GameState>({
        playerHand: [],
        bankerHand: [],
        deck: createDeck(),
        playerScore: 0,
        bankerScore: 0,
        playerMoney: 1000,
        bets: [],
        totalBet: 0,
        gamePhase: "betting",
        result: "",
        winner: null,
        isDealing: false,
    })

    const [betAmount, setBetAmount] = useState("10")

    useEffect(() => {
        const playerScore = calculateBaccaratScore(gameState.playerHand)
        const bankerScore = calculateBaccaratScore(gameState.bankerHand)

        setGameState((prev) => ({
            ...prev,
            playerScore,
            bankerScore,
        }))
    }, [gameState.playerHand, gameState.bankerHand])

    const placeBet = (type: "player" | "banker" | "tie") => {
        const amount = Number.parseInt(betAmount)
        if (amount > gameState.playerMoney || amount <= 0) return

        const newBet = { type, amount }

        setGameState((prev) => ({
            ...prev,
            bets: [...prev.bets, newBet],
            playerMoney: prev.playerMoney - amount,
            totalBet: prev.totalBet + amount,
        }))
    }

    const clearBets = () => {
        setGameState((prev) => ({
            ...prev,
            bets: [],
            playerMoney: prev.playerMoney + prev.totalBet,
            totalBet: 0,
        }))
    }

    const deal = () => {
        if (gameState.bets.length === 0) return

        setGameState((prev) => ({ ...prev, gamePhase: "dealing", isDealing: true }))

        const newDeck = [...gameState.deck]
        const playerHand: PlayingCard[] = []
        const bankerHand: PlayingCard[] = []

        // Deal initial cards
        setTimeout(() => {
            playerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, playerHand: [...playerHand], deck: newDeck }))
        }, 500)

        setTimeout(() => {
            bankerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, bankerHand: [...bankerHand], deck: newDeck }))
        }, 1000)

        setTimeout(() => {
            playerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, playerHand: [...playerHand], deck: newDeck }))
        }, 1500)

        setTimeout(() => {
            bankerHand.push(newDeck.pop()!)
            setGameState((prev) => ({ ...prev, bankerHand: [...bankerHand], deck: newDeck, isDealing: false }))

            // Check for natural win or continue with third card rules
            setTimeout(() => {
                const playerScore = calculateBaccaratScore(playerHand)
                const bankerScore = calculateBaccaratScore(bankerHand)

                if (playerScore >= 8 || bankerScore >= 8) {
                    // Natural win
                    determineWinner(playerHand, bankerHand, newDeck)
                } else {
                    // Apply third card rules
                    applyThirdCardRules(playerHand, bankerHand, newDeck)
                }
            }, 1000)
        }, 2000)
    }

    const applyThirdCardRules = (playerHand: PlayingCard[], bankerHand: PlayingCard[], deck: PlayingCard[]) => {
        const playerScore = calculateBaccaratScore(playerHand)
        const bankerScore = calculateBaccaratScore(bankerHand)
        const newDeck = [...deck]

        // Player third card rule
        if (playerScore <= 5) {
            setTimeout(() => {
                const thirdCard = newDeck.pop()!
                playerHand.push(thirdCard)
                setGameState((prev) => ({ ...prev, playerHand: [...playerHand], deck: newDeck }))

                // Banker third card rule (simplified)
                const playerThirdCardValue = thirdCard.numericValue
                let bankerDraws = false

                if (bankerScore <= 2) bankerDraws = true
                else if (bankerScore === 3 && playerThirdCardValue !== 8) bankerDraws = true
                else if (bankerScore === 4 && [2, 3, 4, 5, 6, 7].includes(playerThirdCardValue)) bankerDraws = true
                else if (bankerScore === 5 && [4, 5, 6, 7].includes(playerThirdCardValue)) bankerDraws = true
                else if (bankerScore === 6 && [6, 7].includes(playerThirdCardValue)) bankerDraws = true

                if (bankerDraws) {
                    setTimeout(() => {
                        bankerHand.push(newDeck.pop()!)
                        setGameState((prev) => ({ ...prev, bankerHand: [...bankerHand], deck: newDeck }))
                        setTimeout(() => determineWinner(playerHand, bankerHand, newDeck), 1000)
                    }, 1000)
                } else {
                    setTimeout(() => determineWinner(playerHand, bankerHand, newDeck), 1000)
                }
            }, 1000)
        } else {
            // Player stands, check banker
            if (bankerScore <= 5) {
                setTimeout(() => {
                    bankerHand.push(newDeck.pop()!)
                    setGameState((prev) => ({ ...prev, bankerHand: [...bankerHand], deck: newDeck }))
                    setTimeout(() => determineWinner(playerHand, bankerHand, newDeck), 1000)
                }, 1000)
            } else {
                setTimeout(() => determineWinner(playerHand, bankerHand, newDeck), 1000)
            }
        }
    }

    const determineWinner = (playerHand: PlayingCard[], bankerHand: PlayingCard[], deck: PlayingCard[]) => {
        const playerScore = calculateBaccaratScore(playerHand)
        const bankerScore = calculateBaccaratScore(bankerHand)

        let winner: "player" | "banker" | "tie"
        if (playerScore > bankerScore) winner = "player"
        else if (bankerScore > playerScore) winner = "banker"
        else winner = "tie"

        // Calculate winnings
        let totalWinnings = 0
        gameState.bets.forEach((bet) => {
            if (bet.type === winner) {
                if (winner === "player") totalWinnings += bet.amount * 2
                else if (winner === "banker")
                    totalWinnings += Math.floor(bet.amount * 1.95) // 5% commission
                else if (winner === "tie") totalWinnings += bet.amount * 9
            }
        })

        const resultText =
            winner === "tie"
                ? `🤝 It's a tie! Both scored ${playerScore}`
                : `🎉 ${winner.charAt(0).toUpperCase() + winner.slice(1)} wins! ${winner === "player" ? playerScore : bankerScore} vs ${winner === "player" ? bankerScore : playerScore}`

        setGameState((prev) => ({
            ...prev,
            winner,
            result: resultText,
            playerMoney: prev.playerMoney + totalWinnings,
            gamePhase: "result",
        }))
    }

    const newGame = () => {
        setGameState((prev) => ({
            ...prev,
            playerHand: [],
            bankerHand: [],
            deck: createDeck(),
            bets: [],
            totalBet: 0,
            gamePhase: "betting",
            result: "",
            winner: null,
        }))
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 pt-40">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">👑 Baccarat</h1>
                    <p className="text-gray-600">Player vs Banker - Closest to 9 wins!</p>
                </div>

                {/* Game Stats */}
                <div className="flex justify-center gap-4 mb-8">
                    <Badge variant="outline" className="px-4 py-2 bg-white">
                        <Coins className="w-4 h-4 mr-2" />
                        Money: ${gameState.playerMoney}
                    </Badge>
                    {gameState.totalBet > 0 && (
                        <Badge variant="outline" className="px-4 py-2 bg-yellow-50 border-yellow-200">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Total Bet: ${gameState.totalBet}
                        </Badge>
                    )}
                </div>

                {/* Game Area */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                        {/* Banker Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <Crown className="w-6 h-6 mr-2 text-purple-600" />
                                    Banker
                                </h2>
                                <Badge variant="secondary" className="bg-purple-100">
                                    {gameState.bankerScore}
                                </Badge>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                                {gameState.bankerHand.map((card, index) => (
                                    <PlayingCardComponent key={card.id} card={card} delay={index * 500 + 1000} />
                                ))}
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Player Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <User className="w-6 h-6 mr-2 text-blue-600" />
                                    Player
                                </h2>
                                <Badge variant="secondary" className="bg-blue-100">
                                    {gameState.playerScore}
                                </Badge>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                                {gameState.playerHand.map((card, index) => (
                                    <PlayingCardComponent key={card.id} card={card} delay={index * 500 + 500} />
                                ))}
                            </div>
                        </div>

                        {/* Result */}
                        {gameState.result && (
                            <div className="mt-6 text-center">
                                <div
                                    className={`text-xl font-bold p-4 rounded-lg ${gameState.winner === "tie"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : gameState.winner === "player"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-purple-100 text-purple-800"
                                        }`}
                                >
                                    {gameState.result}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Betting Area */}
                {gameState.gamePhase === "betting" && (
                    <div className="space-y-6">
                        {/* Bet Amount */}
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex justify-center items-center gap-4 mb-4">
                                    <label className="text-lg font-medium">Bet Amount:</label>
                                    <Input
                                        type="number"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                        className="w-32 text-center"
                                        min="1"
                                        max={gameState.playerMoney}
                                    />
                                </div>
                                <div className="flex gap-2 justify-center flex-wrap">
                                    {[10, 25, 50, 100].map((amount) => (
                                        <Button key={amount} onClick={() => setBetAmount(amount.toString())} variant="outline" size="sm">
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Betting Options */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="p-6 text-center">
                                    <User className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                                    <h3 className="text-xl font-semibold mb-4">Player</h3>
                                    <p className="text-sm text-gray-600 mb-4">Bet on Player hand winning (1:1)</p>
                                    <Button
                                        onClick={() => placeBet("player")}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                                    >
                                        Bet on Player
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-purple-50 border-purple-200">
                                <CardContent className="p-6 text-center">
                                    <Crown className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                                    <h3 className="text-xl font-semibold mb-4">Banker</h3>
                                    <p className="text-sm text-gray-600 mb-4">Bet on Banker hand winning (0.95:1)</p>
                                    <Button
                                        onClick={() => placeBet("banker")}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                                    >
                                        Bet on Banker
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="p-6 text-center">
                                    <div className="text-4xl mb-4">🤝</div>
                                    <h3 className="text-xl font-semibold mb-4">Tie</h3>
                                    <p className="text-sm text-gray-600 mb-4">Bet on a tie (8:1)</p>
                                    <Button
                                        onClick={() => placeBet("tie")}
                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3"
                                    >
                                        Bet on Tie
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Current Bets */}
                        {gameState.bets.length > 0 && (
                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-4">Current Bets</h3>
                                    <div className="space-y-2">
                                        {gameState.bets.map((bet, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="capitalize">{bet.type}</span>
                                                <span className="font-semibold">${bet.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button
                                onClick={deal}
                                disabled={gameState.bets.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                            >
                                👑 Deal Cards
                            </Button>
                            {gameState.bets.length > 0 && (
                                <Button onClick={clearBets} variant="outline" className="px-8 py-3 text-lg">
                                    Clear Bets
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {gameState.gamePhase === "dealing" && (
                    <div className="text-center">
                        <div className="text-2xl text-purple-600 animate-pulse">👑 Dealing cards...</div>
                    </div>
                )}

                {gameState.gamePhase === "result" && (
                    <div className="text-center">
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button onClick={newGame} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
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
