import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store'; 

const useTheme = () => {
  const isActiveMenu = useSelector((state: RootState) => state.menu.activeMenu);
  const themeColor = useSelector((state: RootState) => state.menu.themeColor);
  const themeMode = useSelector((state: RootState) => state.menu.themeMode);



  return { isActiveMenu, themeColor, themeMode };
};

export default useTheme;
