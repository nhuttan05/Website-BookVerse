// =====================================================
//  COMPONENT — BookCard.jsx
//  Hệ thống Aether Verse design (Stitch-aligned):
//  - No borders (tonal layering)
//  - 3xl rounded corners (24px)
//  - Hover elevation and background shift
// =====================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import { formatPrice, cn } from '@/utils/formatters';

import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '@/redux/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '@/redux/wishlistSlice';

/**
 * BookCard — Trình bày mỗi cuốn sách như một tác phẩm nghệ thuật
 */
const BookCard = ({
  book,
  variant = 'grid',
}) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsInWishlist(book.id));

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(book));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      coverImageUrl: book.coverImageUrl,
      author: book.author,
      slug: book.slug,
      quantity: 1
    }));
    
    // Tạm thời dùng hiệu ứng visual feedback đơn giản
    const target = e.currentTarget;
    target.classList.add('bg-success', 'text-white');
    setTimeout(() => {
      target.classList.remove('bg-success', 'text-white');
    }, 1000);
  };

  if (variant === 'list') {
    return (
      <Link to={`/books/${book.slug}`} className="no-underline">
        <article className="flex gap-6 p-4 bg-surface-container-low rounded-3xl hover:bg-surface-container-lowest hover:shadow-ambient transition-all group">
          <div className="w-24 shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
            <LazyImage src={book.coverImageUrl} alt={book.title} className="w-full h-full" />
          </div>
          <div className="flex flex-col justify-between py-1">
            <div>
              <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">{book.category.name}</p>
              <h4 className="font-bold text-lg text-on-surface leading-tight line-clamp-2">{book.title}</h4>
              <p className="text-sm text-on-surface-variant mt-1">{book.author.name}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-lg font-extrabold text-primary grow">{formatPrice(book.price)}</span>
              <button 
                onClick={handleWishlist}
                className={cn(
                  "p-2 rounded-xl border transition-all",
                  isWishlisted ? "bg-error/10 border-error/20 text-error" : "border-outline-variant text-outline hover:bg-error/5"
                )}
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={handleAddToCart}
                className="p-2 rounded-xl border border-outline-variant text-outline hover:bg-primary-container hover:text-white transition-colors"
              >
                <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link
      to={`/books/${book.slug}`}
      id={`book-card-${book.id}`}
      className="group block no-underline"
    >
      <article
        className="bg-surface-container-low rounded-3xl p-4 transition-all hover:bg-surface-container-lowest hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-2"
      >
        {/* --- Book Cover --- */}
        <div className="aspect-[2/3] overflow-hidden rounded-2xl mb-4 bg-surface-container relative">
          <LazyImage
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badge Chênh lệch giá */}
          {book.discountPercent > 0 && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-tertiary text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
              -{book.discountPercent}%
            </div>
          )}

          {/* Editor's Choice */}
          {book.isEditorChoice && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg" title="Editor's Choice">
              <Star size={14} fill="currentColor" />
            </div>
          )}
        </div>

        {/* --- Info --- */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-on-surface truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-on-surface-variant">{book.author.name}</p>
          
          <div className="flex items-center gap-1 py-2">
            <Star size={14} className="text-tertiary" fill="currentColor" />
            <span className="text-sm font-bold text-on-surface">{book.rating.toFixed(1)}</span>
            <span className="text-xs text-outline-variant">({book.reviewCount >= 1000 ? `${(book.reviewCount/1000).toFixed(1)}k` : book.reviewCount} nhận xét)</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-extrabold text-primary">{formatPrice(book.price)}</span>
            <div className="flex gap-2">
              <button
                onClick={handleWishlist}
                className={cn(
                  "p-2 rounded-xl border transition-all active:scale-95",
                  isWishlisted 
                    ? "bg-error/10 border-error/20 text-error shadow-sm" 
                    : "border-outline-variant text-outline hover:bg-error/5 hover:text-error hover:border-error/10"
                )}
                title={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-xl border border-outline-variant text-outline hover:bg-primary-container hover:text-white transition-colors active:scale-95"
                title="Thêm vào giỏ hàng"
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BookCard;
