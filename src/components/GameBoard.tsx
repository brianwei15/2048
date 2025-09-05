'use client';

import { useState, useEffect, useCallback } from 'react';
import { Game2048, Direction } from '@/lib/game2048';
import { scores } from '@/lib/auth';

interface GameBoardProps {
  user: { id: string; email: string } | null;
  onScoreUpdate: (score: number) => void;
}

export default function GameBoard({ user, onScoreUpdate }: GameBoardProps) {
  const [game] = useState(new Game2048());
  const [gameState, setGameState] = useState(game.getState());
  const [isAnimating, setIsAnimating] = useState(false);

  const moveTiles = useCallback(async (direction: Direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const moved = game.move(direction);
    
    if (moved) {
      const newState = game.getState();
      setGameState(newState);
      onScoreUpdate(newState.score);

      // Save score if user is signed in and game is over
      if (newState.gameOver && user) {
        try {
          await scores.saveScore(newState.score, newState.board);
        } catch (error) {
          console.error('Failed to save score:', error);
        }
      }
    }

    setTimeout(() => setIsAnimating(false), 50);
  }, [isAnimating, game, user, onScoreUpdate]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isAnimating) return;

    let direction: Direction | null = null;
    
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      default:
        return;
    }

    event.preventDefault();
    moveTiles(direction);
  }, [isAnimating, moveTiles]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const resetGame = () => {
    game.reset();
    const newState = game.getState();
    setGameState(newState);
    onScoreUpdate(newState.score);
  };

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-200',
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-orange-100 text-gray-800',
      8: 'bg-orange-200 text-orange-900',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-red-200 text-red-900',
      64: 'bg-red-300 text-red-900',
      128: 'bg-yellow-200 text-yellow-900',
      256: 'bg-yellow-300 text-yellow-900',
      512: 'bg-green-200 text-green-900',
      1024: 'bg-green-300 text-green-900',
      2048: 'bg-blue-300 text-blue-900',
    };
    return colors[value] || 'bg-purple-300 text-purple-900';
  };

  const getTileTextSize = (value: number) => {
    if (value >= 1024) return 'text-lg';
    if (value >= 128) return 'text-xl';
    if (value >= 16) return 'text-2xl';
    return 'text-3xl';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">2048</h1>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">SCORE</div>
            <div className="text-xl font-bold text-gray-800">{gameState.score}</div>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-2 p-2 bg-gray-300 rounded-lg">
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                  flex items-center justify-center
                  rounded-lg font-bold
                  transition-all duration-75 ease-in-out
                  ${getTileColor(cell)}
                  ${getTileTextSize(cell)}
                  ${cell === 0 ? 'invisible' : 'visible'}
                  ${isAnimating ? 'transform scale-105' : ''}
                `}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Game Status */}
      {gameState.won && !gameState.gameOver && (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">You Win!</div>
          <div className="text-gray-600">Keep playing to reach a higher score!</div>
        </div>
      )}

      {gameState.gameOver && (
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">Game Over!</div>
          <div className="text-gray-600">Final Score: {gameState.score}</div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-gray-600 text-sm max-w-md">
        <p>Use arrow keys to move tiles. Tiles with the same number merge into one when they touch.</p>
      </div>
    </div>
  );
}