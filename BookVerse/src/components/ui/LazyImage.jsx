// =====================================================
//  UI COMPONENT — LazyImage.jsx
//  Performance: Tải ảnh chỉ khi vào viewport
//  Technique: Intersection Observer API
// =====================================================

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/utils/formatters';

/**
 * LazyImage — Tối ưu tải ảnh sách với Intersection Observer
 * 
 * Lý do dùng Intersection Observer thay vì loading="lazy":
 * 1. Kiểm soát được threshold (khi nào bắt đầu tải)
 * 2. Có thể thêm placeholder / skeleton animation
 * 3. Fallback khi ảnh lỗi (broken URL)
 * 
 * @param {Object} props
 * @param {string} props.src - URL ảnh thật
 * @param {string} [props.alt]
 * @param {string} [props.fallbackSrc] - URL ảnh dự phòng
 * @param {string} [props.className]
 * @param {'eager'|'lazy'} [props.loading='lazy']
 * @param {number} [props.threshold=0.1] - % element visible để trigger load
 */
const LazyImage = ({
  src,
  alt = '',
  fallbackSrc = '/images/book-placeholder.png',
  className = '',
  loading = 'lazy',
  threshold = 0.1,
  ...rest
}) => {
  const imgRef = useRef(null);
  const [isLoaded,  setIsLoaded]  = useState(false);
  const [isInView,  setIsInView]  = useState(loading === 'eager');
  const [hasError,  setHasError]  = useState(false);
  const [imgSrc,    setImgSrc]    = useState(loading === 'eager' ? src : null);

  // Intersection Observer — chỉ tải ảnh khi element vào viewport
  useEffect(() => {
    if (loading === 'eager') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImgSrc(src);
          observer.disconnect(); // Ngắt observe sau khi đã trigger
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, loading, threshold]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ backgroundColor: 'var(--color-surface-container)' }}
    >
      {/* Skeleton Placeholder — hiện khi chưa load xong */}
      {!isLoaded && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              var(--color-surface-container) 25%,
              var(--color-surface-container-high) 50%,
              var(--color-surface-container) 75%
            )`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
          aria-hidden="true"
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={imgSrc || src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...rest}
        />
      )}

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
