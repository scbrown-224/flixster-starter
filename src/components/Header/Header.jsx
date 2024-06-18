import React from 'react';
import './Header.css';

const Header = (props) => {
    return (
        <div>
            <header className = 'app-header'>
                <div>
                    <h1>{props.title}</h1>
                </div>
            </header>
        </div>
    );
};

export default Header;

