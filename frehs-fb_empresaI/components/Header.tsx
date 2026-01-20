import { FunctionalComponent } from "preact";

const Header: FunctionalComponent = () => {
  return (
    <div class="Header">
      <a href={"/"}>
        <img src="/LogoFB.png" alt="logo" class="logo" />
      </a>
      <a href={"/news"}>Noticias</a>
      <a href={"/about"}>Sobre nosotros</a>
    </div>
  );
};

export default Header;
