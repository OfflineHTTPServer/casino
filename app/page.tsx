"use client"

import type React from "react"

import { useState } from "react"
import { Play, Sword, Zap, Crown, Gamepad2, CreditCard, FerrisWheel } from "lucide-react"

interface Game {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    variant: "gradient" | "glow" | "pulse" | "slide" | "morph"
    colors: {
        from: string
        to: string
        accent: string
    }
}

const games: Game[] = [
    {
        id: "games/blackjack",
        title: "Black Jack",
        description: "BlackJack - A classical game on modern systems",
        icon: <Sword className="w-8 h-8" />,
        variant: "gradient",
        colors: {
            from: "from-purple-500",
            to: "to-pink-500",
            accent: "purple-400",
        },
    },
    {
        id: "games/slots",
        title: "Slots",
        description: "The game everyone knows",
        icon: <Zap className="w-8 h-8" />,
        variant: "glow",
        colors: {
            from: "from-cyan-500",
            to: "to-blue-500",
            accent: "cyan-400",
        },
    },
    {
        id: "games/color-crash",
        title: "Color Crash",
        description: "Win or Crash",
        icon: <Crown className="w-8 h-8" />,
        variant: "pulse",
        colors: {
            from: "from-yellow-500",
            to: "to-orange-500",
            accent: "yellow-400",
        },
    },
    {
        id: "games/roulette",
        title: "Roulette",
        description: "Play Roulette!",
        icon: <Play className="w-8 h-8" />,
        variant: "slide",
        colors: {
            from: "from-indigo-500",
            to: "to-purple-500",
            accent: "indigo-400",
        },
    },
    {
        id: "games/dice",
        title: "Dice",
        description: "Roll the dice!",
        icon: <Gamepad2 className="w-8 h-8" />,
        variant: "morph",
        colors: {
            from: "from-green-500",
            to: "to-emerald-500",
            accent: "green-400",
        },
    },
    {
        id: "games/baccarat",
        title: "Baccarat",
        description: "Try your luck with cards!",
        icon: <CreditCard className="w-8 h-8" />,
        variant: "glow",
        colors: {
            from: "from-purple-500",
            to: "to-violet-500",
            accent: "purple-400",
        },
    },
    {
        id: "games/wheel",
        title: "Wheel of Fortune",
        description: "Spin the wheel!",
        icon: <FerrisWheel className="w-8 h-8" />,
        variant: "slide",
        colors: {
            from: "from-yellow-500",
            to: "to-orange-500",
            accent: "yellow-500",
        },
    }
]

export default function () {

    const [hoveredGame, setHoveredGame] = useState<string | null>(null)

    const getButtonClasses = (game: Game, isHovered: boolean) => {
        const baseClasses =
            "relative group p-8 rounded-2xl border border-gray-200 backdrop-blur-sm transition-all duration-500 cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-xl"

        switch (game.variant) {
            case "gradient":
                return `${baseClasses} ${isHovered ? "scale-105 shadow-2xl" : "hover:scale-105"}`

            case "glow":
                return `${baseClasses} ${isHovered ? `shadow-2xl shadow-${game.colors.accent}/30 scale-105` : ""}`

            case "pulse":
                return `${baseClasses} ${isHovered ? "animate-pulse scale-105" : ""}`

            case "slide":
                return `${baseClasses} ${isHovered ? "scale-105" : ""}`

            case "morph":
                return `${baseClasses} ${isHovered ? "scale-105 rotate-1" : ""}`

            default:
                return baseClasses
        }
    }

    const getBackgroundElement = (game: Game, isHovered: boolean) => {
        switch (game.variant) {
            case "gradient":
                return (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${game.colors.from} ${game.colors.to} opacity-10 transition-opacity duration-500 ${isHovered ? "opacity-20" : ""}`}
                    />
                )

            case "glow":
                return (
                    <>
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${game.colors.from} ${game.colors.to} opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-15" : ""}`}
                        />
                        <div
                            className={`absolute -inset-1 bg-gradient-to-r ${game.colors.from} ${game.colors.to} rounded-2xl blur opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-20" : ""}`}
                        />
                    </>
                )

            case "pulse":
                return (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${game.colors.from} ${game.colors.to} opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-15" : ""}`}
                    />
                )

            case "slide":
                return (
                    <div
                        className={`absolute inset-0 bg-gradient-to-r ${game.colors.from} ${game.colors.to} opacity-20 transform transition-transform duration-500 ${isHovered ? "translate-x-0" : "-translate-x-full"}`}
                    />
                )

            case "morph":
                return (
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${game.colors.from} ${game.colors.to} opacity-0 transition-all duration-500 ${isHovered ? "opacity-15 scale-110" : ""}`}
                    />
                )

            default:
                return null
        }
    }

    return (
        <div className="container mx-auto p-8 pt-24">
            <h1 className="mb-4 text-center text-3xl font-bold">
                Welcome to Royal Casino!
            </h1>
            <p className="mb-10 text-center text-sm text-zinc-500">
                Royal Casino is a {" "}
                <span className="font-medium">Simulation</span>. The site was created for educational purposes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {games.map((game) => {
                    const isHovered = hoveredGame === game.id

                    return (
                        <div
                            key={game.id}
                            className={getButtonClasses(game, isHovered)}
                            onMouseEnter={() => setHoveredGame(game.id)}
                            onMouseLeave={() => setHoveredGame(null)}
                        >
                            {getBackgroundElement(game, isHovered)}

                            <div className="relative z-10 text-center"
                                onClick={() => {
                                    window.location.href = game.id
                                }}
                            >
                                <div
                                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 backdrop-blur-sm mb-6 transition-all duration-300 ${isHovered ? `text-${game.colors.accent} scale-110` : "text-gray-600"}`}
                                >
                                    {game.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mb-3 transition-transform duration-300 group-hover:scale-105">
                                    {game.title}
                                </h3>

                                <p className="text-gray-600 text-sm leading-relaxed mb-6">{game.description}</p>

                                <div
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 backdrop-blur-sm text-gray-700 font-medium transition-all duration-300 ${isHovered ? "bg-gray-200 scale-105" : ""}`}
                                >
                                    <Play className="w-4 h-4" />
                                    Play Now
                                </div>
                            </div>

                            <div
                                className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${game.colors.from} ${game.colors.to} opacity-0 transition-opacity duration-500 ${isHovered ? "opacity-30" : ""}`}
                                style={{ mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "xor" }}
                            />
                        </div>
                    )
                })}

                <div className="relative group p-8 rounded-2xl border-2 border-dashed border-gray-300 backdrop-blur-sm transition-all duration-500 cursor-pointer hover:border-gray-400 hover:scale-105 flex items-center justify-center bg-white shadow-lg">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 backdrop-blur-sm mb-6 text-gray-400">
                            <Play className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mb-3">More Games</h3>
                        <p className="text-gray-500 text-sm">Coming Soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
