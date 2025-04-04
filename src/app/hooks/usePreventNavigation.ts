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
      e.returnValue = ""; // Show native leave warning
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const originalPush = router.push;

    const interceptPush = (url: string) => {
      if (url === pathname) return; // Skip if navigating to same page

      const confirmed = confirm("Uploads are in progress. Leave this page?");
      if (confirmed) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        originalPush(url);
      }
    };

    // @ts-ignore
    router.push = interceptPush;

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // @ts-ignore
      router.push = originalPush;
    };
  }, [shouldBlock, router, pathname]);
}
