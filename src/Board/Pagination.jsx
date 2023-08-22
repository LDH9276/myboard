import React from 'react';

function Pagination({ total, limit, page, setPage }) {
  const numPages = Math.ceil(total / limit);
  const pageBlock = 5;
  const pageFirstBlock = Math.floor((page - 1) / pageBlock) * pageBlock + 1;
  const pageLastBlock = Math.min(pageFirstBlock + pageBlock - 1, numPages);

  const prevBlock = () => {
    setPage(Math.max(1, pageFirstBlock - pageBlock));
  };

  const nextBlock = () => {
    setPage(Math.min(numPages, pageFirstBlock + pageBlock));
  };

  return (
    <div className="page">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={prevBlock}>
              Previous
            </button>
          </li>
          {Array.from({ length: pageLastBlock - pageFirstBlock + 1 }, (_, i) => (
            <li key={i} className={`page-item ${page === pageFirstBlock + i ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(pageFirstBlock + i)}>
                {pageFirstBlock + i}
              </button>
            </li>
          ))}
          <li className={`page-item ${page === numPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={nextBlock}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;