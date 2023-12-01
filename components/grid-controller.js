'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Grid from '@/components/grid'

export default function GridController({ rows = 6, columns = 7 }) {
    const [grid, setGrid] = useState()
    const [player, setPlayer] = useState(1)

    // Initialise an empty grid
    useEffect(() => {
        setGrid(Array(rows).fill(
            Array(columns).fill(0)
        ))    
    }, [])

    useEffect(() => {
        setPlayer( player === 1 ? 2 : 1)
        console.log(player)
    }, [grid])

    function getNewValue(oldValue) {
        if( oldValue > 0 ) {
            return oldValue
        } else {
            return player
        }
    }


    function handleClick(e) {

        const newValue = getNewValue(parseInt(e.target.value))
        if (newValue === parseInt(e.target.value)) // No move was made
            return

        const newGrid = grid.slice()
        const newRow = newGrid[e.target.dataset.row].slice()
        newRow.splice(e.target.dataset.col, 1, newValue)
        newGrid.splice(e.target.dataset.row,1,newRow)
        setGrid(newGrid)
    }


    return (
        <Grid grid={grid} onClick={handleClick} />
    )
}