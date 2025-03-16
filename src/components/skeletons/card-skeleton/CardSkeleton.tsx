import style from './cardSkeleton.module.css';

const CardSkeleton = () => {

  return <div className={style.cardContainer}>
    {[...Array(12)].map((_, i) => (
      <div key={i} className={style.card} />
    ))}
  </div>;
};

export default CardSkeleton;