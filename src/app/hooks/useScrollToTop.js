import { useEffect } from 'react';

export const useScrollToTop = (activePage) => {
  useEffect(() => {
    console.log('Internal page changed to:', activePage, 'Scrolling to top');
    
    const resetAllScroll = () => {
      // Standard window scroll
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Check EVERY element for scroll position
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        if (element.scrollTop > 0) {
          console.log('Found scrolled element (internal):', element.tagName, element.className, 'scrollTop:', element.scrollTop);
          element.scrollTop = 0;
        }
      });
    };
    
    // Reset immediately and with delays
    resetAllScroll();
    setTimeout(resetAllScroll, 0);
    setTimeout(resetAllScroll, 10);
    setTimeout(resetAllScroll, 50);
    
  }, [activePage]);
};