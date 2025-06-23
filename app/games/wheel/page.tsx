"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Coins, TrendingUp, RotateCcw, Star } from "lucide-react"

interface WheelSegment {
    label: string
    multiplier: number
    color: string
    probability: number
}

interface GameState {
    playerMoney: number
    currentBet: number
    isSpinning: boolean
    result: string
    winAmount: number
    gamePhase: "betting" | "spinning" | "result"
    wheelRotation: number
    winningSegment: WheelSegment | null
}

const wheelSegments: WheelSegment[] = [
    { label: "💸 Lose", multiplier: 0, color: "bg-red-600", probability: 0.4 },
    { label: "2x", multiplier: 2, color: "bg-blue-600", probability: 0.25 },
    { label: "3x", multiplier: 3, color: "bg-green-600", probability: 0.15 },
    { label: "5x", multiplier: 5, color: "bg-purple-600", probability: 0.1 },
    { label: "10x", multiplier: 10, color: "bg-orange-600", probability: 0.05 },
    { label: "25x", multiplier: 25, color: "bg-pink-600", probability: 0.03 },
    { label: "50x", multiplier: 50, color: "bg-yellow-600", probability: 0.015 },
    { label: "💎 100x", multiplier: 100, color: "bg-cyan-600", probability: 0.005 },
]

export default function WheelFortuneGame() {
    const [gameState, setGameState] = useState<GameState>({
        playerMoney: 1000,
        currentBet: 0,
        isSpinning: false,
        result: "",
        winAmount: 0,
        gamePhase: "betting",
        wheelRotation: 0,
        winningSegment: null,
    })

    const [betAmount, setBetAmount] = useState("10")

    const getWinningSegment = () => {
        const random = Math.random()
        let cumulativeProbability = 0

        for (const segment of wheelSegments) {
            cumulativeProbability += segment.probability
            if (random <= cumulativeProbability) {
                return segment
            }
        }
        return wheelSegments[0] // fallback
    }

    const spin = () => {
        const bet = Number.parseInt(betAmount)
        if (bet > gameState.playerMoney || bet <= 0) return

        setGameState((prev) => ({
            ...prev,
            currentBet: bet,
            playerMoney: prev.playerMoney - bet,
            isSpinning: true,
            gamePhase: "spinning",
            result: "",
            winAmount: 0,
        }))

        const winningSegment = getWinningSegment()
        const segmentIndex = wheelSegments.indexOf(winningSegment)
        const segmentAngle = 360 / wheelSegments.length
        const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2
        const spins = 5 + Math.random() * 3 // 5-8 full rotations
        const finalRotation = gameState.wheelRotation + spins * 360 + (360 - targetAngle)

        setGameState((prev) => ({ ...prev, wheelRotation: finalRotation }))

        setTimeout(() => {
            const winAmount = bet * winningSegment.multiplier
            let resultText = ""

            if (winningSegment.multiplier === 0) {
                resultText = "💸 Sorry, you lost! Better luck next time!"
            } else if (winningSegment.multiplier >= 50) {
                resultText = `🎊 MEGA WIN! ${winningSegment.label}! Won $${winAmount}!`
            } else if (winningSegment.multiplier >= 10) {
                resultText = `🎉 BIG WIN! ${winningSegment.label}! Won $${winAmount}!`
            } else {
                resultText = `✨ Nice! ${winningSegment.label}! Won $${winAmount}!`
            }

            setGameState((prev) => ({
                ...prev,
                isSpinning: false,
                result: resultText,
                winAmount,
                playerMoney: prev.playerMoney + winAmount,
                gamePhase: "result",
                winningSegment,
            }))
        }, 4000)
    }

    const newGame = () => {
        setGameState((prev) => ({
            ...prev,
            currentBet: 0,
            result: "",
            winAmount: 0,
            gamePhase: "betting",
            winningSegment: null,
        }))
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4 pt-40">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">🎡 Wheel of Fortune</h1>
                    <p className="text-gray-600">Spin the wheel and win big!</p>
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

                {/* Wheel */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-8">
                        <div className="text-center">
                            <div className="relative w-80 h-80 mx-auto mb-8">
                                {/* Wheel */}
                                <div
                                    className="w-full h-full rounded-full border-8 border-yellow-600 shadow-2xl transition-transform duration-4000 ease-out relative overflow-hidden"
                                    style={{ transform: `rotate(${gameState.wheelRotation}deg)` }}
                                >
                                    {wheelSegments.map((segment, index) => {
                                        const angle = 360 / wheelSegments.length
                                        const rotation = index * angle
                                        return (
                                            <div
                                                key={index}
                                                className={`absolute w-full h-full ${segment.color} text-white font-bold flex items-center justify-center text-sm`}
                                                style={{
                                                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 - 50 * Math.sin((angle * Math.PI) / 180)}%)`,
                                                    transform: `rotate(${rotation}deg)`,
                                                    transformOrigin: "center",
                                                }}
                                            >
                                                <div className="transform -rotate-45 mt-8">{segment.label}</div>
                                            </div>
                                        )
                                    })}

                                    {/* Center circle */}
                                    <div className="absolute inset-16 rounded-full bg-yellow-100 border-4 border-yellow-600 flex items-center justify-center">
                                        <Star className="w-12 h-12 text-yellow-600" />
                                    </div>
                                </div>

                                {/* Pointer */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                                    <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-yellow-600"></div>
                                </div>
                            </div>

                            {gameState.winningSegment && (
                                <div className="mb-6">
                                    <div
                                        className={`inline-block px-6 py-3 rounded-full text-2xl font-bold text-white ${gameState.winningSegment.color}`}
                                    >
                                        {gameState.winningSegment.label}
                                    </div>
                                </div>
                            )}

                            {gameState.result && (
                                <div
                                    className={`text-xl font-bold p-4 rounded-lg mb-4 ${gameState.winAmount > 0
                                        ? gameState.winAmount >= gameState.currentBet * 10
                                            ? "bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 border-2 border-orange-300"
                                            : "bg-green-100 text-green-800 border-2 border-green-300"
                                        : "bg-red-100 text-red-800 border-2 border-red-300"
                                        }`}
                                >
                                    {gameState.result}
                                </div>
                            )}

                            {gameState.isSpinning && <div className="text-2xl text-orange-600 animate-pulse">🎡 Spinning...</div>}
                        </div>
                    </CardContent>
                </Card>

                {/* Probability Table */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-center mb-4">Odds</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm">
                            {wheelSegments.map((segment, index) => (
                                <div key={index} className={`p-2 rounded text-white ${segment.color}`}>
                                    <div className="font-bold">{segment.label}</div>
                                    <div>{(segment.probability * 100).toFixed(1)}%</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Game Controls */}
                <div className="text-center space-y-4">
                    {gameState.gamePhase === "betting" && (
                        <div className="space-y-4">
                            <div className="flex justify-center items-center gap-4">
                                <label className="text-lg font-medium text-gray-700">Bet Amount:</label>
                                <Input
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
                                onClick={spin}
                                disabled={Number.parseInt(betAmount) > gameState.playerMoney || Number.parseInt(betAmount) <= 0}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 text-xl"
                            >
                                🎡 SPIN WHEEL
                            </Button>
                        </div>
                    )}

                    {gameState.gamePhase === "spinning" && <div className="text-lg text-gray-600">Good luck! 🍀</div>}

                    {gameState.gamePhase === "result" && (
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button onClick={newGame} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Spin Again
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
