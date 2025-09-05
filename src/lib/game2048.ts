export interface GameState {
  board: number[][];
  score: number;
  gameOver: boolean;
  won: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export class Game2048 {
  private board: number[][];
  private score: number;
  private gameOver: boolean;
  private won: boolean;

  constructor() {
    this.board = Array(4).fill(null).map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  getState(): GameState {
    return {
      board: this.board.map(row => [...row]),
      score: this.score,
      gameOver: this.gameOver,
      won: this.won
    };
  }

  private addRandomTile(): void {
    const emptyCells: { row: number; col: number }[] = [];
    
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  private canMove(): boolean {
    // Check if there are empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    // Check if adjacent cells can merge
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];
        
        // Check right
        if (col < 3 && this.board[row][col + 1] === current) {
          return true;
        }
        
        // Check down
        if (row < 3 && this.board[row + 1][col] === current) {
          return true;
        }
      }
    }

    return false;
  }

  move(direction: Direction): boolean {
    if (this.gameOver) return false;

    let moved = false;

    switch (direction) {
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.addRandomTile();
      
      if (!this.canMove()) {
        this.gameOver = true;
      }
    }

    return moved;
  }

  private moveLeft(): boolean {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
      const line = this.board[row].filter(cell => cell !== 0);
      const merged = this.mergeLine(line);
      
      // Pad with zeros
      while (merged.length < 4) {
        merged.push(0);
      }
      
      // Check if the line changed
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== merged[col]) {
          moved = true;
        }
        this.board[row][col] = merged[col];
      }
    }
    
    return moved;
  }

  private moveRight(): boolean {
    let moved = false;
    
    for (let row = 0; row < 4; row++) {
      const line = this.board[row].filter(cell => cell !== 0);
      const merged = this.mergeLine(line);
      
      // Pad with zeros at the beginning
      while (merged.length < 4) {
        merged.unshift(0);
      }
      
      // Check if the line changed
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== merged[col]) {
          moved = true;
        }
        this.board[row][col] = merged[col];
      }
    }
    
    return moved;
  }

  private moveUp(): boolean {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
      const line = [];
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          line.push(this.board[row][col]);
        }
      }
      
      const merged = this.mergeLine(line);
      
      // Pad with zeros
      while (merged.length < 4) {
        merged.push(0);
      }
      
      // Check if the line changed and update board
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== merged[row]) {
          moved = true;
        }
        this.board[row][col] = merged[row];
      }
    }
    
    return moved;
  }

  private moveDown(): boolean {
    let moved = false;
    
    for (let col = 0; col < 4; col++) {
      const line = [];
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          line.push(this.board[row][col]);
        }
      }
      
      const merged = this.mergeLine(line);
      
      // Pad with zeros at the beginning
      while (merged.length < 4) {
        merged.unshift(0);
      }
      
      // Check if the line changed and update board
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== merged[row]) {
          moved = true;
        }
        this.board[row][col] = merged[row];
      }
    }
    
    return moved;
  }

  private mergeLine(line: number[]): number[] {
    const merged: number[] = [];
    let i = 0;
    
    while (i < line.length) {
      if (i < line.length - 1 && line[i] === line[i + 1]) {
        const mergedValue = line[i] * 2;
        merged.push(mergedValue);
        this.score += mergedValue;
        
        // Check for win condition
        if (mergedValue === 2048 && !this.won) {
          this.won = true;
        }
        
        i += 2; // Skip the next element
      } else {
        merged.push(line[i]);
        i++;
      }
    }
    
    return merged;
  }

  reset(): void {
    this.board = Array(4).fill(null).map(() => Array(4).fill(0));
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.addRandomTile();
    this.addRandomTile();
  }
}
