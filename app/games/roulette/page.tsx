"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Coins, TrendingUp, RotateCcw, Target } from "lucide-react"

interface Bet {
    type: "number" | "red" | "black" | "odd" | "even" | "low" | "high"
    value: number | string
    amount: number
    payout: number
}

interface GameState {
    playerMoney: number
    bets: Bet[]
    isSpinning: boolean
    winningNumber: number | null
    result: string
    totalBet: number
    totalWin: number
    gamePhase: "betting" | "spinning" | "result"
}

const rouletteNumbers = [
    { number: 0, color: "green" },
    { number: 1, color: "red" },
    { number: 2, color: "black" },
    { number: 3, color: "red" },
    { number: 4, color: "black" },
    { number: 5, color: "red" },
    { number: 6, color: "black" },
    { number: 7, color: "red" },
    { number: 8, color: "black" },
    { number: 9, color: "red" },
    { number: 10, color: "black" },
    { number: 11, color: "black" },
    { number: 12, color: "red" },
    { number: 13, color: "black" },
    { number: 14, color: "red" },
    { number: 15, color: "black" },
    { number: 16, color: "red" },
    { number: 17, color: "black" },
    { number: 18, color: "red" },
    { number: 19, color: "red" },
    { number: 20, color: "black" },
    { number: 21, color: "red" },
    { number: 22, color: "black" },
    { number: 23, color: "red" },
    { number: 24, color: "black" },
    { number: 25, color: "red" },
    { number: 26, color: "black" },
    { number: 27, color: "red" },
    { number: 28, color: "black" },
    { number: 29, color: "black" },
    { number: 30, color: "red" },
    { number: 31, color: "black" },
    { number: 32, color: "red" },
    { number: 33, color: "black" },
    { number: 34, color: "red" },
    { number: 35, color: "black" },
    { number: 36, color: "red" },
]

