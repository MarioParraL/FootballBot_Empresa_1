import { FunctionalComponent } from "preact";

type Props = {
  userName?: string;
};

const Header: FunctionalComponent<Props> = ({ userName }) => {
  return (
    <div class="Header">
      <a href="/" class="logo-link">
        <img src="/LogoFB.png" alt="logo" class="logo" />
      </a>

      {userName && (
        <span class="welcome-text">
          Bienvenido/a, <strong>{userName}</strong>
        </span>
      )}

      <a href="/news">Noticias</a>
      <a href="/favorites">Mi Equipo</a>
      <a href="/about">Sobre nosotros</a>
      <a href="/logout" class="logout-link">Cerrar sesión</a>
    </div>
  );
};

export default Header;
