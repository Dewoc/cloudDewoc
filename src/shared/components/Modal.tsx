import { Box, TextField } from "@mui/material";
import { StyledButton, StyledModal, StyledSubTitle } from "..";
import {theme} from "../../settings.json";
import { FormEvent } from "react";

export default function Modal({ open, onClose, onSubmit, onInputChange, children, title, formInputs, applyButtonText, cancelButtonText = "CANCELAR", disabledKeys, formInputsType, ignoreKeys }:
    {
        onClose: () => void, onSubmit: (e: FormEvent<HTMLFormElement>) => void, onInputChange: (fieldKey: string, newValue: string) => void,
        children?: React.JSX.Element, open: boolean, title: string,
        formInputs: { [key: string]: string },
        applyButtonText: string,
        formInputsType?: { [key: string]: string },
        cancelButtonText?: string,
        disabledKeys?: string[],
        ignoreKeys?: string[]
    }) {
    return <StyledModal
        open={open}
        onClose={onClose}
    >
        <Box component="section">
            <StyledSubTitle style={{ textAlign: "center" }}>
                {title}
            </StyledSubTitle>
            <form autoComplete="off" onSubmit={onSubmit}>
                {
                    Object.keys(formInputs).map(key => {
                        if(ignoreKeys && ignoreKeys.find(k => k === key)) return undefined;

                        let disabled = false;

                        if(disabledKeys && disabledKeys.find(k => k === key)) disabled = true;
                        return <TextField 
                            key={key}
                            value={formInputs[key]} sx={{ marginTop: "10px" }} required
                            autoComplete="new-password" 
                            placeholder=""
                            disabled={disabled}  id={`${key}-input`}  color="warning" 
                            label={key[0].toUpperCase() + key.slice(1)} variant="standard"
                            InputLabelProps={{ shrink: (formInputsType && formInputsType[key] && formInputsType[key] === "date") ? true : undefined }}
                            type={(formInputsType && formInputsType[key]) ? formInputsType[key] : "text"}
                        onChange={e => onInputChange(key, e.target.value)} />
                    })
                }
                {children}
                <Box component="div" className="formButtonContainer">
                    <StyledButton theme={theme} onClick={onClose}>{cancelButtonText}</StyledButton>
                    <StyledButton theme={theme}>{applyButtonText}</StyledButton>
                </Box>
            </form>
        </Box>
    </StyledModal>
}