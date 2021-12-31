import { useState } from "react";

const useRandomKey = () => {
  const [randomKey, setRandomKey] = useState(1);

  const reloadRandomKey = () => {
    setRandomKey(Math.floor(Math.random() * 100000));
  };
  return [randomKey, reloadRandomKey];
}
export default useRandomKey;