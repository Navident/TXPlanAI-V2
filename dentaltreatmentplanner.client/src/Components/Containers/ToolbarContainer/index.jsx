import { useEffect, useRef, useState } from 'react';
import { StyledTxToolbarContainer } from './index.style';

const ToolbarContainer = ({ children }) => {
    const [isSticky, setIsSticky] = useState(false);
    const toolbarRef = useRef(null);
    const sentinelRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting);
            },
            {
                rootMargin: '-1px 0px 0px 0px',
                threshold: [1]
            }
        );

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, []);

    return (
        <>
            <div ref={sentinelRef} style={{ height: '1px' }}></div>
            <StyledTxToolbarContainer ref={toolbarRef} className={isSticky ? 'sticky' : ''}>
                {children}
            </StyledTxToolbarContainer>
        </>
    );
};

export default ToolbarContainer;
