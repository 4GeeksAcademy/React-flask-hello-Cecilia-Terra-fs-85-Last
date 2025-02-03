import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const Private = () => {
    const { actions } = useContext(Context);
    let navigate = useNavigate();

    useEffect(() => {
        async function verifyAuth() {
            let valid = await actions.tokenVerify();
            if (!valid) {
                navigate("/login");
            }
        }
        verifyAuth();
    }, []);

    return <h1>Bienvenido al área privada</h1>;
};


export default Private;