'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  ChevronDown,
  RefreshCw,
  ShoppingCart,
  Carrot,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../lib/authStore';
import { getAllOrders, updateOrderStatus, markCashOrderAsPaid, cancelCashPayment, updateDispatchInfo, markOrderDispatched, cancelDispatch, Order } from '../lib/firebase/orders';
import { products as staticProducts, Product, ProductVariant } from '../shop/products';
import { db } from '../lib/firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
type TabType = 'orders' | 'products';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
}

interface DisplayProduct extends Product {
  source: 'static' | 'firebase';
  createdAt?: any;
}

// Reusable Confirmation Modal
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isConfirming }: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* Mobile: full width with small padding */}
      <div className="bg-white  w-full max-w-md mx-auto p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300  hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-red-600 text-white  hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isConfirming && <Loader2 size={16} className="animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Product Modal
interface EditProductModalProps {
  isOpen: boolean;
  product: DisplayProduct | null;
  onClose: () => void;
  onSave: (id: string, data: { name: string; category: string; price?: number; unit?: string; variants?: ProductVariant[] }) => Promise<void>;
}

// WhatsApp Modal
function WhatsAppModal({ 
  isOpen, 
  phoneNumber, 
  recipientType, 
  onClose, 
  onPhoneChange, 
  onRecipientTypeChange, 
  onSend 
}: {
  isOpen: boolean;
  phoneNumber: string;
  recipientType: 'customer' | 'rider' | 'other';
  onClose: () => void;
  onPhoneChange: (phone: string) => void;
  onRecipientTypeChange: (type: 'customer' | 'rider' | 'other') => void;
  onSend: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white  w-full max-w-md mx-auto p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Share via WhatsApp</h3>
        <p className="text-gray-600 mb-4">Select recipient and enter phone number</p>
        
        {/* Recipient Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Send to:</label>
          <div className="flex gap-2">
            <button
              onClick={() => onRecipientTypeChange('customer')}
              className={`flex-1 px-3 py-2  text-sm border transition ${
                recipientType === 'customer'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => onRecipientTypeChange('rider')}
              className={`flex-1 px-3 py-2  text-sm border transition ${
                recipientType === 'rider'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Rider
            </button>
            <button
              onClick={() => onRecipientTypeChange('other')}
              className={`flex-1 px-3 py-2  text-sm border transition ${
                recipientType === 'other'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Other
            </button>
          </div>
        </div>
        
        {/* Phone Number */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="e.g., 0712345678"
            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300  hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={!phoneNumber}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white  hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Open WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

// Dispatch Info Modal
function DispatchModal({ 
  isOpen, 
  order,
  onClose, 
  onUpdate,
  isUpdating 
}: {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdate: (driverName: string, driverPhone: string) => void;
  isUpdating: boolean;
}) {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');

  useEffect(() => {
    if (order) {
      setDriverName(order.driverName || '');
      setDriverPhone(order.driverPhone || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white  w-full max-w-md mx-auto p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispatch Order #{order.id?.slice(0, 8)}</h3>
        <p className="text-gray-600 mb-4">Enter driver details before dispatching this order.</p>
        
        {/* Driver Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name:</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="e.g., John Doe"
            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {/* Driver Phone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Driver Phone:</label>
          <input
            type="tel"
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            placeholder="e.g., 0712345678"
            className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300  hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          {order.status !== 'dispatched' ? (
            <button
              onClick={() => onUpdate(driverName, driverPhone)}
              disabled={isUpdating}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-purple-600 text-white  hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating && <Loader2 size={16} className="animate-spin" />}
              Dispatch Order
            </button>
          ) : (
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-blue-600 text-white  hover:bg-blue-700 transition disabled:opacity-50"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EditProductModal({ isOpen, product, onClose, onSave }: EditProductModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price?.toString() ?? '');
      setUnit(product.unit ?? '');
      setVariants(product.variants || []);
      setHasVariants(!!product.variants && product.variants.length > 0);
    }
  }, [product]);

  const addVariant = () => {
    setVariants([...variants, { size: '', price: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: 'size' | 'price', value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) {
      toast.error('Please fill required fields');
      return;
    }
    
    // If has variants, validate them
    if (hasVariants) {
      const invalidVariants = variants.filter(v => !v.size || !v.price);
      if (invalidVariants.length > 0) {
        toast.error('Please fill all variant fields');
        return;
      }
    }
    
    setIsSaving(true);
    try {
      const data: any = { name, category };
      
      if (hasVariants) {
        data.variants = variants;
        data.price = undefined;
        data.unit = undefined;
      } else {
        if (!price || !unit) {
          toast.error('Please fill price and unit');
          setIsSaving(false);
          return;
        }
        data.price = Number(price);
        data.unit = unit;
        data.variants = [];
      }
      
      await onSave(product.id!, data);
      onClose();
    } catch (error) {
      // Error is handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* Mobile: full width with small padding, max width on larger screens */}
      <div className="bg-white  w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Engine Parts">Engine Parts</option>
              <option value="Brake Systems">Brake Systems</option>
              <option value="Tires & Wheels">Tires & Wheels</option>
              <option value="Electrical">Electrical</option>
              <option value="Filters">Filters</option>
              <option value="Body Parts">Body Parts</option>
            </select>
          </div>
          
          {/* Variants Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasVariants"
              checked={hasVariants}
              onChange={(e) => setHasVariants(e.target.checked)}
              className="w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasVariants" className="text-sm font-medium text-gray-700">
              Product has different sizes/variants
            </label>
          </div>
          
          {hasVariants ? (
            <div className="space-y-3 border border-gray-200  p-3">
              <label className="block text-sm font-medium text-gray-700">Variants (sizes with prices)</label>
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Size (e.g., 350ml, 500g)"
                      value={variant.size}
                      onChange={(e) => updateVariant(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Price (KES)"
                      value={variant.price || ''}
                      onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!hasVariants}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!hasVariants}
                  placeholder="e.g., per kg, per piece"
                />
              </div>
            </>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-700 text-white  hover:bg-blue-800 transition disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300  hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  
  // Products state
  const [firebaseProducts, setFirebaseProducts] = useState<Product[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    category: 'Engine Parts',
    price: '',
    unit: '',
    imageFile: null as File | null,
    hasVariants: false,
    variants: [] as ProductVariant[],
  });
  const [imageSizeWarning, setImageSizeWarning] = useState('');

  // Revenue month filter
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Pagination
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const itemsPerPage = 10;

  // Expandable order items
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isConfirming?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isConfirming: false,
  });

  // WhatsApp modal state
  const [whatsappModal, setWhatsappModal] = useState<{
    isOpen: boolean;
    orderId: string;
    phoneNumber: string;
    recipientType: 'customer' | 'rider' | 'other';
    orderData: Order | null;
  }>({
    isOpen: false,
    orderId: '',
    phoneNumber: '',
    recipientType: 'customer',
    orderData: null,
  });

  // Dispatch modal state
  const [dispatchModal, setDispatchModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderData: Order | null;
  }>({
    isOpen: false,
    orderId: '',
    orderData: null,
  });

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState<DisplayProduct | null>(null);

  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const ADMIN_EMAILS = ['mr.onyanchaandrew@gmail.com', 'pattywapat@gmail.com'];
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/account/login?redirect=/admin');
    } else if (!isLoading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isLoading, isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchOrders();
      fetchFirebaseProducts();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    filterOrders();
    setOrdersPage(1);
  }, [orders, searchQuery, statusFilter]);

  const fetchOrders = async (loadMore = false) => {
    if (loadMore && !hasMore) return;
    
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const result = await getAllOrders(20, loadMore ? lastDoc : null, !loadMore);
      
      if (loadMore) {
        setOrders(prev => [...prev, ...result.orders]);
      } else {
        setOrders(result.orders);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchFirebaseProducts = async () => {
    const firestore = db;
    if (!firestore) {
      console.error('Firestore is not initialized');
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setFirebaseProducts(products);
    } catch (error) {
      console.error('Error fetching Firebase products:', error);
      toast.error('Failed to load products');
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.userName.toLowerCase().includes(query) ||
        order.userEmail.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.paymentReference?.toLowerCase().includes(query) ||
        order.id?.toLowerCase().includes(query)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    setFilteredOrders(filtered);
  };

  const requestStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let message = '';
    if (order.status === 'pending' && newStatus === 'confirmed') {
      message = 'Confirm this order? The customer will be notified that their order is confirmed.';
    } else if ((order.status === 'confirmed' || order.status === 'preparing') && newStatus === 'preparing') {
      message = 'Mark this order as being prepared? This indicates the order is being packed.';
    } else if (order.status === 'preparing' && newStatus === 'dispatched') {
      message = 'Mark this order as dispatched? The customer will be notified.';
    } else if (newStatus === 'cancelled') {
      message = 'Are you sure you want to cancel this order? This action cannot be undone.';
    } else {
      message = `Change order status to ${newStatus}?`;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Confirm Status Change',
      message,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isConfirming: true }));
        setUpdatingOrderId(orderId);
        try {
          const result = await updateOrderStatus(orderId, newStatus);
          if (result.success) {
            // Optimistic update - immediately update UI
            setOrders(prev => prev.map(order => 
              order.id === orderId ? { ...order, status: newStatus } : order
            ));
            toast.success(`Order status updated to ${newStatus}`);
          } else {
            toast.error('Failed to update order status: ' + result.error);
          }
        } catch (error) {
          console.error('Error updating status:', error);
          toast.error('Error updating order status');
        } finally {
          setUpdatingOrderId(null);
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
        }
      },
      isConfirming: false,
    });
  };

  const handleMarkCashAsPaid = (orderId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Payment Received',
      message: 'Are you sure you have received cash payment for this order? This will mark the order as ready to dispatch.',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isConfirming: true }));
        setUpdatingOrderId(orderId);
        try {
          const result = await markCashOrderAsPaid(orderId);
          if (result.success) {
            // Optimistic update - only update status (not paymentStatus)
            setOrders(prev => prev.map(order => 
              order.id === orderId ? { ...order, status: 'confirmed' } : order
            ));
            toast.success('Cash payment marked as received! Order ready for dispatch.');
          } else {
            toast.error('Failed to mark payment: ' + result.error);
          }
        } catch (error) {
          console.error('Error marking payment:', error);
          toast.error('Error marking payment as received');
        } finally {
          setUpdatingOrderId(null);
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
        }
      },
      isConfirming: false,
    });
  };

  const handleCancelCashPayment = (orderId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Payment',
      message: 'Are you sure you want to cancel the cash payment for this order? This will revert the order to unpaid status.',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isConfirming: true }));
        setUpdatingOrderId(orderId);
        try {
          const result = await cancelCashPayment(orderId);
          if (result.success) {
            // Optimistic update - only update status (not paymentStatus)
            setOrders(prev => prev.map(order => 
              order.id === orderId ? { ...order, status: 'pending' } : order
            ));
            toast.success('Cash payment cancelled. Order reverted to pending.');
          } else {
            toast.error('Failed to cancel payment: ' + result.error);
          }
        } catch (error) {
          console.error('Error cancelling payment:', error);
          toast.error('Error cancelling payment');
        } finally {
          setUpdatingOrderId(null);
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
        }
      },
      isConfirming: false,
    });
  };

  // Open Dispatch modal (replaces handleMarkDispatched)
  const handleMarkDispatched = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      handleOpenDispatch(order);
    }
  };

  const handleCancelDispatch = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Determine what status to revert to based on payment method
    // For cash orders that were paid (confirmed): revert to 'confirmed' (payment received, just not dispatched)
    // For cash orders that were not paid: revert to 'pending' (payment not received)
    // For non-cash orders: revert to 'confirmed' (payment already received)
    const revertStatus = order.paymentMethod === 'cash' && order.status === 'dispatched' ? 'confirmed' : 'confirmed';
    
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Dispatch',
      message: 'Are you sure you want to cancel the dispatch? This will revert the order to Not Dispatched status.',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isConfirming: true }));
        setUpdatingOrderId(orderId);
        try {
          const result = await cancelDispatch(orderId);
          if (result.success) {
            setOrders(prev => prev.map(o => 
              o.id === orderId ? { ...o, status: revertStatus } : o
            ));
            toast.success('Dispatch cancelled. Order is now Not Dispatched.');
          } else {
            toast.error('Failed to cancel dispatch: ' + result.error);
          }
        } catch (error) {
          console.error('Error cancelling dispatch:', error);
          toast.error('Error cancelling dispatch');
        } finally {
          setUpdatingOrderId(null);
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
        }
      },
      isConfirming: false,
    });
  };

  // Open WhatsApp modal with order details
  const handleOpenWhatsApp = (order: Order) => {
    setWhatsappModal({
      isOpen: true,
      orderId: order.id!,
      phoneNumber: order.phone || '',
      recipientType: 'customer',
      orderData: order,
    });
  };

  // Open Dispatch modal with order details
  const handleOpenDispatch = (order: Order) => {
    setDispatchModal({
      isOpen: true,
      orderId: order.id!,
      orderData: order,
    });
  };

  // Handle dispatch with driver info
  const handleDispatchWithInfo = async (driverName: string, driverPhone: string) => {
    if (!dispatchModal.orderId || !dispatchModal.orderData) return;
    
    const orderId = dispatchModal.orderId;
    const order = dispatchModal.orderData;
    
    setUpdatingOrderId(orderId);
    try {
      // First update dispatch info
      const infoResult = await updateDispatchInfo(orderId, {
        driverName: driverName || undefined,
        driverPhone: driverPhone || undefined,
      });
      
      if (!infoResult.success) {
        toast.error('Failed to update dispatch info: ' + infoResult.error);
        return;
      }
      
      // Then mark as dispatched
      const dispatchResult = await markOrderDispatched(orderId);
      
      if (dispatchResult.success) {
        // Optimistic update
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { 
            ...o, 
            status: 'dispatched',
            driverName: driverName || o.driverName,
            driverPhone: driverPhone || o.driverPhone
          } : o
        ));
        toast.success('Order dispatched with driver info!');
        setDispatchModal({ isOpen: false, orderId: '', orderData: null });
      } else {
        toast.error('Failed to dispatch order: ' + dispatchResult.error);
      }
    } catch (error) {
      console.error('Error dispatching order:', error);
      toast.error('Error dispatching order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Send to WhatsApp with the entered number
  const handleSendWhatsApp = () => {
    if (!whatsappModal.phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    
    const order = whatsappModal.orderData;
    if (!order) return;
    
    const cleanPhone = whatsappModal.phoneNumber.replace(/[^0-9]/g, '');
    let message = '';
    
    if (whatsappModal.recipientType === 'customer') {
      message = `Hello ${order.userName}! Your order from PemaFarm is ready.\n\nOrder: ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}\nTotal: KSh ${order.total}\n\nDelivery Address: ${order.address}\n\nWe'll notify you when it's dispatched!`;
    } else if (whatsappModal.recipientType === 'rider') {
      message = `Delivery Order\n\nCustomer: ${order.userName}\nAddress: ${order.address}\n\nOrder Items:\n${order.items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\n\nTotal: KSh ${order.total}\n\nPlease deliver to the address above.`;
    } else {
      message = `Order #${order.id?.slice(0, 8)}\n\nCustomer: ${order.userName}\nPhone: ${order.phone}\nAddress: ${order.address}\n\nItems:\n${order.items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\n\nTotal: KSh ${order.total}`;
    }
    
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    setWhatsappModal({ ...whatsappModal, isOpen: false });
    toast.success('Opening WhatsApp...');
  };

  const isInSelectedMonth = (timestamp: any): boolean => {
    if (!timestamp) return false;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  };

  const getStats = (): DashboardStats => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => isInSelectedMonth(order.createdAt))
      .reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    return { totalOrders, totalRevenue, pendingOrders, deliveredOrders };
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Paid';
      case 'preparing': return 'Preparing';
      case 'dispatched': return 'En Route';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'confirmed': return <CheckCircle size={14} />;
      case 'preparing': return <Package size={14} />;
      case 'dispatched': return <TrendingUp size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const allProducts: DisplayProduct[] = [
    ...firebaseProducts
      .map(p => ({ ...p, source: 'firebase' as const }))
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      }),
    ...staticProducts.map(p => ({ ...p, source: 'static' as const, createdAt: null }))
  ];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(productSearchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalOrdersPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (ordersPage - 1) * itemsPerPage,
    ordersPage * itemsPerPage
  );

  const totalProductsPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (productsPage - 1) * itemsPerPage,
    productsPage * itemsPerPage
  );

  const getCategoryStats = () => {
    const categories = [...new Set(allProducts.map(p => p.category))];
    return categories.map(cat => ({
      name: cat,
      count: allProducts.filter(p => p.category === cat).length
    }));
  };

  const requestEdit = (product: DisplayProduct) => {
    if (product.source === 'static') {
      toast.error(' cannot be edited.');
      return;
    }
    setEditingProduct(product);
  };

  const handleEditSave = async (id: string, data: { name: string; category: string; price?: number; unit?: string; variants?: ProductVariant[] }) => {
    try {
      const firestore = db;
      if (!firestore) throw new Error('Firestore not initialized');
      const productRef = doc(firestore, 'products', id);
      
      // Prepare update data - remove undefined values
      const updateData: any = {
        name: data.name,
        category: data.category,
      };
      
      if (data.variants && data.variants.length > 0) {
        updateData.variants = data.variants;
        updateData.price = null;
        updateData.unit = null;
      } else {
        updateData.price = data.price;
        updateData.unit = data.unit;
        updateData.variants = [];
      }
      
      await updateDoc(productRef, updateData);
      await fetchFirebaseProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error; // re-throw to let modal know
    }
  };

  const requestDelete = (product: DisplayProduct) => {
    if (product.source === 'static') {
      toast.error(' cannot be deleted.');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isConfirming: true }));
        try {
          const firestore = db;
          if (!firestore) throw new Error('Firestore not initialized');
          const productRef = doc(firestore, 'products', product.id!);
          await deleteDoc(productRef);
          await fetchFirebaseProducts();
          toast.success('Product deleted successfully');
        } catch (error) {
          console.error('Error deleting product:', error);
          toast.error('Failed to delete product');
        } finally {
          setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {}, isConfirming: false });
        }
      },
      isConfirming: false,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageSizeWarning('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024) {
        setImageSizeWarning('Image is larger than 500KB. This may affect performance. Please choose a smaller file.');
        e.target.value = '';
        return;
      }
      setNewProduct({ ...newProduct, imageFile: file });
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || `Upload failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to Cloudinary. Please check your internet connection and Cloudinary configuration.');
      }
      throw error;
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.slug) {
      toast.error('Please fill all required fields.');
      return;
    }

    // Validate based on whether product has variants
    if (newProduct.hasVariants) {
      const invalidVariants = newProduct.variants.filter(v => !v.size || !v.price);
      if (invalidVariants.length > 0) {
        toast.error('Please fill all variant fields');
        return;
      }
    } else {
      if (!newProduct.price || !newProduct.unit) {
        toast.error('Please fill price and unit.');
        return;
      }
    }

    setUploadingImage(true);
    try {
      let imageUrl = '';
      
      // Try to upload image if provided
      if (newProduct.imageFile) {
        try {
          imageUrl = await uploadImageToCloudinary(newProduct.imageFile);
        } catch (uploadError: any) {
          console.error('Image upload failed:', uploadError);
          toast.error(uploadError.message || 'Image upload failed. Product will be saved without image.');
          // Continue without image rather than failing entirely
        }
      }

      const firestore = db;
      if (!firestore) throw new Error('Firestore is not initialized');
      
      const productData: any = {
        name: newProduct.name,
        slug: newProduct.slug,
        category: newProduct.category,
        image: imageUrl,
        createdAt: serverTimestamp(),
      };
      
      if (newProduct.hasVariants) {
        productData.variants = newProduct.variants;
        productData.price = null;
        productData.unit = null;
      } else {
        productData.price = Number(newProduct.price);
        productData.unit = newProduct.unit;
        productData.variants = [];
      }
      
      await addDoc(collection(firestore, 'products'), productData);

      await fetchFirebaseProducts();
      setShowAddModal(false);
      setNewProduct({
        name: '',
        slug: '',
        category: 'Engine Parts',
        price: '',
        unit: '',
        imageFile: null,
        hasVariants: false,
        variants: [],
      });
      setImageSizeWarning('');
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    } finally {
      setUploadingImage(false);
    }
  };

  const monthOptions = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    monthOptions.push({ value: d.getMonth(), year: d.getFullYear(), label: d.toLocaleString('default', { month: 'long', year: 'numeric' }) });
  }

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const categoryStats = getCategoryStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        isConfirming={confirmModal.isConfirming}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleEditSave}
      />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={whatsappModal.isOpen}
        phoneNumber={whatsappModal.phoneNumber}
        recipientType={whatsappModal.recipientType}
        onClose={() => setWhatsappModal({ ...whatsappModal, isOpen: false })}
        onPhoneChange={(phone) => setWhatsappModal({ ...whatsappModal, phoneNumber: phone })}
        onRecipientTypeChange={(type) => setWhatsappModal({ ...whatsappModal, recipientType: type })}
        onSend={handleSendWhatsApp}
      />
      
      {/* Dispatch Modal */}
      <DispatchModal
        isOpen={dispatchModal.isOpen}
        order={dispatchModal.orderData}
        onClose={() => setDispatchModal({ isOpen: false, orderId: '', orderData: null })}
        onUpdate={handleDispatchWithInfo}
        isUpdating={updatingOrderId !== null}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-700 p-2 ">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-500">Manage your store</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex bg-gray-100  p-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2  text-sm font-medium transition ${
                    activeTab === 'orders' 
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span className="sm:inline">Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2  text-sm font-medium transition ${
                    activeTab === 'products' 
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Carrot size={18} />
                  <span className="sm:inline">Products</span>
                </button>
              </div>
              <button
                onClick={() => {
                  fetchOrders();
                  fetchFirebaseProducts();
                }}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-700 text-white  hover:bg-blue-800 transition disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                <span className="sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white  shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 ">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white  shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                <div className="mt-2">
                  <select
                    value={`${selectedMonth}-${selectedYear}`}
                    onChange={(e) => {
                      const [month, year] = e.target.value.split('-').map(Number);
                      setSelectedMonth(month);
                      setSelectedYear(year);
                    }}
                    className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                  >
                    {monthOptions.map(opt => (
                      <option key={`${opt.year}-${opt.value}`} value={`${opt.value}-${opt.year}`}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 ">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white  shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 ">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-white  shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{allProducts.length}</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 ">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'orders' ? (
          /* Orders Tab */
          <div className="bg-white border border-gray-200 ">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Orders Management</h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none px-4 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 w-full"
                    >
                      <option value="all">All Orders</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table - horizontally scrollable on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] sm:min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID / Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 sm:px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 sm:px-6 py-12 text-center text-gray-500">
                        <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No orders found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <span className="text-xs sm:text-sm font-mono text-gray-900 block">
                            {order.id?.slice(0, 8) || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{order.userName}</div>
                          <div className="text-xs text-gray-500">{order.userEmail}</div>
                          <div className="text-xs text-gray-500">{order.phone}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {order.items.length > 0 && (
                              <div>{order.items[0].quantity}x {order.items[0].name}</div>
                            )}
                            {order.items.length > 1 && (
                              <button
                                onClick={() => toggleExpandOrder(order.id!)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                              >
                                {expandedOrderId === order.id ? (
                                  <>Show less <ChevronUp size={14} /></>
                                ) : (
                                  <>+{order.items.length - 1} more items <ChevronDown size={14} /></>
                                )}
                              </button>
                            )}
                            {expandedOrderId === order.id && order.items.length > 1 && (
                              <div className="mt-2 space-y-1 border-l-2 border-blue-200 pl-2">
                                {order.items.slice(1).map((item, idx) => (
                                  <div key={idx}>{item.quantity}x {item.name}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatCurrency(order.total)}
                          </div>
                          <div className="text-xs text-gray-400">
                            incl. delivery
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.paymentMethod === 'cash' ? 'bg-amber-100 text-amber-800' :
                              order.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {order.paymentMethod === 'cash' ? '💵 Cash' :
                               order.paymentMethod === 'card' ? '💳 Card' : '📱 Mobile'}
                            </span>
                            {order.paymentMethod === 'cash' && order.status === 'pending' && (
                              <span className="text-xs text-amber-600 font-medium">
                                Awaiting payment
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm text-gray-900 max-w-[200px]">
                            {order.address}
                          </div>
                          {order.deliveryNotes && (
                            <div className="text-xs text-gray-500 mt-1 italic max-w-[200px]">
                              Note: {order.deliveryNotes}
                            </div>
                          )}
                          {/* Driver info for dispatched/delivered orders */}
                          {(order.status === 'dispatched' || order.status === 'delivered') && (
                            <div className="mt-2 p-2 bg-purple-50 rounded text-xs">
                              <div className="font-medium text-purple-700">Driver Info</div>
                              {order.driverName && <div>Name: {order.driverName}</div>}
                              {order.driverPhone && (
                                <div className="flex items-center gap-2 mt-1">
                                  <a href={`tel:${order.driverPhone}`} className="text-purple-600 hover:underline flex items-center gap-1">
                                    <Phone size={12} /> Driver: {order.driverPhone}
                                  </a>
                                  <a 
                                    href={`https://wa.me/${order.driverPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Delivery Order\n\nCustomer: ${order.userName}\nAddress: ${order.address}\n\nOrder Items:\n${order.items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}\n\nTotal: KSh ${order.total}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.173-.148.347-.347.52-.52.174-.174.219-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.06 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    Share to WhatsApp
                                  </a>
                                </div>
                              )}
                              {order.dispatchDate && (
                                <div className="text-gray-500">
                                  Dispatched: {formatDate(order.dispatchDate)}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          {/* Order Status - Single consolidated view */}
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'delivered'
                                ? 'bg-blue-100 text-blue-800'
                                : order.status === 'dispatched'
                                  ? 'bg-purple-100 text-purple-800'
                                : order.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'delivered' ? '✓ Delivered' : 
                               order.status === 'dispatched' ? '🚚 En Route' :
                               order.status === 'confirmed' ? '✓ Confirmed' :
                               order.status === 'cancelled' ? '✕ Cancelled' :
                               '○ Pending'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          {/* Action Buttons - Only Mark Paid / Cancel Pay for payment status */}
                          {order.status === 'delivered' ? (
                            /* Delivered orders - No action buttons since job is complete */
                            <span className="text-xs text-gray-400">Job Complete</span>
                          ) : order.paymentMethod === 'cash' && order.status === 'pending' ? (
                            /* Cash order NOT paid - show Mark Paid button */
                            <button
                              onClick={() => handleMarkCashAsPaid(order.id!)}
                              disabled={updatingOrderId === order.id}
                              className="text-xs bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              Mark Paid
                            </button>
                          ) : order.paymentMethod === 'cash' && (order.status === 'confirmed' || order.status === 'preparing') ? (
                            /* Cash order PAID (confirmed/preparing) - show Cancel Pay button */
                            <button
                              onClick={() => handleCancelCashPayment(order.id!)}
                              disabled={updatingOrderId === order.id}
                              className="text-xs bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600 transition disabled:opacity-50"
                            >
                              Cancel Pay
                            </button>
                          ) : order.status === 'cancelled' ? (
                            /* Cancelled order - can restore */
                            <button
                              onClick={() => requestStatusUpdate(order.id!, 'confirmed')}
                              disabled={updatingOrderId === order.id}
                              className="text-xs bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600 transition disabled:opacity-50"
                            >
                              Restore
                            </button>
                          ) : (
                            /* Online paid orders - can WhatsApp or Cancel */
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleOpenWhatsApp(order)}
                                className="text-xs bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700 transition text-center"
                              >
                                WhatsApp
                              </button>
                              <button
                                onClick={() => requestStatusUpdate(order.id!, 'cancelled')}
                                disabled={updatingOrderId === order.id}
                                className="text-xs bg-red-500 text-white px-2 py-1.5 rounded hover:bg-red-600 transition disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {updatingOrderId === order.id && (
                            <Loader2 size={14} className="animate-spin ml-2 inline" />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Orders */}
            {!loading && filteredOrders.length > 0 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Showing {(ordersPage - 1) * itemsPerPage + 1} to {Math.min(ordersPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                    disabled={ordersPage === 1}
                    className="p-2 border border-gray-300  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-3 py-2 text-xs sm:text-sm text-gray-700">
                    Page {ordersPage} of {totalOrdersPages}
                  </span>
                  <button
                    onClick={() => setOrdersPage(p => Math.min(totalOrdersPages, p + 1))}
                    disabled={ordersPage === totalOrdersPages}
                    className="p-2 border border-gray-300  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Products Tab */
          <div className="bg-white  shadow-sm border border-gray-100">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Products Catalog</h2>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="appearance-none px-4 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 w-full"
                    >
                      <option value="all">All Categories</option>
                      {categoryStats.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-700 text-white  hover:bg-blue-800 transition w-full sm:w-auto"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>
                </div>
              </div>
            </div>

            {/* Category Stats */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50 overflow-x-auto">
              <div className="flex flex-nowrap sm:flex-wrap gap-2">
                {categoryStats.map(cat => (
                  <span 
                    key={cat.name}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600 whitespace-nowrap"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-gray-400">({cat.count})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Products Table - horizontally scrollable on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] sm:min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-12 text-center text-gray-500">
                        <Carrot className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No products found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={`${product.source}-${product.id}`} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-8 h-8 sm:w-10 sm:h-10  object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10  bg-gray-200 flex items-center justify-center">
                                <Carrot size={16} className="text-gray-400" />
                              </div>
                            )}
                            <span className="text-xs sm:text-sm font-medium text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-semibold text-gray-900">
                            {formatCurrency(product.price ?? 0)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="text-xs text-gray-500">{product.unit}</span>
                        </td>
                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="text-xs font-mono text-gray-500">{product.slug}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => requestEdit(product)}
                              className={`p-1.5 sm:p-1 rounded ${product.source === 'static' ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                              title={product.source === 'static' ? 'cannot be edited' : 'Edit'}
                              disabled={product.source === 'static'}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => requestDelete(product)}
                              className={`p-1.5 sm:p-1 rounded ${product.source === 'static' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                              title={product.source === 'static' ? 'cannot be deleted' : 'Delete'}
                              disabled={product.source === 'static'}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Products */}
            {filteredProducts.length > 0 && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Showing {(productsPage - 1) * itemsPerPage + 1} to {Math.min(productsPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setProductsPage(p => Math.max(1, p - 1))}
                    disabled={productsPage === 1}
                    className="p-2 border border-gray-300  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-3 py-2 text-xs sm:text-sm text-gray-700">
                    Page {productsPage} of {totalProductsPages}
                  </span>
                  <button
                    onClick={() => setProductsPage(p => Math.min(totalProductsPages, p + 1))}
                    disabled={productsPage === totalProductsPages}
                    className="p-2 border border-gray-300  hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Engine Parts">Engine Parts</option>
                  <option value="Brake Systems">Brake Systems</option>
                  <option value="Tires & Wheels">Tires & Wheels</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Filters">Filters</option>
                  <option value="Body Parts">Body Parts</option>
                </select>
              </div>
              
              {/* Variants Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newHasVariants"
                  checked={newProduct.hasVariants}
                  onChange={(e) => setNewProduct({ ...newProduct, hasVariants: e.target.checked, variants: e.target.checked ? [{ size: '', price: 0 }] : [] })}
                  className="w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="newHasVariants" className="text-sm font-medium text-gray-700">
                  Product has different sizes/variants
                </label>
              </div>
              
              {newProduct.hasVariants ? (
                <div className="space-y-3 border border-gray-200  p-3">
                  <label className="block text-sm font-medium text-gray-700">Variants (sizes with prices)</label>
                  {newProduct.variants.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Size (e.g., 350ml, 500g)"
                          value={variant.size}
                          onChange={(e) => {
                            const updated = [...newProduct.variants];
                            updated[index] = { ...updated[index], size: e.target.value };
                            setNewProduct({ ...newProduct, variants: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Price (KES)"
                          value={variant.price || ''}
                          onChange={(e) => {
                            const updated = [...newProduct.variants];
                            updated[index] = { ...updated[index], price: Number(e.target.value) };
                            setNewProduct({ ...newProduct, variants: updated });
                          }}
                          className="w-full px-3 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = newProduct.variants.filter((_, i) => i !== index);
                          setNewProduct({ ...newProduct, variants: updated });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, variants: [...newProduct.variants, { size: '', price: 0 }] })}
                    className="text-sm text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Variant
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!newProduct.hasVariants}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g., per kg, per piece)</label>
                    <input
                      type="text"
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full px-3 py-3 sm:py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!newProduct.hasVariants}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {imageSizeWarning && (
                  <p className="text-sm text-amber-600 mt-1">{imageSizeWarning}</p>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-blue-700 text-white  hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300  hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}