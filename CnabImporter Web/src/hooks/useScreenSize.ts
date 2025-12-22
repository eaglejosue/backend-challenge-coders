import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isExtraSmallScreen: false,
    isSmallScreen: false,
    isMediumScreen: false,
    isLargeScreen: false,
    isExtraLargeScreen: false
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isExtraSmallScreen: width < 576,
        isSmallScreen: width > 575 && width < 768,
        isMediumScreen: width > 767 && width < 1024,
        isLargeScreen: width > 1023 && width < 1200,
        isExtraLargeScreen: width > 1199
      });
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;