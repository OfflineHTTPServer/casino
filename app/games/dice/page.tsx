"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Coins, TrendingUp, RotateCcw, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react"

interface GameState {
    playerMoney: number
    currentBet: number
    betType: "over" | "under" | "exact" | null
    betValue: number
    dice: [number, number]
    isRolling: boolean
    result: string
    gamePhase: "betting" | "rolling" | "result"
}

const DiceIcon = ({ value }: { value: number }) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const Icon = icons[value - 1]
    return <Icon className="w-16 h-16 text-blue-600" />
}

export default function DiceGame() {
    const [gameState, setGameState] = useState<GameState>({
        playerMoney: 1000,
        currentBet: 0,
        betType: null,
        betValue: 7,
        dice: [1, 1],
        isRolling: false,
        result: "",
        gamePhase: "betting",
    })

    const [betAmount, setBetAmount] = useState("10")

    const placeBet = (type: "over" | "under" | "exact", value: number) => {
        const amount = Number.parseInt(betAmount)
        if (amount > gameState.playerMoney || amount <= 0) return

        setGameState((prev) => ({
            ...prev,
            currentBet: amount,
            playerMoney: prev.playerMoney - amount,
            betType: type,
            betValue: value,
        }))
    }

    const rollDice = () => {
        if (!gameState.betType) return

        setGameState((prev) => ({ ...prev, isRolling: true, gamePhase: "rolling" }))

        // Animate dice rolling
        let rollCount = 0
        const rollInterval = setInterval(() => {
            setGameState((prev) => ({
                ...prev,
                dice: [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1],
            }))

            rollCount++
            if (rollCount >= 10) {
                clearInterval(rollInterval)

                // Final roll
                const finalDice: [number, number] = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
                const total = finalDice[0] + finalDice[1]

                let isWinner = false
                let payout = 0

                switch (gameState.betType) {
                    case "over":
                        isWinner = total > gameState.betValue
                        payout = gameState.betValue === 7 ? 2 : gameState.betValue === 8 ? 2.2 : gameState.betValue === 9 ? 2.5 : 3
                        break
                    case "under":
                        isWinner = total < gameState.betValue
                        payout = gameState.betValue === 7 ? 2 : gameState.betValue === 6 ? 2.2 : gameState.betValue === 5 ? 2.5 : 3
                        break
                    case "exact":
                        isWinner = total === gameState.betValue
                        payout =
                            total === 7
                                ? 5
                                : total === 6 || total === 8
                                    ? 6
                                    : total === 5 || total === 9
                                        ? 8
                                        : total === 4 || total === 10
                                            ? 10
                                            : total === 3 || total === 11
                                                ? 15
                                                : 30
                        break
                }

                const winnings = isWinner ? Math.floor(gameState.currentBet * payout) : 0
                const resultText = isWinner
                    ? `🎉 Winner! Rolled ${total}. Won $${winnings}!`
                    : `💸 Lost! Rolled ${total}. Better luck next time!`

                setTimeout(() => {
                    setGameState((prev) => ({
                        ...prev,
                        dice: finalDice,
                        isRolling: false,
                        result: resultText,
                        playerMoney: prev.playerMoney + winnings,
                        gamePhase: "result",
                    }))
                }, 500)
            }
        }, 100)
    }

    const newGame = () => {
        setGameState((prev) => ({
            ...prev,
            currentBet: 0,
            betType: null,
            result: "",
            gamePhase: "betting",
        }))
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-40">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">🎲 Dice Game</h1>
                    <p className="text-gray-600">Bet on the dice roll outcome!</p>
                </div>

                {/* Game Stats */}
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

                {/* Dice Display */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-8">
                        <div className="text-center">
                            <div className="flex justify-center gap-8 mb-6">
                                <div className={`p-4 bg-white rounded-lg shadow-lg ${gameState.isRolling ? "animate-bounce" : ""}`}>
                                    <DiceIcon value={gameState.dice[0]} />
                                </div>
                                <div
                                    className={`p-4 bg-white rounded-lg shadow-lg ${gameState.isRolling ? "animate-bounce" : ""}`}
                                    style={{ animationDelay: "0.1s" }}
                                >
                                    <DiceIcon value={gameState.dice[1]} />
                                </div>
                            </div>

                            <div className="text-4xl font-bold text-gray-800 mb-4">
                                Total: {gameState.dice[0] + gameState.dice[1]}
                            </div>

                            {gameState.result && (
                                <div
                                    className={`text-xl font-semibold p-4 rounded-lg ${gameState.result.includes("Winner") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                    {gameState.result}
                                </div>
                            )}

                            {gameState.isRolling && <div className="text-xl text-blue-600 animate-pulse">🎲 Rolling dice...</div>}
                        </div>
                    </CardContent>
                </Card>

                {gameState.gamePhase === "betting" && (
                    <div className="space-y-6">
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

                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-4 text-center">Over</h3>
                                    <div className="space-y-2">
                                        <Button
                                            onClick={() => placeBet("over", 7)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Over 7 (2:1)
                                        </Button>
                                        <Button
                                            onClick={() => placeBet("over", 8)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Over 8 (2.2:1)
                                        </Button>
                                        <Button
                                            onClick={() => placeBet("over", 9)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Over 9 (2.5:1)
                                        </Button>
                                        <Button
                                            onClick={() => placeBet("over", 10)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            Over 10 (3:1)
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-4 text-center">Under</h3>
                                    <div className="space-y-2">
                                        <Button
                                            onClick={() => placeBet("under", 7)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Under 7 (2:1)
                                        </Button>
                                        <Button
                                            onClick={() => placeBet("under", 6)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Under 6 (2.2:1)
                                        </Button>
                                        <Button
                                            onClick={() => placeBet("under", 5)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Under 5 (2.5:1)
                                        </Button>
                                        <Button
                                            onClick={() => placeBet("under", 4)}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Under 4 (3:1)
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Exact Bets */}
                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-4 text-center">Exact</h3>
                                    <div className="grid grid-cols-2 gap-1 text-sm">
                                        {Array.from({ length: 11 }, (_, i) => i + 2).map((num) => {
                                            const payout =
                                                num === 7
                                                    ? 5
                                                    : num === 6 || num === 8
                                                        ? 6
                                                        : num === 5 || num === 9
                                                            ? 8
                                                            : num === 4 || num === 10
                                                                ? 10
                                                                : num === 3 || num === 11
                                                                    ? 15
                                                                    : 30
                                            return (
                                                <Button
                                                    key={num}
                                                    onClick={() => placeBet("exact", num)}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-2"
                                                >
                                                    {num} ({payout}:1)
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Current Bet Display */}
                        {gameState.betType && (
                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="p-4 text-center">
                                    <div className="text-lg font-semibold">
                                        Current Bet: ${gameState.currentBet} on {gameState.betType.toUpperCase()} {gameState.betValue}
                                    </div>
                                    <Button
                                        onClick={rollDice}
                                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                                    >
                                        🎲 Roll Dice
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {gameState.gamePhase === "rolling" && (
                    <div className="text-center">
                        <div className="text-2xl text-blue-600 animate-pulse">🎲 Rolling...</div>
                    </div>
                )}

                {gameState.gamePhase === "result" && (
                    <div className="text-center">
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button onClick={newGame} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
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
    )
}
