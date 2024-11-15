// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Adjust this path based on your project structure

const useAuth = () => {
  const businessOwner = useSelector((state: RootState) => state.businessOwner);
  const superAdmin = useSelector((state: RootState) => state.superAdmin);
  const manager = useSelector((state: RootState) => state.manager);

  return { businessOwner, superAdmin,manager };
};

export default useAuth;
