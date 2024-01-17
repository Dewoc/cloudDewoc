import styled from "styled-components";

export const DashboardLayout = styled.section`
    width: 100vw;
    height: 100vh;

    display: grid;
    grid-template: 
        "topbar topbar"
        "sidebar main";
    
    grid-template-columns: 20% auto;
    grid-template-rows: 10% auto;

    & > main { 
        grid-area: main;
    }
`

export const SideBar = styled.nav`
    grid-area: sidebar;
    flex: 0.15;
    background-color: ${props => props.theme.backgroundAccentColor};
    border: solid 1px rgba(0, 0, 0, 0.2);
    
    & > ul {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 80%;
        margin: auto;
        margin-top: 1vw;
    }
    
`

export const SBItem = styled.li<{ selected: boolean }>`
    display: flex;
    padding: 0.7rem;
    border-radius: 15px;
    margin-top: 15px;
    border: solid 1px black;
    transition: 0.3s;
    cursor: pointer;

    background-color: ${props => props.selected ? props.theme.accentColor : "transparent"};
    color: ${props => props.selected ? "white" : "inherit"};
    border-color: ${props => props.selected ? "transparent" : "inherit"};

    &:hover {
        background-color: ${({ theme }) => theme.accentColor};
        color: white;
        border-color: transparent;
    }

    & > h3 {
        margin-left: 1rem;
        font-weight: 500;
    }
`