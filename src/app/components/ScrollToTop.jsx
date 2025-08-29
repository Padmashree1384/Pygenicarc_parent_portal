import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        console.log('Route changed to:', pathname, 'Scrolling to top');

        // Nuclear option - find and reset ALL scrolled elements
        const resetAllScroll = () => {
            // Standard window scroll
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            // Check EVERY element for scroll position
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                if (element.scrollTop > 0) {
                    console.log('Found scrolled element:', element.tagName, element.className, 'scrollTop:', element.scrollTop);
                    element.scrollTop = 0;
                }
            });
        };

        // Reset immediately and with delays
        resetAllScroll();
        setTimeout(resetAllScroll, 0);
        setTimeout(resetAllScroll, 10);
        setTimeout(resetAllScroll, 50);
        setTimeout(resetAllScroll, 100);

    }, [pathname]);

    return null;
}