import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetail from '../../../components/ProductDetail'
import { getProductById, getReviewsByProductId } from '../../../data/products'

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm - TạpHóaMMO',
  description: 'Xem chi tiết sản phẩm',
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id)
  const product = getProductById(productId)
  const reviews = getReviewsByProductId(productId)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} reviews={reviews} />
}
