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
            <button className="page-link-prev" onClick={prevBlock}>
              <img src={`${process.env.PUBLIC_URL}/btn/list-arrow-l.svg`} alt="prev" />
            </button>
          </li>
          <ul className='pages'>
            {Array.from({ length: pageLastBlock - pageFirstBlock + 1 }, (_, i) => (
              <li key={i} className={`page-item ${page === pageFirstBlock + i ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(pageFirstBlock + i)}>
                  {pageFirstBlock + i}
                </button>
              </li>
            ))}
          </ul>
          <li className={`page-item ${page === numPages ? 'disabled' : ''}`}>
            <button className="page-link-next" onClick={nextBlock}>
              <img src={`${process.env.PUBLIC_URL}/btn/list-arrow-r.svg`} alt="prev" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;