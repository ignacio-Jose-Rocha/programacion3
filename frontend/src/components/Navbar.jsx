import React from "react";
import carIcon from "../assets/iconNav.png";
import PropTypes from "prop-types";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

export function StickyNavbar({ onLoginClick }) {
  const [openNav, setOpenNav] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = () => {
    setIsSticky(window.scrollY > 0);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSmoothScroll = (event, href) => {
    event.preventDefault();
    const offset = 80;
    const element = document.querySelector(href);
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2">
      {[
        { text: "Inicio", href: "#inicio" },
        { text: "Nosotros", href: "#nosotros" },
        { text: "Institución", href: "#institucion" },
        { text: "Contacto", href: "#contacto" },
      ].map(({ text, href }) => (
        <Typography
          key={text}
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-sans"
        >
          <a
            href={href}
            onClick={(e) => handleSmoothScroll(e, href)}
            className="color-text-darkGray font-bold relative flex items-center px-4 py-2 text-customBlue-800 transition-all duration-300 ease-in-out group"
          >
            {text}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-customBlue transition-all duration-500 ease-in-out group-hover:w-full"></span>
          </a>
        </Typography>
      ))}
    </ul>
  );

  return (
    <Navbar
      className={`sticky top-0 z-50 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 transition-all duration-300 ${
        isSticky ? "bg-opacity-70" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium hover:text-inherit flex items-center"
        >
          <img
            src={carIcon}
            alt="Car Icon"
            className="w-8 h-8 text-customBlue mr-1"
          />
          <span className="text-customBlue font-bold text-2xl">GAMA</span>{" "}
          <span className="text-customRed font-bold text-sm">CENTER</span>
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <Button
            onClick={onLoginClick}
            size="sm"
            className="hidden lg:inline-block bg-customBlue text-white border-2 border-customBlue focus:outline-none px-4 py-2 rounded-full shadow-lg"
          >
            <span className="font-semibold">Iniciar Sesión</span>
          </Button>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}
        <Button
          onClick={onLoginClick} // Agrega el manejador de clic aquí
          fullWidth
          variant="text"
          size="sm"
          className="lg:hidden bg-customBlue text-white border-2 border-customBlue px-4 py-2 rounded-full shadow-lg"
        >
          Log In
        </Button>
      </Collapse>
    </Navbar>
  );
}

StickyNavbar.propTypes = {
  onLoginClick: PropTypes.func.isRequired,
};

export default StickyNavbar;
