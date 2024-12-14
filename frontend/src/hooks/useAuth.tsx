// src/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store'; // Adjust this path based on your project structure

const useAuth = () => {
  const businessOwner = useSelector((state: RootState) => state.businessOwner);
  const superAdmin = useSelector((state: RootState) => state.superAdmin);
  const manager = useSelector((state: RootState) => state.manager);
  const employee= useSelector((state: RootState) => state.employee);
  

  return { businessOwner, superAdmin,manager,employee };
};

export default useAuth;
