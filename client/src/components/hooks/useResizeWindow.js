import { useEffect, useState } from 'react'

const useResizeWindow = () => {
  const [size, setSize] = useState(1500);

  useEffect(() => {
    const changeSize = () => {
      setSize(window.innerWidth);
    }
    const resizeLis = window.addEventListener('resize', changeSize);
    changeSize();

    return () => window.removeEventListener('resize', resizeLis);
  }, [])

  return [size];
}

export default useResizeWindow
