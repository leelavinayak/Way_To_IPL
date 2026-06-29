import { useState, useEffect } from 'react';

const SeatGridBuilder = ({ seatType, onChange }) => {
  const [rows, setRows] = useState(10);
  const [colsPerSide] = useState(2);
  const [grid, setGrid] = useState([]);
  const [stats, setStats] = useState({ left: 0, right: 0, total: 0 });
  const [startNumber, setStartNumber] = useState(1);

  useEffect(() => {
    initGrid(rows);
  }, [rows, seatType]);

  const initGrid = (numRows) => {
    const newGrid = [];
    for (let r = 0; r < numRows; r++) {
      const row = [];
      const totalCols = colsPerSide * 2 + 1;
      for (let c = 0; c < totalCols; c++) {
        if (c === colsPerSide) {
          row.push({ type: 'aisle', seatNumber: '' });
        } else {
          const side = c < colsPerSide ? 'left' : 'right';
          row.push({
            type: 'seat',
            side,
            seatNumber: '',
            deck: seatType === 'sleeper' ? 'lower' : 'none',
            col: c,
          });
        }
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    updateStats(newGrid);
  };

  const updateStats = (currentGrid) => {
    let left = 0, right = 0;
    currentGrid.forEach(row => {
      row.forEach(cell => {
        if (cell.type === 'seat') {
          if (cell.side === 'left' && cell.seatNumber) left++;
          if (cell.side === 'right' && cell.seatNumber) right++;
        }
      });
    });
    setStats({ left, right, total: left + right });
  };

  const toggleCell = (rowIdx, colIdx) => {
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => {
        if (r === rowIdx && c === colIdx) {
          if (cell.type === 'aisle') return { ...cell, type: 'seat', seatNumber: '', side: c < colsPerSide ? 'left' : 'right', deck: seatType === 'sleeper' ? 'lower' : 'none' };
          return { ...cell, type: 'aisle', seatNumber: '' };
        }
        return cell;
      })
    );
    setGrid(newGrid);
    updateStats(newGrid);
  };

  const toggleDeck = (rowIdx, colIdx) => {
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => {
        if (r === rowIdx && c === colIdx && cell.type === 'seat') {
          return { ...cell, deck: cell.deck === 'lower' ? 'upper' : 'lower' };
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const autoNumber = () => {
    const newGrid = grid.map(row => [...row]);
    let leftNum = parseInt(startNumber);
    let rightNum = parseInt(startNumber);

    newGrid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.type === 'seat' && cell.side === 'left') {
          cell.seatNumber = `L${leftNum++}`;
        }
      });
      row.forEach((cell, c) => {
        if (cell.type === 'seat' && cell.side === 'right') {
          cell.seatNumber = `R${rightNum++}`;
        }
      });
    });

    setGrid(newGrid);
    updateStats(newGrid);
  };

  const clearAll = () => {
    initGrid(rows);
  };

  const emitMap = () => {
    const seatMap = [];
    grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell.type === 'seat' && cell.seatNumber) {
          seatMap.push({
            seatNumber: cell.seatNumber,
            side: cell.side,
            row: r + 1,
            col: c + 1,
            deck: cell.deck,
          });
        }
      });
    });
    return seatMap;
  };

  useEffect(() => {
    if (onChange) {
      onChange({
        seatMap: emitMap(),
        totalSeats: stats.total,
        leftSeatCount: stats.left,
        rightSeatCount: stats.right,
      });
    }
  }, [grid, stats]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Number of Rows</label>
          <input
            type="number"
            min={1}
            max={50}
            value={rows}
            onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 px-3 py-2 rounded-lg border text-black"
            style={{ borderColor: '#0057B8', background: '#F5F7FA', color: '#000000' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Start Number</label>
          <input
            type="number"
            min={1}
            value={startNumber}
            onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
            className="w-24 px-3 py-2 rounded-lg border text-black"
            style={{ borderColor: '#0057B8', background: '#F5F7FA', color: '#000000' }}
          />
        </div>
        <button
          type="button"
          onClick={autoNumber}
          className="px-4 py-2 rounded-lg text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, #0057B8, #0A2E5D)' }}
        >
          Auto Number Seats
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-2 rounded-lg font-medium text-sm border"
          style={{ borderColor: '#0057B8', color: '#0057B8' }}
        >
          Reset Grid
        </button>
      </div>

      <div className="flex gap-2 text-sm font-medium">
        <span style={{ color: '#0057B8' }}>Left Seats: {stats.left}</span>
        <span style={{ color: '#0A2E5D' }}>|</span>
        <span style={{ color: '#0057B8' }}>Right Seats: {stats.right}</span>
        <span style={{ color: '#0A2E5D' }}>|</span>
        <span style={{ color: '#000000' }}>Total Seats: {stats.total}</span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block p-4 rounded-xl border" style={{ background: '#FFFFFF', borderColor: '#0057B8' }}>
          <div className="flex flex-col gap-1.5">
            {grid.map((row, r) => (
              <div key={r} className="flex gap-1.5 items-center">
                <span className="text-xs w-6 text-right" style={{ color: '#666666' }}>{r + 1}</span>
                {row.map((cell, c) => {
                  if (cell.type === 'aisle') {
                    return <div key={c} className="w-10 h-10" />;
                  }
                  const isLeft = cell.side === 'left';
                  const isUpper = cell.deck === 'upper';
                  return (
                    <div
                      key={c}
                      onClick={() => toggleCell(r, c)}
                      onDoubleClick={() => seatType === 'sleeper' && toggleDeck(r, c)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold cursor-pointer select-none transition-all border-2"
                      style={{
                        background: cell.seatNumber
                          ? (isUpper ? 'linear-gradient(135deg, #F4B400, #E5A000)' : 'linear-gradient(135deg, #0057B8, #0A2E5D)')
                          : '#F5F7FA',
                        color: cell.seatNumber ? '#FFFFFF' : '#999999',
                        borderColor: cell.seatNumber ? 'transparent' : '#0057B8',
                      }}
                      title={cell.seatNumber ? `${cell.seatNumber} (${cell.deck}) - Click to remove` : `Click to add seat ${isLeft ? 'Left' : 'Right'}`}
                    >
                      {cell.seatNumber || (isLeft ? 'L+' : 'R+')}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-3 text-xs" style={{ color: '#666666' }}>
            <span><span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#0057B8' }} /> Lower</span>
            {seatType === 'sleeper' && (
              <span><span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#F4B400' }} /> Upper</span>
            )}
            <span><span className="inline-block w-3 h-3 rounded-sm border" style={{ borderColor: '#0057B8', background: '#F5F7FA' }} /> Empty</span>
            <span className="text-gray-400">Double-click sleeper seat to toggle deck</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGridBuilder;
