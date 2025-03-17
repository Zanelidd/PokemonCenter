import { useEffect, useState } from 'react';
import style from './setSkeleton.module.css';

const SetSkeleton = () => {
  const [visibleSets, setVisibleSets] = useState<number>(0);
  const totalsSet = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSets((prev) => (prev < totalsSet) ? prev + 1 : 0);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return <div className={style.setContainer}>
    {[...Array(totalsSet)].map((_, i) => (
      <div key={i} className={`${style.setSkeletonCard} ${i < visibleSets ? style.show : ''}`}>
        <p></p>
      </div>
    ))}
  </div>;
};

export default SetSkeleton;
