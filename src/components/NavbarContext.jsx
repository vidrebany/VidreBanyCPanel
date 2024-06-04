import React, { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
    const [isNavbarVisible, setNavbarVisible] = useState(true);

    return (
        <NavbarContext.Provider value={{ isNavbarVisible, setNavbarVisible }}>
            {children}
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => useContext(NavbarContext);

export { NavbarContext }; // Exportar NavbarContext aquí
