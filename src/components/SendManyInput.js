import React, { useRef } from 'react';
export function SendManyInput({ index, row, updateModel, maybeAddNewRow, lastRow }) {
  const to = useRef();
  const stxValue = useRef();
  const memo = useRef();

  const getRow = () => {
    const value = {
      to: to.current.value.trim(),
      stx: stxValue.current.value.trim(),
      memo: memo.current.value.trim(),
    };
    return value;
  };

  return (
    <div key={index}>
      <div className="row">
        <div className="col-md-5 col-xs-5 col-lg-5">
          <div className="form-label-group">
            <input
              ref={to}
              value={row.to}
              onChange={e => updateModel(getRow())}
              placeholder={``}
              type="text"
              className="form-control"
              required=""
              autofocus={lastRow ? "" : undefined}
            />
            <label for="inputEmail">Wallet Address #{index + 1}</label>
          </div>
        </div>
        <div className="col-md-4 col-xs-4 col-lg-4">
          <div className="form-label-group">
            <input
              ref={stxValue}
              value={row.stx}
              onChange={e => updateModel(getRow())}
              placeholder={``}
              type="text"
              maxLength="10"
              className="form-control"
              required=""
            />
            <label for="inputEmail">Amount #{index + 1}</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input
              ref={memo}
              value={row.memo}
              onChange={e => updateModel(getRow())}
              placeholder={``}
              type="text"
              maxLength="34"
              className="form-control"
              required=""
              onKeyUp={e => {
                if (e.key === 'Enter') maybeAddNewRow();
              }}
            />
            <label for="inputEmail">Memo #{index + 1}</label>
          </div>
        </div>
      </div>
    </div>
  );
}
