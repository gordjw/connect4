'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Grid from '@/components/grid'

export default function GridController({ rows = 6, columns = 7 }) {
    const [grid, setGrid] = useState()
    const [player, setPlayer] = useState(1)
    const [lastCell, setLastCell] = useState()
    const [winner, setWinner] = useState(null)

    rows = parseInt(rows)
    columns = parseInt(columns)

    // Initialise an empty grid
    useEffect(() => {
        setGrid(Array(rows * columns).fill(0))
    }, [])

    // Switch between players each time someone puts a token down
    useEffect(() => {
        setPlayer(player === 1 ? 2 : 1)
    }, [grid])

    // When someone makes a move, lastCell is changed and we check to see if that results in a win
    useEffect(() => {
        if (typeof grid !== 'undefined')
            checkForWinningMove(grid, player, lastCell)
    }, [lastCell])

    // If someone wins, party!
    useEffect(() => {
        if (winner !== null)
            alert("Winner is Player " + winner)
    }, [winner])


    // We only need to check around the latest move
    function checkForWinningMove(grid, player, cell) {
        // Arrays are 0 indexed
        // The first row is the 0th row, the first cell is the 0th cell, etc
        // Row = floor(cell / 7)
        // Col = (cell % 7)
        const row = Math.floor((parseInt(cell) / columns));

        // Horizontal assessment
        // We need to check in both directions, because the winning move might be anywhere in a range of up to 7 spaces 
        // E.g.       |
        //      x x x . x x x
        const rowFirstCell = (row * columns);
        const rowLastCell = ((row + 1) * columns) - 1;
        // What's the first cell in this row we need to check
        // Can't go beyond the left edge
        const startCell = Math.max(rowFirstCell, parseInt(cell) - 3) 

        // What's the last cell to check in this row
        // Can't go beyond the right edge
        const endCell = Math.min(parseInt(cell) + 3, rowLastCell) 

        // Select the cells to test
        const horizontalTestCells = grid.slice(startCell, endCell + 1)
        checkCellsForWinningStreak(horizontalTestCells);

        // Vertical assessment
        // We only need to check downwards, because the winning move can only come at the top of a stack of other tokens
        // E.g.
        //       |
        //       .
        //       x
        //       x
        //       x
        const verticalTestCells = Array();
        let n = parseInt(cell);

        while (n < grid.length) {
            verticalTestCells.push(grid[n])
            n = n + columns;
        }

        checkCellsForWinningStreak(verticalTestCells);


        // Diagonal Left-To-Right assessment
        const diagonalLTRTestCells = Array();
        let t = Array()

        // Add the origin to top-left leg
        n = parseInt(cell);
        let i = 0;
        let currentRow = row
        let previousRow = row
        while ((n >= 0) && (i <= 3)) {
            // The difference in rows should always be 1, unless we ran into the edge of the board
            // If we were at the edge, there will be a difference in rows of 2
            // E.g. currentCell / 7 = 1; previousCell / 7 = 3
            // If this is the case, we have hit the edge of the board and can stop processing this leg now. 
            if (previousRow - currentRow > 1)
                break;

            diagonalLTRTestCells.push(grid[n])
            t.push(n)
            n = n - (columns + 1);
            i++;
            previousRow = currentRow
            currentRow = Math.floor(n / columns)
        }
        // We ultimately have to check in a contiguous line 
        // So the first leg, origin to Top-Left, needs to be reversed before we add origin to Bottom-Right
        diagonalLTRTestCells.reverse();
        t.reverse();

        // Remove the origin so that it's not duplicated in the next loop There's probably a better way to do this.
        diagonalLTRTestCells.pop();
        t.pop()

        // Reset our counters
        n = parseInt(cell); // Recenter back on the origin cell
        i = 0;
        currentRow = row
        previousRow = row
        while ((n < grid.length) && (i <= 3)) {
            // The difference in rows should always be 1, unless we ran into the edge of the board
            // If we were at the edge, there will be a difference in rows of 2
            // E.g. currentCell / 7 = 1; previousCell / 7 = 3
            // If this is the case, we have hit the edge of the board and can stop processing this leg now. 
            if (currentRow - previousRow > 1)
                break;

            diagonalLTRTestCells.push(grid[n]) // Do this last, so that we're not adding the origin again
            t.push(n)
            n = n + (columns + 1);
            i++;
            previousRow = currentRow
            currentRow = Math.floor(n / columns)
        }

        checkCellsForWinningStreak(diagonalLTRTestCells);



        // Diagonal Right-To-Left assessment
        const diagonalRTLTestCells = Array();
        t = Array()

        // Add 
        n = parseInt(cell);
        i = 0;
        currentRow = Math.floor(n / columns)
        previousRow = currentRow
        while ((n >= 0) && (i <= 3)) {
            // The difference in rows should always be 1, unless we ran into the edge of the board
            // If we were at the edge, there will be a difference in rows of 2
            // E.g. currentCell / 7 = 1; previousCell / 7 = 3
            // If this is the case, we have hit the edge of the board and can stop processing this leg now. 
            if (previousRow - currentRow > 1)
                break;

            diagonalRTLTestCells.push(grid[n])
            t.push(n)
            n = n - (columns - 1); // Move diagonally left-to-right (upwards)
            i++;
            previousRow = currentRow
            currentRow = Math.floor(n / columns)
        }
        // We ultimately have to check in a contiguous line 
        // So the first leg, origin to Top-Left, needs to be reversed before we add origin to Bottom-Right
        diagonalRTLTestCells.reverse();
        t.reverse();

        // Remove the origin so that it's not duplicated in the next loop There's probably a better way to do this.
        diagonalRTLTestCells.pop();
        t.pop()

        // Reset our counters
        n = parseInt(cell); // Recenter back on the origin cell
        i = 0;
        currentRow = Math.floor(n / columns)
        previousRow = currentRow
        while ((n < grid.length) && (i <= 3)) {
            // The difference in rows should always be 1, unless we ran into the edge of the board
            // If we were at the edge, there will be a difference in rows of 2
            // E.g. currentCell / 7 = 1; previousCell / 7 = 3
            // If this is the case, we have hit the edge of the board and can stop processing this leg now. 
            if (currentRow - previousRow > 1)
                break;

            diagonalRTLTestCells.push(grid[n]) // Do this last, so that we're not adding the origin again
            t.push(n)
            n = n + (columns - 1); // Move diagonally right-to-left (downwards)
            i++;
            previousRow = currentRow
            currentRow = Math.floor(n / columns)
        }

        checkCellsForWinningStreak(diagonalRTLTestCells);
    }


    function checkCellsForWinningStreak(cells) {
        cells.reduce(
            (acc, c, i, a) => {

                // console.log("p: " + player)
                // console.log("acc: " + acc + " c: " + c);
                // console.log("c: " + c + " ai: " + a[i])


                // if current item matches the player's token, add 1 to the streak counter, otherwise reset the streak to 0
                const streak = c === player ? acc + 1 : 0;
                // console.log("streak: " + streak)

                // if the streak counter ever reaches 4, we have a winner!
                if (streak === 4)
                    setWinner(player)

                return streak;
            },
            0   // Always start at 0, because the first element in the array to be checked might be the other player's token.
        )
    }

    function handleClick(e) {

        // In Connect 4, the player drops a token into a column
        // So we need to check that:
        //   - there is space in that column
        //   - what the lowest free space is
        // And then make the token drop to that lowest free space
        // If there is no free space, then the player hasn't taken their turn and needs to choose another column
        let cell = e.target.dataset.cell % columns;
        let checkCell = cell;

        // Find the lowest possible space for the token to fall to
        while (grid[cell] === 0) {
            console.log("Cell: " + cell)
            cell = cell + columns;
        }
        // Back up to the last free space
        cell = cell - columns;

        // If there was no space in this column, don't allow a move to be made
        if (cell < 0)
            return;

        const newGrid = [...grid] // Create a deep copy, so that we're not directly modifying grid and causing side-effects
        newGrid.splice(cell, 1, player)

        setGrid(newGrid)
        setLastCell(cell)

        const rotate = Math.floor(Math.random() * 360)
        document.querySelector(`[data-cell='${cell}']`).style.setProperty('transform', `rotate(${rotate}deg)`)
    }


    return (
        <Grid grid={grid} onClick={handleClick} />
    )
}