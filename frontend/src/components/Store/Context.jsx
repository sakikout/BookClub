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
  setUsuario: () => {}
});

export default StoreContext;