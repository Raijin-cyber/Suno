import { useEffect, useState } from "react";

const useExecuteInView = ({ target, callback, options }) => {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (!target) return;

    const defaultCallback = ([entry]) => {
        setTrigger(entry.isIntersecting);
    };

    const observer = new IntersectionObserver(
      callback || defaultCallback,
      options || { root: null, threshold: 1 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [target, callback, options]);

  return { trigger, setTrigger };
};

export default useExecuteInView;
