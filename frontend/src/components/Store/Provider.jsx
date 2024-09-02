import React from 'react';
import Context from './Context';
import useStorage from '../utils/useStorage.js';

const StoreProvider = ({ children }) => {
  const [token, setToken] = useStorage('token');
  const [cpf, setCpf] = useStorage('cpf');
  const [nome, setNome] = useStorage('nome');
  const [ comunidade, setComunidade] = useStorage('comunidade');
  const [color, setColor] = useStorage('color');

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        cpf,
        setCpf,
        nome,
        setNome,
        comunidade,
        setComunidade,
        color,
        setColor
      }}
    >
      {children}
    </Context.Provider>
  )
}


export default StoreProvider;