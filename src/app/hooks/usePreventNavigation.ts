"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function usePreventNavigation(shouldBlock: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldBlock) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // Might be necessary to show native leave warning
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const originalPush = router.push;

    const interceptPush = (url: string) => {
      if (url === pathname) return;

      const confirmed = confirm(
        "Leaving this page will interrupt your uploads. Do you want to leave anyway?"
      );
      if (confirmed) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        originalPush(url);
      }
    };

    router.push = interceptPush;

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.push = originalPush;
    };
  }, [shouldBlock, router, pathname]);
}
