'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart,
  Truck,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Loader2,
} from 'lucide-react';
import {
  useCartStore,
  useCheckoutStore,
  useAuthStore,
  useUIStore,
  useOrderStore,
  useNotificationStore,
  shippingMethods,
} from '@/store/useStore';
import type { Address, CheckoutStep } from '@/types';

const steps: { id: CheckoutStep; label: string; icon: React.ElementType }[] = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const {
    step,
    setStep,
    shippingAddress,
    setShippingAddress,
    shippingMethod,
    setShippingMethod,
    sameAsShipping,
    setSameAsShipping,
    isProcessing,
    setProcessing,
    reset,
  } = useCheckoutStore();
  const { isAuthenticated, user, addresses } = useAuthStore();
  const { setAuthModalOpen } = useUIStore();
  const { createOrder } = useOrderStore();
  const { addNotification } = useNotificationStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  // Card details (mock for demo)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const subtotal = getSubtotal();
  const shipping = shippingMethod?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (items.length === 0 && step !== 'confirmation') {
      router.push('/');
    }
  }, [items, step, router]);

  useEffect(() => {
    // Set default address if available
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.id);
      setShippingAddress(defaultAddr);
    }
  }, [addresses, selectedAddressId, setShippingAddress]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
    setShippingAddress(address);
    setShowNewAddressForm(false);
  };

  const handleNewAddressSubmit = () => {
    if (
      newAddress.firstName &&
      newAddress.lastName &&
      newAddress.address1 &&
      newAddress.city &&
      newAddress.state &&
      newAddress.postalCode
    ) {
      const address: Address = {
        id: `temp-${Date.now()}`,
        userId: user?.id || '',
        firstName: newAddress.firstName || '',
        lastName: newAddress.lastName || '',
        address1: newAddress.address1 || '',
        address2: newAddress.address2,
        city: newAddress.city || '',
        state: newAddress.state || '',
        postalCode: newAddress.postalCode || '',
        country: newAddress.country || 'United States',
        phone: newAddress.phone,
        isDefault: false,
      };
      setShippingAddress(address);
      setShowNewAddressForm(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true, 'login');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order
      const order = await createOrder({
        userId: user?.id,
        items: items.map((item) => ({
          id: `item-${Date.now()}-${item.product.id}`,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0] || '',
          quantity: item.quantity,
          price: item.product.price || 0,
        })),
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: shippingAddress!,
        billingAddress: sameAsShipping ? shippingAddress! : shippingAddress!,
        paymentMethod: 'card',
      });

      clearCart();
      setStep('confirmation');

      addNotification({
        type: 'success',
        title: 'Order placed!',
        message: `Your order #${order.orderNumber} has been confirmed.`,
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Payment failed',
        message: 'There was an error processing your payment. Please try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const canProceedToPayment =
    shippingAddress !== null && shippingMethod !== null;
  const canProceedToReview = cardNumber && cardExpiry && cardCvc && cardName;

  // Order Confirmation Screen
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Thank you for your order!
          </h1>
          <p className="text-gray-400 mb-8">
            We&apos;ve received your order and will send you a confirmation
            email shortly.
          </p>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
            <p className="text-gray-400 text-sm mb-2">Order Total</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(total)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Orders
            </Link>
            <Link
              href="/"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    step === s.id
                      ? 'text-cyan-400'
                      : steps.findIndex((x) => x.id === step) > index
                        ? 'text-green-400'
                        : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step === s.id
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : steps.findIndex((x) => x.id === step) > index
                          ? 'border-green-400 bg-green-500/10'
                          : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    {steps.findIndex((x) => x.id === step) > index ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="font-medium hidden sm:block">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-4 ${
                      steps.findIndex((x) => x.id === step) > index
                        ? 'bg-green-400'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Shipping Address
                </h2>

                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">
                      Please sign in to continue checkout
                    </p>
                    <button
                      onClick={() => setAuthModalOpen(true, 'login')}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Saved Addresses */}
                    {addresses.length > 0 && !showNewAddressForm && (
                      <div className="space-y-3 mb-6">
                        {addresses.map((address) => (
                          <label
                            key={address.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                              selectedAddressId === address.id
                                ? 'border-cyan-500 bg-cyan-500/5'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === address.id}
                              onChange={() => handleAddressSelect(address)}
                              className="mt-1"
                            />
                            <div>
                              <p className="text-white font-medium">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {address.address1}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {address.city}, {address.state}{' '}
                                {address.postalCode}
                              </p>
                            </div>
                          </label>
                        ))}
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                        >
                          + Use a different address
                        </button>
                      </div>
                    )}

                    {/* New Address Form */}
                    {(showNewAddressForm || addresses.length === 0) && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={newAddress.firstName}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                firstName: e.target.value,
                              })
                            }
                            placeholder="First Name"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            value={newAddress.lastName}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                lastName: e.target.value,
                              })
                            }
                            placeholder="Last Name"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <input
                          type="text"
                          value={newAddress.address1}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              address1: e.target.value,
                            })
                          }
                          placeholder="Street Address"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                city: e.target.value,
                              })
                            }
                            placeholder="City"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                state: e.target.value,
                              })
                            }
                            placeholder="State"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            value={newAddress.postalCode}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                postalCode: e.target.value,
                              })
                            }
                            placeholder="ZIP Code"
                            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <input
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Phone Number"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                        {addresses.length > 0 && (
                          <button
                            onClick={() => setShowNewAddressForm(false)}
                            className="text-gray-400 hover:text-white text-sm"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={handleNewAddressSubmit}
                          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                          Use This Address
                        </button>
                      </div>
                    )}

                    {/* Shipping Methods */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-cyan-400" />
                        Shipping Method
                      </h3>
                      <div className="space-y-3">
                        {shippingMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                              shippingMethod?.id === method.id
                                ? 'border-cyan-500 bg-cyan-500/5'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                checked={shippingMethod?.id === method.id}
                                onChange={() => setShippingMethod(method)}
                              />
                              <div>
                                <p className="text-white font-medium">
                                  {method.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                            <span className="text-white font-medium">
                              {formatCurrency(method.price)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  Payment Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-300">
                      Billing address same as shipping
                    </span>
                  </label>
                </div>

                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400 text-sm">
                    🔒 Your payment information is encrypted and secure. We
                    never store your full card details.
                  </p>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="space-y-6">
                {/* Shipping Info */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setStep('shipping')}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  {shippingAddress && (
                    <div className="text-gray-400">
                      <p className="text-white">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p>{shippingAddress.address1}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{' '}
                        {shippingAddress.postalCode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Info */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setStep('payment')}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-white">
                        Card ending in {cardNumber.slice(-4)}
                      </p>
                      <p className="text-gray-400 text-sm">{cardName}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4"
                      >
                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-white font-medium">
                          {formatCurrency(
                            (item.product.price || 0) * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step !== 'shipping' && (
                <button
                  onClick={() => {
                    if (step === 'payment') setStep('shipping');
                    if (step === 'review') setStep('payment');
                  }}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              {step === 'shipping' && (
                <button
                  onClick={() => setStep('payment')}
                  disabled={!canProceedToPayment}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              {step === 'payment' && (
                <button
                  onClick={() => setStep('review')}
                  disabled={!canProceedToReview}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Order
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              {step === 'review' && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3"
                  >
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-white text-sm">
                      {formatCurrency(
                        (item.product.price || 0) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-gray-500 text-sm">
                    + {items.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shipping > 0 ? formatCurrency(shipping) : 'Calculated'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg pt-3 border-t border-gray-800">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
