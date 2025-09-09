import { useEffect } from "react";

export default function useModalClose(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e) => e.key === "Escape" && onClose();
    const onOverlay = (e) =>
      e.target && e.target.classList && e.target.classList.contains("modal") && onClose();

    document.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", onOverlay);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("mousedown", onOverlay);
    };
  }, [isOpen, onClose]);
}