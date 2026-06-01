import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

type Props = {
  error?: string;
};

const LoginForm: FunctionalComponent<Props> = (props) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const equipos = [
    "Atlético de Madrid",
    "RC Dportivo de la Coruña",
    "Real Madrid",
    "FC Barcelona",
    "Athletic Club",
    "Real Sociedad",
    "Real Betis",
    "Sevilla FC",
    "Valencia CF",
    "Villarreal CF",
    "Girona FC",
    "CA Osasuna",
    "Deportivo Alavés",
    "Rayo Vallecano",
    "RC Celta de Vigo",
    "RCD Mallorca",
    "Getafe CF",
    "UD Levante",
    "Real Oviedo",
    "Elche CF",
    "RCD Espanyol",
  ];

  return (
    <div className="login-container">
      <form action="/" method="GET" className="login-form">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLoginView ? "active" : ""}`}
            onClick={() => setIsLoginView(true)}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLoginView ? "active" : ""}`}
            onClick={() => setIsLoginView(false)}
          >
            Registrarse
          </button>
        </div>

        <h2 className="login-title">
          {isLoginView ? "Hola de nuevo!" : "Crea tu cuenta"}
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre de usuario"
          required
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          className="login-input"
        />

        {!isLoginView && (
          <>
            <label className="login-label">
              Elige tu equipo favorito:
            </label>
            <select name="favorite" className="login-input" defaultValue="">
              <option value="" disabled>
                Selecciona tu equipo favorito
              </option>
              {equipos.map((equipo) => (
                <option key={equipo} value={equipo}>
                  {equipo}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="login-actions">
          {isLoginView
            ? (
              <button
                type="submit"
                name="mode"
                value="login"
                className="btn-submit btn-login"
              >
                Entrar
              </button>
            )
            : (
              <button
                type="submit"
                name="mode"
                value="register"
                className="btn-submit btn-login"
              >
                Registrarme
              </button>
            )}
        </div>

        {props.error && <p className="login-error">{props.error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
