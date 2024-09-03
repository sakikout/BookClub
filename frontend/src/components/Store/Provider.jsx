import React from 'react';
import Context from './Context';
import useStorage from '../utils/useStorage.js';

const StoreProvider = ({ children }) => {
  const [token, setToken] = useStorage('token');
  const [usuario, setUsuario] = useStorage('usuario');
  const [nome, setNome] = useStorage('nome');
  const [ comunidade, setComunidade] = useStorage('comunidade');
  const [color, setColor] = useStorage('color');

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        nome,
        setNome,
        comunidade,
        setComunidade,
        color,
        setColor,
        usuario,
        setUsuario
      }}
    >
      {children}
    </Context.Provider>
  )
}


export default StoreProvider;