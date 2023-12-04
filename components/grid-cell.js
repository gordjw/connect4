

export default function GridCell({ value, cell, onClick }) {
    return (
        <div className="cell"><input type="text" value={value} onClick={onClick} data-cell={cell} /></div>
    )
}