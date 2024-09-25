import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Car dealer Ship</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Contacto</a>
          </li>
          <li className="nav-item dropdown">
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Institucion</a>
          </li>
        </ul>
        <form className="form-inline my-4 my-lg-5">
          <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Iniciar Sesion</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
