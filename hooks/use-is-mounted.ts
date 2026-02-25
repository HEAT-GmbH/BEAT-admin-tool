import { useEffect, useEffectEvent, useState } from "react";

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);

  const init = useEffectEvent(() => {
    setMounted(true);
  })

  useEffect(() => {
    init();
  }, []);

  return mounted;
}