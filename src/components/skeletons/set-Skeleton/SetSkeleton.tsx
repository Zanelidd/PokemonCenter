import style from './setSkeleton.module.css';

const SetSkeleton = () => {

  return <div className={style.setContainer}>
    {[...Array(20)].map((_, i) => (
      <div key={i} className={style.setSkeletonCard} />
    ))}
  </div>
}

export default SetSkeleton;
