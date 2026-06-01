const Page = () => {
  return (
    <>
      <h2>Sobre nosotros</h2>
      <p>
        Football Bot es un proyecto que nace de la mezcla entre la pasión del
        fútbol, la IA, los datos y la automatización
      </p>
      <p>
        <img
          src="LogoFB.png"
          alt="logo"
          class="logo2"
          width="200px"
        />
      </p>

      <p class={"SVG-class"}>
        <a
          href="https://www.linkedin.com/in/mario-parra-l%C3%B3pez-de-le%C3%B3n-066802172/"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/linkedin.svg" alt="logo" class="icon" />
        </a>

        <a
          href="https://github.com/MarioParraL"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/github.svg" alt="logo" class="icon" />
        </a>
      </p>
    </>
  );
};

export default Page;
