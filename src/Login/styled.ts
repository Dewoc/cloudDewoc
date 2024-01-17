import styled from "styled-components";

export default styled.main`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;

    & > strong {
        position: absolute;
        bottom: 5%;
        color: ${({ theme }) => theme.accentColor};
    }

    & > h1 {
        background-color: ${({ theme }) => theme.accentColor};
        color: white;
        text-align: center;
        padding: 10px;
        box-sizing: border-box;
        width: 40%;
        font-size: 1.7rem;
    }
    
    & > form {
        box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5);
        height: 40%;
        width: 40%;

        @media (max-height: 768px) { height: 60% !important; }
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        
        & > fieldset {
            border: none;
            display: flex;
            flex-direction: column;
            width: 80%;

            margin-bottom: 20px;

            & > input {
                border: solid 1px rgba(0, 0, 0, 0.4);
                padding: 0.4rem;
                border-radius: 4px;
            }

            & > label { font-weight: bold; }
        }

        & > button {
            align-self: center;

            width: 30%;
            padding: 1rem;
            cursor: pointer;
            color: ${({ theme }) => theme.accentColor};
            border-radius: 10px;
            transform: translateY(25%);
            font-weight: bold;
            border: solid 1px ${({ theme }) => theme.accentColor};
            
            transition: 0.5s;

            &:hover {
                background-color: ${({ theme }) => theme.accentColor};
                color: white;
            }

            & > span {
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
`