import React, { useState } from 'react';
import { Table as TableIcon } from 'lucide-react';
import './TableBuilder.css';

/**
 * TableBuilder Component
 * 
 * A visual table builder for markdown tables
 */

const TableBuilder = ({ onTableInsert }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    const generateTable = () => {
        let table = '\n';

        // Header row
        table += '| ' + Array(cols).fill('Header').map((h, i) => `${h} ${i + 1}`).join(' | ') + ' |\n';

        // Separator row
        table += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';

        // Data rows
        for (let i = 0; i < rows - 1; i++) {
            table += '| ' + Array(cols).fill('Cell').map((c, j) => `${c} ${i + 1}-${j + 1}`).join(' | ') + ' |\n';
        }

        table += '\n';
        return table;
    };

    const handleInsert = () => {
        const table = generateTable();
        onTableInsert(table);
        setIsOpen(false);
    };

    return (
        <div className="table-builder-container">
            <button
                className="table-builder-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Insert Table"
            >
                <TableIcon size={18} />
            </button>

            {isOpen && (
                <>
                    <div className="table-builder-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="table-builder-popup">
                        <div className="table-builder-header">
                            <span>Insert Table</span>
                        </div>

                        <div className="table-builder-content">
                            <div className="table-builder-control">
                                <label>Rows:</label>
                                <input
                                    type="number"
                                    min="2"
                                    max="20"
                                    value={rows}
                                    onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                                />
                            </div>

                            <div className="table-builder-control">
                                <label>Columns:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={cols}
                                    onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                                />
                            </div>

                            <div className="table-preview">
                                <div className="table-preview-grid" style={{
                                    gridTemplateColumns: `repeat(${cols}, 1fr)`
                                }}>
                                    {Array(rows * cols).fill(0).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`table-preview-cell ${i < cols ? 'header' : ''}`}
                                        />
                                    ))}
                                </div>
                                <div className="table-preview-label">
                                    {rows} × {cols} table
                                </div>
                            </div>

                            <button
                                className="table-builder-insert-btn"
                                onClick={handleInsert}
                            >
                                Insert Table
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TableBuilder;
