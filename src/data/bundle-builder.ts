import productsData from './products.json'
import type { BundleBuilderData } from '../types/bundle-builder'

const bundleBuilderData = productsData as unknown as BundleBuilderData

export default bundleBuilderData
