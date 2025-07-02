import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Bitcoin } from "lucide-react";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_default");

interface CheckoutParams {
  coins: string;
  amount: string;
  currency: string;
  method: 'stripe' | 'coinbase';
}

function CheckoutForm({ params }: { params: CheckoutParams }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/coins`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your coins have been added to your account!",
        });
        setLocation("/coins");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-gradient-primary hover-glow"
      >
        {isProcessing ? "Processing..." : `Pay ${params.currency} ${params.amount}`}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [params, setParams] = useState<CheckoutParams | null>(null);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const coins = urlParams.get("coins");
    const amount = urlParams.get("amount");
    const currency = urlParams.get("currency");
    const method = urlParams.get("method") as 'stripe' | 'coinbase';

    if (!coins || !amount || !currency || !method) {
      toast({
        title: "Invalid parameters",
        description: "Please select a coin package first.",
        variant: "destructive",
      });
      setLocation("/coins");
      return;
    }

    setParams({ coins, amount, currency, method });
  }, [location]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to be logged in to make a purchase.",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  // Create payment intent for Stripe
  const paymentIntentMutation = useMutation({
    mutationFn: async () => {
      if (!params) return;
      
      const token = localStorage.getItem("token");
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coins: parseInt(params.coins),
          amount: parseFloat(params.amount),
          currency: params.currency,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Setup Failed",
        description: error.message,
        variant: "destructive",
      });
      setLocation("/coins");
    },
  });

  // Create payment intent when component mounts
  useEffect(() => {
    if (params && params.method === "stripe") {
      paymentIntentMutation.mutate();
    }
  }, [params]);

  // Handle Coinbase Commerce
  useEffect(() => {
    if (params && params.method === "coinbase") {
      // TODO: Implement Coinbase Commerce integration
      toast({
        title: "Coinbase Commerce",
        description: "Coinbase Commerce integration coming soon!",
      });
      setLocation("/coins");
    }
  }, [params]);

  if (isLoading || !params) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (params.method === "stripe" && !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Header />
        <main className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Setting up payment...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={() => setLocation("/coins")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coins
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {params.method === "stripe" ? (
                    <CreditCard className="w-6 h-6" />
                  ) : (
                    <Bitcoin className="w-6 h-6" />
                  )}
                  <span>Checkout</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Order Summary</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">{parseInt(params.coins).toLocaleString()} Coins</span>
                    <span className="font-bold text-slate-900">
                      {params.currency} {parseFloat(params.amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Form */}
                {params.method === "stripe" && clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                      },
                    }}
                  >
                    <CheckoutForm params={params} />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
