import { useContext } from 'react';
import { AuthContext } from 'src/contexts/JWTAuthContext'; //ECHASIN

export const useAuth = () => useContext(AuthContext);
