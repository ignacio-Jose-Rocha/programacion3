import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

export function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
  const handleScroll = () => {
    setIsSticky(window.scrollY > 0); // Cambia a `true` si se hace scroll
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2">
      {["Inicio", "Nosotros", "Institución", "Contacto"].map((text) => (
        <Typography
          key={text}
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-sans"
        >
          <a
            href="#"
            className="font-bold relative flex items-center px-4 py-2 text-gray-800 hover:text-white transition-all duration-300 ease-in-out hover:bg-customBlueOpacity hover:rounded-md"
          >
            {text}
          </a>
        </Typography>
      ))}
    </ul>
  );

  return (
    <Navbar
    className={`sticky top-0 z-50 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 transition-all duration-300 ${
      isSticky ? 'bg-opacity-50' : 'bg-transparent'
    }`}
  >
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium hover:text-inherit"
        >
          <span className="text-customBlue font-bold text-2xl">CAR</span>{" "}
          <span className="text-customRed font-bold text-sm">DEALERSHOP</span>
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button
              size="sm"
              className="hidden lg:inline-block bg-customBlue text-white border-2 border-customBlue focus:outline-none px-4 py-2 rounded-full shadow-lg"
            >
              <span className="font-semibold">Iniciar Sesión</span>
            </Button>
          </div>
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
      <Collapse  open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button
            hover:bg-transparent
            fullWidth
            variant="text"
            size="sm"
            className=""
          >
            <span>Log In</span>
          </Button>
        </div>
      </Collapse >
    </Navbar>
  );
}

export default StickyNavbar;
