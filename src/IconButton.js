import React from "react";

function IconButton({ ariaLabel, children, onClick, disabled = false, className='' }) {
    return (
        <button 
            disabled={disabled}
            aria-label={ariaLabel} 
            className={`iconButton ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default IconButton;
