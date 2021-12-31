const getMainSrc = (src) => {
  return src ? `${process.env.REACT_APP_BASE_URL}/${src}` : null;
}

export default getMainSrc;