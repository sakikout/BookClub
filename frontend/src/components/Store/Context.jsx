import { createContext } from 'react';

const StoreContext = createContext({
  token: null,
  setToken: () => {},
  nome: null,
  setNome: () => {},
  comunidade: null,
  setComunidade: () => {},
  color: null,
  setColor: () => {},
  usuario: null,
  setUsuario: () => {},
  foto: null,
  setFoto: () => {}
});

export default StoreContext;