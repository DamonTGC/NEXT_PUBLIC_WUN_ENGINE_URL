'use client';

export interface TopBook {
  book: string;
  line: number;
  odds: number;
}

export default function TopBooksModal({
  open,
  onClose,
  books,
}: {
  open: boolean;
  onClose: () => void;
  books: TopBook[];
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Best books for this edge</span>
          <button onClick={onClose}>✕</button>
        </div>
        <ul className="modal-list">
          {books.map((b, idx) => (
            <li key={idx}>
              <span>{b.book}</span>
              <span>
                {b.line > 0 ? '+' : ''}
                {b.line} • {b.odds > 0 ? '+' : ''}
                {b.odds}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
