import React from 'react'
import { useState, useEffect } from 'react'
import GridCell from './grid-cell'

export default function Grid({ grid, onClick }) {

    if(typeof grid === 'undefined')
        return <p>Loading...</p>

    return (
        <div className="grid">
            {grid.map((r, i) => {

                const row = r.map((c, j) => {
                    return <GridCell value={c} onClick={onClick} key={j} row={i} col={j} />
                })

                return ( <div className="row" key={i}>{row}</div> )
            })}
        </div>
    )
}