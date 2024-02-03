import { FormEvent, useEffect, useState } from "react";
import StyledLogin from "./styled";
import { BasicCredentials } from "../shared";
import { BarLoader } from "react-spinners";
import { theme } from "../settings.json";
import { useNavigate } from "react-router-dom";
import loginHandler from "./api";

function Login() {
    const [credentials, setCredentials] = useState<BasicCredentials>({ email: '', password: '' });
    const [loading, setLoading] = useState<boolean>(true);
    const [pending, setPending] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    
    const setEmail    = (email: string)     => { setCredentials(prevState => ({ ...prevState, email: email  })) }
    const setPassword = (password: string)  => { setCredentials(prevState => ({ ...prevState, password: password  })) }
    const navigate = useNavigate();

    useEffect(() => { setLoading(false); }, [])
    
    const login = async (e: FormEvent<HTMLFormElement>, { email, password }: BasicCredentials) => {
        e.preventDefault();

        setPending(true);
        

        await loginHandler({ email, password })
                .then(d => { 

                    if(d.error) throw d.errorMsg;
                    else {
                        setPending(false);
                        setFeedbackMessage("Usuario autenticado correctamente. Serás redirigido al dashboard");

                        setTimeout(() => {
                            navigate("/dashboard");
                        }, 1500);
                    }
                })
            .catch(e => { setFeedbackMessage(e); setPending(false)} );
        
    }

    return !loading && <StyledLogin theme={theme}>
        <h1>Inicio de sesión</h1>
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => login(e, credentials)}>
            <fieldset>
                <label htmlFor="email">Email</label>
                <input name="email" onChange={e => setEmail(e.target.value)} />
            </fieldset>
            <fieldset>
                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" onChange={e => setPassword(e.target.value)} />
            </fieldset>
            <button disabled={pending}>{pending ? <BarLoader color={theme.accentColor} /> : "Iniciar sesión"}</button>
        </form>
        <strong>{feedbackMessage}</strong>
    </StyledLogin>
}

export default Login;