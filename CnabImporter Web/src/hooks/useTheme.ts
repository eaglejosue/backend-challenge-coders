import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../store";
import { Theme, setTheme } from "../store/slices/appSlice";

const useTheme = () => {
  const dispatch = useDispatch();

  const { theme } = useSelector((state: RootState) => state.app);

  const setCurrentTheme = useCallback((theme: Theme) => {
    dispatch(setTheme(theme));
  }, []);

  return { theme, setCurrentTheme };
};

export default useTheme;