export default function RouletteGame() {
    const [gameState, setGameState] = useState<GameState>({
        playerMoney: 1000,
        bets: [],
        isSpinning: false,
        winningNumber: null,
        result: "",
        totalBet: 0,
        totalWin: 0,
        gamePhase: "betting",
    })

    const [betAmount, setBetAmount] = useState("10")
    const [wheelRotation, setWheelRotation] = useState(0)

    const placeBet = (type: Bet["type"], value: number | string, payout: number) => {
        const amount = Number.parseInt(betAmount)
        if (amount > gameState.playerMoney || amount <= 0) return

        const newBet: Bet = { type, value, amount, payout }

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

    const spin = () => {
        if (gameState.bets.length === 0) return

        setGameState((prev) => ({ ...prev, isSpinning: true, gamePhase: "spinning" }))

        const winningNumber = Math.floor(Math.random() * 37) // 0-36
        const rotations = 5 + Math.random() * 5 // 5-10 full rotations
        const finalRotation = wheelRotation + rotations * 360 + winningNumber * (360 / 37)

        setWheelRotation(finalRotation)

        setTimeout(() => {
            const winningData = rouletteNumbers.find((n) => n.number === winningNumber)!
            let totalWinnings = 0
            const winningBets: string[] = []

            gameState.bets.forEach((bet) => {
                let isWinner = false

                switch (bet.type) {
                    case "number":
                        isWinner = bet.value === winningNumber
                        break
                    case "red":
                        isWinner = winningData.color === "red"
                        break
                    case "black":
                        isWinner = winningData.color === "black"
                        break
                    case "odd":
                        isWinner = winningNumber > 0 && winningNumber % 2 === 1
                        break
                    case "even":
                        isWinner = winningNumber > 0 && winningNumber % 2 === 0
                        break
                    case "low":
                        isWinner = winningNumber >= 1 && winningNumber <= 18
                        break
                    case "high":
                        isWinner = winningNumber >= 19 && winningNumber <= 36
                        break
                }

                if (isWinner) {
                    const winAmount = bet.amount * bet.payout
                    totalWinnings += winAmount
                    winningBets.push(`${bet.type} (${bet.amount} → ${winAmount})`)
                }
            })

            let resultText = `🎯 Number ${winningNumber} (${winningData.color.toUpperCase()})`
            if (totalWinnings > 0) {
                resultText += `\n🎉 Won $${totalWinnings}! ${winningBets.join(", ")}`
            } else {
                resultText += `\n💸 Lost $${gameState.totalBet}`
            }

            setGameState((prev) => ({
                ...prev,
                isSpinning: false,
                winningNumber,
                result: resultText,
                totalWin: totalWinnings,
                playerMoney: prev.playerMoney + totalWinnings,
                gamePhase: "result",
            }))
        }, 3000)
    }

    const newGame = () => {
        setGameState((prev) => ({
            ...prev,
            bets: [],
            winningNumber: null,
            result: "",
            totalBet: 0,
            totalWin: 0,
            gamePhase: "betting",
        }))
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    const getNumberColor = (number: number) => {
        if (number === 0) return "bg-green-600 text-white"
        const data = rouletteNumbers.find((n) => n.number === number)
        return data?.color === "red" ? "bg-red-600 text-white" : "bg-gray-800 text-white"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-100 p-4 pt-40">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">🎯 Roulette</h1>
                    <p className="text-gray-600">Place your bets and spin the wheel!</p>
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

                {/* Roulette Wheel */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <div className="relative w-64 h-64 mx-auto">
                                <div
                                    className="w-full h-full rounded-full border-8 border-yellow-600 bg-gradient-conic from-red-600 via-black to-green-600 shadow-2xl transition-transform duration-3000 ease-out"
                                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                                >
                                    <div className="absolute inset-4 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Target className="w-8 h-8 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-600"></div>
                                </div>
                            </div>

                            {gameState.winningNumber !== null && (
                                <div className="mt-6">
                                    <div
                                        className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${getNumberColor(gameState.winningNumber)}`}
                                    >
                                        {gameState.winningNumber}
                                    </div>
                                </div>
                            )}

                            {gameState.result && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                    <div className="whitespace-pre-line text-lg font-semibold">{gameState.result}</div>
                                </div>
                            )}
                        </div>
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
                                    {[5, 10, 25, 50].map((amount) => (
                                        <Button key={amount} onClick={() => setBetAmount(amount.toString())} variant="outline" size="sm">
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Number Grid */}
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-4 text-center">Numbers (35:1)</h3>
                                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mb-4">
                                    <Button
                                        onClick={() => placeBet("number", 0, 35)}
                                        className="bg-green-600 hover:bg-green-700 text-white h-12"
                                    >
                                        0
                                    </Button>
                                    {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
                                        <Button
                                            key={num}
                                            onClick={() => placeBet("number", num, 35)}
                                            className={`h-12 ${getNumberColor(num)} hover:opacity-80`}
                                        >
                                            {num}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Outside Bets */}
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold mb-4 text-center">Outside Bets (1:1)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <Button
                                        onClick={() => placeBet("red", "red", 2)}
                                        className="bg-red-600 hover:bg-red-700 text-white py-3"
                                    >
                                        Red
                                    </Button>
                                    <Button
                                        onClick={() => placeBet("black", "black", 2)}
                                        className="bg-gray-800 hover:bg-gray-900 text-white py-3"
                                    >
                                        Black
                                    </Button>
                                    <Button
                                        onClick={() => placeBet("odd", "odd", 2)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white py-3"
                                    >
                                        Odd
                                    </Button>
                                    <Button
                                        onClick={() => placeBet("even", "even", 2)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white py-3"
                                    >
                                        Even
                                    </Button>
                                    <Button
                                        onClick={() => placeBet("low", "1-18", 2)}
                                        className="bg-orange-600 hover:bg-orange-700 text-white py-3"
                                    >
                                        1-18
                                    </Button>
                                    <Button
                                        onClick={() => placeBet("high", "19-36", 2)}
                                        className="bg-teal-600 hover:bg-teal-700 text-white py-3"
                                    >
                                        19-36
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Bets */}
                        {gameState.bets.length > 0 && (
                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-4">Current Bets</h3>
                                    <div className="space-y-2">
                                        {gameState.bets.map((bet, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span>
                                                    {bet.type}: {bet.value}
                                                </span>
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
                                onClick={spin}
                                disabled={gameState.bets.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                            >
                                🎯 Spin Wheel
                            </Button>
                            {gameState.bets.length > 0 && (
                                <Button onClick={clearBets} variant="outline" className="px-8 py-3 text-lg">
                                    Clear Bets
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {gameState.gamePhase === "spinning" && (
                    <div className="text-center">
                        <div className="text-2xl text-gray-600 animate-pulse">🎯 Spinning...</div>
                    </div>
                )}

                {gameState.gamePhase === "result" && (
                    <div className="text-center">
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
    )
}
