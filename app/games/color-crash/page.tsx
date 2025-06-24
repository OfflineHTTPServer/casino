"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Coins, TrendingUp, Zap, RotateCcw } from "lucide-react"

interface GameState {
    multiplier: number
    isRunning: boolean
    hasCrashed: boolean
    crashPoint: number
    playerMoney: number
    currentBet: number
    isBetPlaced: boolean
    hasCashedOut: boolean
    cashOutMultiplier: number
    result: string
    gamePhase: "betting" | "running" | "crashed"
}

export default function ColorCrashGame() {
    const [gameState, setGameState] = useState<GameState>({
        multiplier: 1.0,
        isRunning: false,
        hasCrashed: false,
        crashPoint: 0,
        playerMoney: 1000,
        currentBet: 0,
        isBetPlaced: false,
        hasCashedOut: false,
        cashOutMultiplier: 0,
        result: "",
        gamePhase: "betting",
    })

    const [betAmount, setBetAmount] = useState("10")
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const startTimeRef = useRef<number>(0)

    const generateCrashPoint = () => {
        // Generate crash point between 1.01x and 10x with weighted probability
        const random = Math.random()
        if (random < 0.5) return 1.01 + Math.random() * 1.99 // 1.01x - 3x (50% chance)
        if (random < 0.8) return 3 + Math.random() * 2 // 3x - 5x (30% chance)
        if (random < 0.95) return 5 + Math.random() * 3 // 5x - 8x (15% chance)
        return 8 + Math.random() * 2 // 8x - 10x (5% chance)
    }

    const startGame = () => {
        const bet = Number.parseInt(betAmount)
        if (bet > gameState.playerMoney || bet <= 0) return

        const crashPoint = generateCrashPoint()

        setGameState((prev) => ({
            ...prev,
            currentBet: bet,
            playerMoney: prev.playerMoney - bet,
            crashPoint,
            isRunning: true,
            isBetPlaced: true,
            hasCrashed: false,
            hasCashedOut: false,
            multiplier: 1.0,
            result: "",
            gamePhase: "running",
        }))

        startTimeRef.current = Date.now()

        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000
            const newMultiplier = 1 + elapsed * 0.5 // Increases by 0.5x per second

            setGameState((prev) => {
                if (newMultiplier >= prev.crashPoint) {
                    // Crash!
                    if (intervalRef.current) clearInterval(intervalRef.current)

                    return {
                        ...prev,
                        multiplier: prev.crashPoint,
                        isRunning: false,
                        hasCrashed: true,
                        result: prev.hasCashedOut
                            ? `Cashed out at ${prev.cashOutMultiplier.toFixed(2)}x! Won $${Math.floor(prev.currentBet * prev.cashOutMultiplier)}`
                            : `Crashed at ${prev.crashPoint.toFixed(2)}x! Lost $${prev.currentBet}`,
                        gamePhase: "crashed",
                    }
                }

                return {
                    ...prev,
                    multiplier: newMultiplier,
                }
            })
        }, 50)
    }

    const cashOut = () => {
        if (!gameState.isRunning || gameState.hasCashedOut) return

        if (intervalRef.current) clearInterval(intervalRef.current)

        const winnings = Math.floor(gameState.currentBet * gameState.multiplier)

        setGameState((prev) => ({
            ...prev,
            hasCashedOut: true,
            cashOutMultiplier: prev.multiplier,
            playerMoney: prev.playerMoney + winnings,
            isRunning: false,
            result: `Cashed out at ${prev.multiplier.toFixed(2)}x! Won $${winnings}`,
            gamePhase: "crashed",
        }))
    }

    const newGame = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)

        setGameState((prev) => ({
            ...prev,
            multiplier: 1.0,
            isRunning: false,
            hasCrashed: false,
            crashPoint: 0,
            currentBet: 0,
            isBetPlaced: false,
            hasCashedOut: false,
            cashOutMultiplier: 0,
            result: "",
            gamePhase: "betting",
        }))
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const getMultiplierColor = () => {
        if (gameState.hasCrashed && !gameState.hasCashedOut) return "text-red-500"
        if (gameState.hasCashedOut) return "text-green-500"
        if (gameState.multiplier < 2) return "text-blue-500"
        if (gameState.multiplier < 5) return "text-yellow-500"
        if (gameState.multiplier < 8) return "text-orange-500"
        return "text-red-500"
    }

    const getBackgroundColor = () => {
        if (gameState.hasCrashed && !gameState.hasCashedOut) return "from-red-50 to-red-100"
        if (gameState.hasCashedOut) return "from-green-50 to-green-100"
        if (gameState.multiplier < 2) return "from-blue-50 to-blue-100"
        if (gameState.multiplier < 5) return "from-yellow-50 to-yellow-100"
        if (gameState.multiplier < 8) return "from-orange-50 to-orange-100"
        return "from-red-50 to-red-100"
    }

    return (
        <div className={`min-h-screen bg-gradient-to-br ${getBackgroundColor()} p-4 transition-all duration-1000 pt-40`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">Color Crash</h1>
                    <p className="text-gray-600">Cash out before the crash to win!</p>
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

                {/* Game Area */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-8">
                        <div className="text-center">
                            {/* Multiplier Display */}
                            <div
                                className={`text-8xl sm:text-9xl font-bold mb-8 transition-all duration-200 ${getMultiplierColor()}`}
                            >
                                {gameState.multiplier.toFixed(2)}x
                            </div>

                            {/* Progress Indicator */}
                            {gameState.isRunning && (
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-6 hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-red-500 h-2 rounded-full transition-all duration-200"
                                        style={{ width: `${Math.min((gameState.multiplier / gameState.crashPoint) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            )}

                            {/* Game Status */}
                            {gameState.gamePhase === "running" && (
                                <div className="text-xl text-gray-600 mb-4 animate-pulse">
                                    <Zap className="w-6 h-6 inline mr-2" />
                                    Game Running...
                                </div>
                            )}

                            {gameState.result && (
                                <div
                                    className={`text-xl font-semibold mb-6 ${gameState.hasCashedOut ? "text-green-600" : "text-red-600"}`}
                                >
                                    {gameState.result}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Game Controls */}
                <div className="text-center space-y-4">
                    {gameState.gamePhase === "betting" && (
                        <div className="space-y-4">
                            <div className="flex justify-center items-center gap-4">
                                <label htmlFor="bet" className="text-lg font-medium text-gray-700">
                                    Bet Amount:
                                </label>
                                <Input
                                    id="bet"
                                    type="number"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    className="w-32 text-center"
                                    min="1"
                                    max={gameState.playerMoney}
                                />
                            </div>

                            <div className="flex gap-2 justify-center flex-wrap mb-4">
                                {[10, 25, 50, 100].map((amount) => (
                                    <Button key={amount} onClick={() => setBetAmount(amount.toString())} variant="outline" size="sm">
                                        ${amount}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                onClick={startGame}
                                disabled={Number.parseInt(betAmount) > gameState.playerMoney || Number.parseInt(betAmount) <= 0}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                            >
                                Start Game
                            </Button>
                        </div>
                    )}

                    {gameState.gamePhase === "running" && (
                        <Button
                            onClick={cashOut}
                            className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-xl animate-pulse"
                        >
                            Cash Out at {gameState.multiplier.toFixed(2)}x
                        </Button>
                    )}

                    {gameState.gamePhase === "crashed" && (
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
                    )}
                </div>
            </div>
        </div>
    )
}
