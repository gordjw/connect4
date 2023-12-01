

export default function GridCell({ value, row, col, onClick }) {
    return (
        <div className="col"><input type="text" value={value} onClick={onClick} data-row={row} data-col={col}/></div>
    )
}