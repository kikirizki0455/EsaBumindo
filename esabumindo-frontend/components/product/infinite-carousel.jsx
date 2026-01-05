import { useState, useRef, useEffect, useCallback } from "react";
import ClientLogo from "@/components/product/client-logo";

const InfiniteCarousel = ({ clients }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const velocityRef = useRef(0);
  const lastPositionRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumRef = useRef(null);

  // Duplicate clients for infinite scroll effect (4x untuk seamless loop)
  const duplicatedClients = [...clients, ...clients, ...clients, ...clients];

  // Smooth auto-scroll with RAF
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollSpeed = 0.8; // Kecepatan scroll (sesuaikan sesuai kebutuhan)

    const animate = () => {
      if (!isDragging && carousel) {
        carousel.scrollLeft += scrollSpeed;

        // Infinite loop logic - reset position seamlessly
        const singleSetWidth = carousel.scrollWidth / 4;
        if (carousel.scrollLeft >= singleSetWidth * 2) {
          carousel.scrollLeft -= singleSetWidth;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging]);

  // Momentum scroll after drag
  useEffect(() => {
    if (isDragging || !carouselRef.current) return;

    let currentVelocity = velocityRef.current;
    const friction = 0.92; // Friction untuk momentum
    const minVelocity = 0.5;

    const applyMomentum = () => {
      if (Math.abs(currentVelocity) > minVelocity && carouselRef.current) {
        carouselRef.current.scrollLeft += currentVelocity;
        currentVelocity *= friction;

        // Check infinite loop bounds
        const singleSetWidth = carouselRef.current.scrollWidth / 4;
        if (carouselRef.current.scrollLeft >= singleSetWidth * 2) {
          carouselRef.current.scrollLeft -= singleSetWidth;
        } else if (carouselRef.current.scrollLeft <= singleSetWidth) {
          carouselRef.current.scrollLeft += singleSetWidth;
        }

        momentumRef.current = requestAnimationFrame(applyMomentum);
      } else {
        velocityRef.current = 0;
      }
    };

    if (Math.abs(currentVelocity) > minVelocity) {
      momentumRef.current = requestAnimationFrame(applyMomentum);
    }

    return () => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
      }
    };
  }, [isDragging]);

  // Drag start handler
  const handleDragStart = useCallback((e) => {
    if (!carouselRef.current) return;

    setIsDragging(true);
    const pageX = e.type === "touchstart" ? e.touches[0].pageX : e.pageX;
    const currentScroll = carouselRef.current.scrollLeft;

    setStartX(pageX);
    setScrollLeft(currentScroll);
    lastPositionRef.current = currentScroll;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;

    carouselRef.current.style.cursor = "grabbing";
    carouselRef.current.style.userSelect = "none";

    // Cancel momentum
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
    }
  }, []);

  // Drag move handler
  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || !carouselRef.current) return;

      e.preventDefault();

      const pageX = e.type === "touchmove" ? e.touches[0].pageX : e.pageX;
      const deltaX = pageX - startX;
      const newScrollLeft = scrollLeft - deltaX;

      carouselRef.current.scrollLeft = newScrollLeft;

      // Calculate velocity for momentum
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTimeRef.current;

      if (deltaTime > 0) {
        const currentScroll = carouselRef.current.scrollLeft;
        const deltaScroll = currentScroll - lastPositionRef.current;
        velocityRef.current = (deltaScroll / deltaTime) * 16; // Normalize to 60fps

        lastPositionRef.current = currentScroll;
        lastTimeRef.current = currentTime;
      }
    },
    [isDragging, startX, scrollLeft]
  );

  // Drag end handler
  const handleDragEnd = useCallback(() => {
    if (!carouselRef.current) return;

    setIsDragging(false);
    carouselRef.current.style.cursor = "grab";
    carouselRef.current.style.userSelect = "";

    // Clamp velocity untuk mencegah scroll terlalu cepat
    const maxVelocity = 50;
    velocityRef.current = Math.max(
      -maxVelocity,
      Math.min(maxVelocity, velocityRef.current)
    );

    // Reset position jika di luar bounds
    const singleSetWidth = carouselRef.current.scrollWidth / 4;
    if (carouselRef.current.scrollLeft >= singleSetWidth * 3) {
      carouselRef.current.scrollLeft -= singleSetWidth;
    } else if (carouselRef.current.scrollLeft <= singleSetWidth * 0.5) {
      carouselRef.current.scrollLeft += singleSetWidth;
    }
  }, []);

  // Initialize scroll position to middle set
  useEffect(() => {
    if (carouselRef.current) {
      const singleSetWidth = carouselRef.current.scrollWidth / 4;
      carouselRef.current.scrollLeft = singleSetWidth * 1.5;
    }
  }, []);

  return (
    <div
      ref={carouselRef}
      className="flex overflow-x-hidden cursor-grab select-none scrollbar-hide will-change-scroll"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{
        scrollBehavior: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {duplicatedClients.map((client, index) => (
        <ClientLogo
          key={`${client.id}-${index}`}
          name={client.name}
          logo={client.logo}
        />
      ))}
    </div>
  );
};

export default InfiniteCarousel; // ← INI YANG PALING PENTING ⚡
