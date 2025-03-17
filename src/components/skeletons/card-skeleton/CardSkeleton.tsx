import style from './cardSkeleton.module.css';
import { useEffect, useState } from 'react';

const CardSkeleton = () => {
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const totalsCard = 12;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        return (prev < totalsCard) ? prev + 1 : 0;
      });
    }, 275);
    return () => clearInterval(interval);
  }, []);

  return <div className={style.cardContainer}>
    {[...Array(totalsCard)].map((_, i) => (
      <div key={i} className={`${style.card} ${i < visibleCards ? style.show : ''}`} />
    ))}
  </div>;

};


export default CardSkeleton;