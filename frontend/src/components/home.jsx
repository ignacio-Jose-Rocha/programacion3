import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/home.module.css';

const home = () => {
  return (
    <div className={styles.carouselContainer}>
      <div id="carCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="./img/auto-audi.png" className="d-block w-100" alt="Audi" />
            <div className="carousel-caption">
              <h5 className={styles.backgroundText}>AUDI</h5>
              <h2>Find Your Dream <span className={styles.carText}>CAR</span></h2>
              <button className={styles.orderNowButton}>Order Now</button>
            </div>
          </div>
          <div className="carousel-item">
            <img src="./img/auto-ferrari.png" className="d-block w-100" alt="Ferrari" />
            <div className="carousel-caption">
              <h5 className={styles.backgroundText}>FERRARI</h5>
              <h2>Find Your Dream <span className={styles.carText}>CAR</span></h2>
              <button className={styles.orderNowButton}>Order Now</button>
            </div>
          </div>
          <div className="carousel-item">
            <img src="./img/auto-tesla.png" className="d-block w-100" alt="Tesla" />
            <div className="carousel-caption">
              <h5 className={styles.backgroundText}>TESLA</h5>
              <h2>Find Your Dream <span className={styles.carText}>CAR</span></h2>
              <button className={styles.orderNowButton}>Order Now</button>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
      <div className={styles.brandSection}>
        <h3>Marcas</h3>
        <div className={styles.brandLogos}>
          <img src="./img/logo-honda.png" alt="Honda" />
          <img src="./img/logo-ferrari.png" alt="Ferrari" />
          <img src="./img/logo-toyota.png" alt="Toyota" />
          <img src="./img/logo-audi.png" alt="Audi" />
          <img src="./img/logo-tesla.png" alt="Tesla" />
        </div>
      </div>
    </div>
  );
}

export default CarCarousel;
