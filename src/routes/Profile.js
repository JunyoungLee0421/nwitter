import { authService } from "fBase";
import React from "react";
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    }
    return (
        <>
            <button onClick={onLogOutClick }>Log Out</button>
        </>
    )
};
