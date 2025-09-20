

import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

const LanguageToggle: React.FC = () => {
    const { lang, toggleLang } = useAppContext();

    return (
        <div className="language-toggle-container">
            <div className="globe-icon" onClick={toggleLang}>
                <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 6.5c1.5-1 3.5-1.5 4-1.5s2.5.5 4 1.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M8 17.5c1.5 1 3.5 1.5 4 1.5s2.5-.5 4-1.5" stroke="currentColor" strokeWidth="1"/>
                </svg>
            </div>
            
            <style>{`
                .language-toggle-container {
                    display: flex;
                    align-items: center;
                }

                .globe-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: ${lang === 'ar' ? '#FFD700' : '#1E40AF'};
                }

                .globe-icon:hover {
                    transform: scale(1.1);
                }

                .globe-icon:active {
                    transform: scale(0.95);
                }
            `}</style>
        </div>
    );
};

export default LanguageToggle;