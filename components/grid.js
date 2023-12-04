import React from 'react'
import { useState, useEffect } from 'react'
import GridCell from './grid-cell'

export default function Grid({ grid, onClick }) {

    if(typeof grid === 'undefined')
        return <p>Loading...</p>

    return (
        <div className="grid">
            {grid.map((value, i) => {

                return <GridCell value={value} onClick={onClick} key={i} cell={i} />

            })}
        </div>
    )
}