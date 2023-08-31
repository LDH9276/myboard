import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { errorWindowOff } from '../Redux/Error';
import './css/errorwindow.css';

function ErrorWindow() {
  const errorWindow = useSelector(state => state.errorWindow);
  const [errorWindowClose, setErrorWindowClose] = useState(false);
  const [errorWindowEnd, setErrorWindowEnd] = useState(false);
  const error = useSelector(state => state.error);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!errorWindow) {
      setTimeout(() => {
        setErrorWindowClose(false);
      }, 200);
      setTimeout(() => {
        setErrorWindowEnd(true);
      }, 1000);
    } else {
      setErrorWindowClose(false);
      setTimeout(() => {
        setErrorWindowClose(true);
      }, 100);
      setErrorWindowEnd(false);
    }
  }, [errorWindow]);


  return (
    <>
    {!errorWindowEnd ? (
      <div className={!errorWindowClose ? 'error-background notactive' : 'error-background'}>
      <div className="error-window-wrap">
        <p className="error-window-massage">
          {error}
        </p>
        <button onClick={() => dispatch(errorWindowOff())} className='error-window-close'>닫기</button>
      </div>
    </div> 
    ) : '' }
  </>
  );
}

export default ErrorWindow;