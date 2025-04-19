import styles from "../styles/RightVisual.module.css";
import car from '../assets/RightSide.jpg';


const RightVisual = () => {
    return (
        <div className={styles.visualContainer}>
            <img src={car} alt="Car" className={styles.car} />
            
        </div>
    );
};

export default RightVisual;
