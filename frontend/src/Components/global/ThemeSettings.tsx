import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode, setThemeColor } from '../../features/menuSlice';

interface ThemeSettingsProps {
  onClose: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const savedThemeMode = useSelector((state: { menu: { themeMode: string } }) => state.menu.themeMode);
  const savedThemeColor = useSelector((state: { menu: { themeColor: string } }) => state.menu.themeColor);

  // Initialize state with saved values
  const [themeMode, setThemeModeState] = useState<'light' | 'dark'>(
    savedThemeMode === 'light' || savedThemeMode === 'dark' ? savedThemeMode : 'light'
  );
  const [themeColor, setThemeColorState] = useState<string>(savedThemeColor);

  // Available theme colors
  const colors = ['#2563eb', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6'];

  // Effect to dispatch theme changes
  useEffect(() => {
    dispatch(setThemeMode(themeMode));
    dispatch(setThemeColor(themeColor));
  }, [themeMode, themeColor, dispatch]);

  return (
    <div className='bg-half-transparent w-screen fixed nav-item top-0 right-0'>
      <div className='float-right h-screen dark:bg-black bg-white w-400 p-4'>
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xl">Theme Settings</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-2xl p-2 hover:bg-gray-200 rounded-full"
          >
            <MdOutlineCancel />
          </button>
        </div>

        {/* Theme Mode Selection */}
        <div className="mt-5">
          <h3 className="font-medium text-lg">Choose Mode</h3>
          <div className="mt-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={themeMode === 'light'}
                onChange={() => setThemeModeState('light')}
                className="mr-2"
              />
              Light
              {themeMode === 'light' && <BsCheck className="text-blue-600 ml-2" />}
            </label>
            <label className="flex items-center mt-2">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={themeMode === 'dark'}
                onChange={() => setThemeModeState('dark')}
                className="mr-2"
              />
              Dark
              {themeMode === 'dark' && <BsCheck className="text-blue-600 ml-2" />}
            </label>
          </div>
        </div>

        {/* Theme Color Selection */}
        <div className="mt-5">
          <h3 className="font-medium text-lg">Choose Color</h3>
          <div className="flex mt-3 gap-3">
            {colors.map((color, index) => (
              <div key={index}>
                <TooltipComponent content={`Color ${index + 1}`} position="TopCenter">
                  <button
                    type="button"
                    className={`w-10 h-10 rounded-full relative cursor-pointer border-2 ${
                      themeColor === color ? 'border-blue-600' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setThemeColorState(color)}
                  >
                    {themeColor === color && (
                      <BsCheck className="text-white absolute inset-0 m-auto text-xl" />
                    )}
                  </button>
                </TooltipComponent>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
