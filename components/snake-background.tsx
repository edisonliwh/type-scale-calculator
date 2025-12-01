"use client";

import { useEffect, useRef, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Position {
  x: number;
  y: number;
}

interface SnakeBackgroundProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function SnakeBackground({ containerRef, enabled = true, onToggle }: SnakeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [score, setScore] = useState(0);
  const [homeCount, setHomeCount] = useState(0);
  const [tooltips, setTooltips] = useState<Array<{ id: number; x: number; y: number; text?: string }>>([]);
  const foodRef = useRef<Position & { emoji: string } | null>(null);
  const homeRef = useRef<Position | null>(null);
  const snakeRef = useRef<(Position & { emoji?: string })[]>([]);
  const cellSizeRef = useRef(16);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);
  const tooltipIdRef = useRef(0);
  const gameStartTimeRef = useRef<number | null>(null);
  const gamePausedRef = useRef(false); // Track if game is paused due to reaching 100

  useEffect(() => {
    if (!enabled) {
      gameStartTimeRef.current = null;
      return;
    }
    
    // Track when game is enabled
    if (gameStartTimeRef.current === null) {
      gameStartTimeRef.current = Date.now();
      gamePausedRef.current = false; // Reset pause state when game starts
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      } else {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Also listen for container resize if using ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef?.current) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (resizeObserver && containerRef?.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef, enabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);
    
    // Improve text rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cellSize = 16; // 20% smaller (20 * 0.8 = 16)
    cellSizeRef.current = cellSize;
    const cols = Math.floor(dimensions.width / cellSize);
    const rows = Math.floor(dimensions.height / cellSize);
    colsRef.current = cols;
    rowsRef.current = rows;
    

    // Food emojis
    const foodEmojis = ['🍏', '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧃', '🧉', '🧊'];
    
    // Snake state - each segment stores its position and emoji (if it's a food segment)
    let snake: (Position & { emoji?: string })[] = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    snakeRef.current = snake;
    let direction: Position = { x: 1, y: 0 };
    let food: Position & { emoji: string } = { 
      x: Math.floor(cols * 0.7), 
      y: Math.floor(rows * 0.7),
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
    };
    foodRef.current = { ...food }; // Initialize ref
    
    // Home positions (bottom corners with 40px padding) - update when dimensions change
    const paddingCells = Math.ceil(40 / cellSize); // Convert 40px to cells
    const homes: Position[] = [
      { x: paddingCells, y: rows - 1 - paddingCells }, // Bottom-left
      { x: cols - 1 - paddingCells, y: rows - 1 - paddingCells } // Bottom-right
    ];
    homeRef.current = homes[0]; // Store first home for ref (we'll check all homes)
    
    let currentScore = 0;
    const baseSpeed = 150; // milliseconds (current speed)
    const minSpeed = baseSpeed / 2; // 75ms (2x faster, max speed)
    const maxSpeed = baseSpeed; // 150ms (current speed, min speed)

      // Generate new food position with random emoji
      const generateFood = (): Position & { emoji: string } => {
        let newFood: Position & { emoji: string };
        const paddingCells = Math.ceil(40 / cellSize); // Convert 40px to cells
        const homes: Position[] = [
          { x: paddingCells, y: rows - 1 - paddingCells }, // Bottom-left
          { x: cols - 1 - paddingCells, y: rows - 1 - paddingCells } // Bottom-right
        ];
        do {
          newFood = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
            emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
          };
        } while (
          snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
          homes.some(home => newFood.x === home.x && newFood.y === home.y) // Don't spawn on any home corner
        );
        return newFood;
      };

    // Auto-move logic - simple AI that moves towards food
    const getNextDirection = (): Position => {
      const head = snakeRef.current[0] || snake[0];
      const targetFood = foodRef.current || food;
      const dx = targetFood.x - head.x;
      const dy = targetFood.y - head.y;

      // Try to move towards food, but avoid walls and self
      const possibleMoves: Position[] = [
        { x: 1, y: 0 },  // right
        { x: -1, y: 0 }, // left
        { x: 0, y: 1 },  // down
        { x: 0, y: -1 }, // up
      ];

      // Filter out moves that would hit walls or snake body
      const validMoves = possibleMoves.filter(move => {
        const nextX = head.x + move.x;
        const nextY = head.y + move.y;
        
        // Check walls
        if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) return false;
        
        // Check snake body (except tail, which will move)
        const nextPos = { x: nextX, y: nextY };
        const currentSnake = snakeRef.current.length > 0 ? snakeRef.current : snake;
        return !currentSnake.slice(0, -1).some(segment => 
          segment.x === nextPos.x && segment.y === nextPos.y
        );
      });

      if (validMoves.length === 0) return direction; // No valid moves, keep current

      // Prefer moves towards food
      const movesTowardsFood = validMoves.filter(move => {
        const nextX = head.x + move.x;
        const nextY = head.y + move.y;
        const targetFood = foodRef.current || food;
        const newDx = targetFood.x - nextX;
        const newDy = targetFood.y - nextY;
        return Math.abs(newDx) + Math.abs(newDy) < Math.abs(dx) + Math.abs(dy);
      });

      const movesToUse = movesTowardsFood.length > 0 ? movesTowardsFood : validMoves;
      
      // Prefer current direction if it's valid
      const currentDirValid = movesToUse.some(m => m.x === direction.x && m.y === direction.y);
      if (currentDirValid) return direction;

      // Otherwise pick a random valid move towards food
      return movesToUse[Math.floor(Math.random() * movesToUse.length)];
    };

    // Game loop
    const gameLoop = () => {
      // Ensure we have valid dimensions and canvas context
      if (dimensions.width === 0 || dimensions.height === 0 || !ctx || cols === 0 || rows === 0) {
        return;
      }
      
      // Check if we should pause movement (but always draw)
      const shouldPauseInitial = gameStartTimeRef.current !== null && (Date.now() - gameStartTimeRef.current < 3000);
      const shouldPause = shouldPauseInitial || gamePausedRef.current;
      
      // Always draw, but only move if not paused
      if (!shouldPause) {
        // Update direction
        direction = getNextDirection();

        // Move snake
        const head = snake[0];
        const oldHeadPosition = { x: head.x, y: head.y }; // Store old head position
        const newHead: Position = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= cols ||
          newHead.y < 0 ||
          newHead.y >= rows
        ) {
          // Reset game
          snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
          direction = { x: 1, y: 0 };
          food = generateFood();
          currentScore = 0;
          setScore(0);
          gamePausedRef.current = false; // Reset pause state
          snakeRef.current = [...snake];
          foodRef.current = { ...food };
        } else {
          // Check self collision
          const currentSnake = snakeRef.current.length > 0 ? snakeRef.current : snake;
          if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            // Reset game
            snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
            direction = { x: 1, y: 0 };
            food = generateFood();
            currentScore = 0;
            setScore(0);
            gamePausedRef.current = false; // Reset pause state
            snakeRef.current = [...snake];
            foodRef.current = { ...food };
          } else {
            // Add new head
            snake.unshift(newHead); // Always add new head (🦀 will be drawn at index 0)
            snakeRef.current = [...snake]; // Update ref
            
            // Use foodRef for collision detection
            const foodForCollision = foodRef.current || food;
            if (newHead.x === foodForCollision.x && newHead.y === foodForCollision.y) {
              // Eating food - just grow (don't add food emoji, just don't remove tail)
              currentScore++;
              setScore(currentScore);
              
              // Check if score reached 100 and pause game
              if (currentScore >= 100) {
                gamePausedRef.current = true;
              }
              
              // Show tooltip above the crab
              const tooltipId = tooltipIdRef.current++;
              const cellSize = cellSizeRef.current;
              // Calculate tooltip position relative to viewport (canvas is fixed)
              const tooltipX = newHead.x * cellSize + cellSize / 2;
              const tooltipY = newHead.y * cellSize - 20; // Offset above the crab
              
              setTooltips(prev => [...prev, { id: tooltipId, x: tooltipX, y: tooltipY, text: '✨ +1' }]);
              
              // Remove tooltip after 2 seconds
              setTimeout(() => {
                setTooltips(prev => prev.filter(t => t.id !== tooltipId));
              }, 2000);
              
              food = generateFood();
              foodRef.current = { ...food }; // Update ref
            } else {
              // Not eating - remove tail
              snake.pop();
              snakeRef.current = [...snake]; // Update ref
            }
          }
        }
      }

      // Clear canvas (no background fill, grid is on page background)
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw home emojis on bottom corners with 40px padding
      const paddingCells = Math.ceil(40 / cellSize); // Convert 40px to cells
      const homes: Position[] = [
        { x: paddingCells, y: rows - 1 - paddingCells }, // Bottom-left
        { x: cols - 1 - paddingCells, y: rows - 1 - paddingCells } // Bottom-right
      ];
      ctx.globalAlpha = 1.0;
      ctx.font = `${Math.round(cellSize * 1.8)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      homes.forEach(home => {
        const homeX = Math.round(home.x * cellSize + cellSize / 2);
        const homeY = Math.round(home.y * cellSize + cellSize / 2);
        ctx.fillText('🏡', homeX, homeY);
      });

      // Draw food as random emoji (full opacity, larger size, crisp rendering)
      // Always use local food variable (it's initialized in this scope)
      if (food && food.emoji) {
        // Sync food position and emoji from ref (in case it was moved or regenerated)
        if (foodRef.current) {
          if (food.x !== foodRef.current.x || food.y !== foodRef.current.y || food.emoji !== foodRef.current.emoji) {
            food.x = foodRef.current.x;
            food.y = foodRef.current.y;
            food.emoji = foodRef.current.emoji;
          }
        }
        // Only draw food if it's not at any home position
        const isAtHome = homes.some(home => food.x === home.x && food.y === home.y);
        if (!isAtHome) {
          ctx.globalAlpha = 1.0;
          ctx.font = `${Math.round(cellSize * 1.8)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Round coordinates for crisp rendering
          const foodX = Math.round(food.x * cellSize + cellSize / 2);
          const foodY = Math.round(food.y * cellSize + cellSize / 2);
          ctx.fillText(food.emoji, foodX, foodY);
        }
      }

      // Draw snake (head as 🦀, body is invisible)
      // Always use local snake variable (it's initialized and updated in this scope)
      if (snake && snake.length > 0) {
        snake.forEach((segment, index) => {
          if (index === 0) {
            // Draw snake head as 🦀 emoji (full opacity, larger size, crisp rendering)
            ctx.globalAlpha = 1.0;
            ctx.font = `${Math.round(cellSize * 1.8)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Round coordinates for crisp rendering
            const headX = Math.round(segment.x * cellSize + cellSize / 2);
            const headY = Math.round(segment.y * cellSize + cellSize / 2);
            ctx.fillText('🦀', headX, headY);
          }
          // Body segments are invisible - only show the head
        });
      }
      
      // Update refs during pause to ensure they're available for other code
      if (shouldPause) {
        snakeRef.current = [...snake];
        if (food && food.emoji) {
          foodRef.current = { ...food };
        }
      }
      
      // Reset global alpha
      ctx.globalAlpha = 1.0;
    };

    let timeoutId: NodeJS.Timeout | null = null;
    
    const scheduleNextLoop = () => {
      const randomSpeed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
      timeoutId = setTimeout(() => {
        gameLoop();
        scheduleNextLoop();
      }, randomSpeed);
    };

    // Initial draw
    gameLoop();
    scheduleNextLoop();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [dimensions]);

  // Keyboard controls for food movement
  useEffect(() => {
    if (!enabled) return;
    if (dimensions.width === 0 || dimensions.height === 0) return; // Wait for dimensions
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!foodRef.current || !homeRef.current) return;

      let newX = foodRef.current.x;
      let newY = foodRef.current.y;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newY = Math.max(0, foodRef.current.y - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY = Math.min(rowsRef.current - 1, foodRef.current.y + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newX = Math.max(0, foodRef.current.x - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX = Math.min(colsRef.current - 1, foodRef.current.x + 1);
          break;
        default:
          return; // Not an arrow key, ignore
      }

      // Check if new position doesn't overlap with snake
      if (!snakeRef.current.some(segment => segment.x === newX && segment.y === newY)) {
        // Check if food reached any home corner
        const cols = colsRef.current;
        const rows = rowsRef.current;
        const cellSize = cellSizeRef.current;
        const paddingCells = Math.ceil(40 / cellSize); // Convert 40px to cells
        const homes: Position[] = [
          { x: paddingCells, y: rows - 1 - paddingCells }, // Bottom-left
          { x: cols - 1 - paddingCells, y: rows - 1 - paddingCells } // Bottom-right
        ];
        
        const reachedHome = homes.some(home => newX === home.x && newY === home.y);
        
        if (reachedHome) {
          // Food reached home - increment count and generate new food
          setHomeCount(prev => {
            const newCount = prev + 1;
            // Check if homeCount reached 100 and pause game
            if (newCount >= 100) {
              gamePausedRef.current = true;
            }
            return newCount;
          });
          
          // Show tooltip at the home position
          const reachedHomePos = homes.find(home => newX === home.x && newY === home.y);
          if (reachedHomePos) {
            const tooltipId = tooltipIdRef.current++;
            const cellSize = cellSizeRef.current;
            // Calculate tooltip position relative to the home emoji
            const tooltipX = reachedHomePos.x * cellSize + cellSize / 2;
            const tooltipY = reachedHomePos.y * cellSize - 20; // Offset above the home emoji
            
            setTooltips(prev => [...prev, { id: tooltipId, x: tooltipX, y: tooltipY, text: '✨ +1' }]);
            
            // Remove tooltip after 2 seconds
            setTimeout(() => {
              setTooltips(prev => prev.filter(t => t.id !== tooltipId));
            }, 2000);
          }
          
          // Generate new food position
          if (cols > 0 && rows > 0) {
            const foodEmojis = ['🍏', '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧃', '🧉', '🧊'];
            let newFood: Position & { emoji: string };
            let attempts = 0;
            do {
              newFood = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
                emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
              };
              attempts++;
              if (attempts > 100) break; // Prevent infinite loop
            } while (
              snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
              homes.some(home => newFood.x === home.x && newFood.y === home.y)
            );
            if (newFood) {
              foodRef.current = newFood;
            }
          }
        } else {
          // Normal movement - update food position
          foodRef.current.x = newX;
          foodRef.current.y = newY;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [enabled, dimensions]);

  return (
    <>
      {/* Toggle - Always Visible */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative rounded-2xl flex flex-col transition-all bg-white/80 backdrop-blur-xl focus-visible:ring-0" style={{ boxShadow: "rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px" }}>
          <div className="px-3 py-2 overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2">
              <Switch
                id="crab-toggle"
                checked={enabled}
                onCheckedChange={onToggle}
                className="[&[data-state=checked]]:!bg-[oklch(64.6%_0.222_41.116)]"
              />
              <Label htmlFor="crab-toggle" className="text-sm font-medium text-gray-600 cursor-pointer whitespace-nowrap font-title flex items-center gap-1" style={{ fontSize: '14px' }}>
                <span>🦀</span>
                <span className="hidden lg:inline">Hungry crab</span>
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Game Canvas - Only when enabled */}
      {enabled && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-50"
            style={{ 
              pointerEvents: 'none' // Don't block UI interactions
            }}
          />
          
              {/* Badges and Tip - Top Right Below Toggle */}
              <div className="absolute top-[86px] right-4 z-50 flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/80 backdrop-blur-xl text-gray-700 font-title focus-visible:ring-0" style={{ fontSize: '14px', padding: '6px 14px', boxShadow: "rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px" }}>
                    🦀 {score}
                  </Badge>
                  <Badge className="bg-white/80 backdrop-blur-xl text-gray-700 font-title focus-visible:ring-0" style={{ fontSize: '14px', padding: '6px 14px', boxShadow: "rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px" }}>
                    🏡 {homeCount}
                  </Badge>
                </div>
                <p className="text-gray-500 text-right hidden 2xl:block" style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontSize: '12px', lineHeight: '1.4' }}>
                  <span className="block">Tip: Use keys ← ↑ → ↓</span>
                  <span className="block">to move food to 🏡</span>
                </p>
              </div>
      
          {/* Tooltips */}
          {tooltips.length > 0 && (
            <div className="absolute inset-0 z-[100] pointer-events-none">
              {tooltips.map(tooltip => (
                <div
                  key={tooltip.id}
                  className="absolute"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y}px`,
                    transform: 'translate(-50%, -100%)',
                    animation: 'fadeOutUp 2s ease-out forwards'
                  }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg border border-gray-200/50 text-sm font-medium text-gray-700 whitespace-nowrap">
                    {tooltip.text || '✨ +1'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

