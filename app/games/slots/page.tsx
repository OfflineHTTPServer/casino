"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Coins, TrendingUp, RotateCcw, Zap } from "lucide-react"

interface SlotSymbol {
    symbol: string
    value: number
    color: string
}

interface GameState {
    reels: string[]
    isSpinning: boolean
    playerMoney: number
    currentBet: number
    result: string
    winAmount: number
    gamePhase: "betting" | "spinning" | "result"
}

const symbols: SlotSymbol[] = [
    { symbol: "🍒", value: 2, color: "text-red-500" },
    { symbol: "🍋", value: 3, color: "text-yellow-500" },
    { symbol: "🍊", value: 4, color: "text-orange-500" },
    { symbol: "🍇", value: 5, color: "text-purple-500" },
    { symbol: "🔔", value: 8, color: "text-yellow-600" },
    { symbol: "⭐", value: 10, color: "text-blue-500" },
    { symbol: "💎", value: 20, color: "text-cyan-500" },
    { symbol: "🎰", value: 50, color: "text-green-500" },
]

export default function SlotsGame() {
    const [gameState, setGameState] = useState<GameState>({
        reels: ["🍒", "🍒", "🍒"],
        isSpinning: false,
        playerMoney: 1000,
        currentBet: 0,
        result: "",
        winAmount: 0,
        gamePhase: "betting",
    })

    const [betAmount, setBetAmount] = useState("10")
    const [spinningReels, setSpinningReels] = useState([false, false, false])

    const getRandomSymbol = () => {
        return symbols[Math.floor(Math.random() * symbols.length)].symbol
    }

    const calculateWin = (reels: string[], bet: number) => {
        // Check for three of a kind
        if (reels[0] === reels[1] && reels[1] === reels[2]) {
            const symbol = symbols.find((s) => s.symbol === reels[0])
            return symbol ? bet * symbol.value : 0
        }

        // Check for two of a kind
        if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
            return Math.floor(bet * 0.5)
        }

        return 0
    }

    const spin = () => {
        const bet = Number.parseInt(betAmount)
        if (bet > gameState.playerMoney || bet <= 0) return

        setGameState((prev) => ({
            ...prev,
            currentBet: bet,
            playerMoney: prev.playerMoney - bet,
            isSpinning: true,
            result: "",
            winAmount: 0,
            gamePhase: "spinning",
        }))

        setSpinningReels([true, true, true])

        // Stop reels one by one with delays
        const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]

        setTimeout(() => {
            setGameState((prev) => ({ ...prev, reels: [finalReels[0], prev.reels[1], prev.reels[2]] }))
            setSpinningReels((prev) => [false, prev[1], prev[2]])
        }, 1000)

        setTimeout(() => {
            setGameState((prev) => ({ ...prev, reels: [finalReels[0], finalReels[1], prev.reels[2]] }))
            setSpinningReels((prev) => [false, false, prev[2]])
        }, 1500)

        setTimeout(() => {
            const winAmount = calculateWin(finalReels, bet)
            let resultText = ""

            if (winAmount > 0) {
                if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
                    resultText = `🎉 JACKPOT! Three ${finalReels[0]}s! Won $${winAmount}!`
                } else {
                    resultText = `🎊 Nice! Won $${winAmount}!`
                }
            } else {
                resultText = "Better luck next time!"
            }

            setGameState((prev) => ({
                ...prev,
                reels: finalReels,
                isSpinning: false,
                result: resultText,
                winAmount,
                playerMoney: prev.playerMoney + winAmount,
                gamePhase: "result",
            }))
            setSpinningReels([false, false, false])
        }, 2000)
    }

    const newGame = () => {
        setGameState((prev) => ({
            ...prev,
            result: "",
            winAmount: 0,
            currentBet: 0,
            gamePhase: "betting",
        }))
    }

    const resetMoney = () => {
        setGameState((prev) => ({ ...prev, playerMoney: 1000 }))
    }

    const SlotReel = ({ symbol, isSpinning, delay }: { symbol: string; isSpinning: boolean; delay: number }) => (
        <div className="relative w-24 h-32 sm:w-32 sm:h-40 bg-white rounded-lg border-4 border-gray-300 shadow-lg overflow-hidden">
            <div
                className={`absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl transition-all duration-300 ${isSpinning ? "animate-spin" : ""
                    }`}
                style={{ animationDelay: `${delay}ms` }}
            >
                {isSpinning ? <div className="animate-bounce">🎰</div> : <div className="animate-pulse">{symbol}</div>}
            </div>
            {isSpinning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse"></div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 pt-40">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">🎰 Slots</h1>
                    <p className="text-gray-600">Spin to win big!</p>
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

                {/* Slot Machine */}
                <Card className="mb-6 bg-gradient-to-b from-yellow-100 to-yellow-200 shadow-2xl border-4 border-yellow-400">
                    <CardContent className="p-8">
                        <div className="text-center">
                            {/* Reels */}
                            <div className="flex justify-center gap-4 mb-8">
                                {gameState.reels.map((symbol, index) => (
                                    <SlotReel key={index} symbol={symbol} isSpinning={spinningReels[index]} delay={index * 200} />
                                ))}
                            </div>

                            {/* Result Display */}
                            {gameState.result && (
                                <div
                                    className={`text-xl font-bold mb-4 p-4 rounded-lg ${gameState.winAmount > 0
                                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                                        : "bg-gray-100 text-gray-700 border-2 border-gray-300"
                                        }`}
                                >
                                    {gameState.result}
                                </div>
                            )}

                            {/* Spinning Status */}
                            {gameState.isSpinning && (
                                <div className="text-xl text-purple-600 mb-4 animate-pulse">
                                    <Zap className="w-6 h-6 inline mr-2" />
                                    Spinning...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Paytable */}
                <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-center mb-4">Paytable (3 of a kind)</h3>
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            {symbols.map((symbol, index) => (
                                <div key={index} className="flex flex-col items-center p-2 rounded bg-gray-50">
                                    <div className="text-2xl mb-1">{symbol.symbol}</div>
                                    <div className="font-semibold">{symbol.value}x</div>
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
                                onClick={spin}
                                disabled={Number.parseInt(betAmount) > gameState.playerMoney || Number.parseInt(betAmount) <= 0}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-xl"
                            >
                                🎰 SPIN 🎰
                            </Button>
                        </div>
                    )}

                    {gameState.gamePhase === "spinning" && <div className="text-lg text-gray-600">Good luck! 🍀</div>}

                    {gameState.gamePhase === "result" && (
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button onClick={newGame} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
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
