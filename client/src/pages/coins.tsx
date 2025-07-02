import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Coins, CreditCard, Bitcoin, Shield } from "lucide-react";
import { useLocation } from "wouter";

interface CoinPackage {
  id: number;
  coins: number;
  price: {
    AED: number;
    USD: number;
    EUR: number;
    PKR: number;
  };
  popular?: boolean;
}

export default function CoinsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<keyof CoinPackage["price"]>("AED");
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"stripe" | "coinbase" | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: packages, isLoading: packagesLoading } = useQuery<CoinPackage[]>({
    queryKey: ["/api/coin-packages"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to be logged in to access this page. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  const handlePackageSelect = (pkg: CoinPackage) => {
    setSelectedPackage(pkg);
  };

  const handlePaymentMethodSelect = (method: "stripe" | "coinbase") => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToPayment = () => {
    if (!selectedPackage || !selectedPaymentMethod) return;

    // Navigate to checkout with selected options
    setLocation(`/checkout?coins=${selectedPackage.coins}&amount=${selectedPackage.price[selectedCurrency]}&currency=${selectedCurrency}&method=${selectedPaymentMethod}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />
      
      <main className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">
              Get <span className="text-gradient">Coins</span>
            </h1>
            <p className="text-xl text-slate-600">Choose your coin package and boost your Pk Matchz experience</p>
          </div>
          
          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as keyof CoinPackage["price"])}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="PKR">PKR - Pakistani Rupee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Coins Grid */}
          {packagesLoading ? (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-slate-200 rounded-lg"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {packages?.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all hover-glow relative ${
                    selectedPackage?.id === pkg.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 -right-3 bg-gradient-secondary">
                      Popular
                    </Badge>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {pkg.coins.toLocaleString()}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-sm text-slate-600">{selectedCurrency}</span>
                      <span className="text-xl font-bold text-primary">
                        {pkg.price[selectedCurrency].toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className={`w-full ${
                        selectedPackage?.id === pkg.id
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gradient-primary hover-glow'
                      }`}
                    >
                      {selectedPackage?.id === pkg.id ? 'Selected' : 'Select'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Payment Section */}
          <div className="max-w-lg mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Payment Method</h3>
              
              {/* Selected Package Info */}
              {selectedPackage && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Selected Package:</span>
                    <span className="font-bold text-slate-900">{selectedPackage.coins.toLocaleString()} Coins</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-slate-600">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {selectedCurrency} {selectedPackage.price[selectedCurrency].toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Payment Options */}
              <div className="space-y-4 mb-6">
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPaymentMethod === 'coinbase' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePaymentMethodSelect('coinbase')}
                >
                  <CardContent className="p-4 flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="coinbase"
                      checked={selectedPaymentMethod === 'coinbase'}
                      onChange={() => handlePaymentMethodSelect('coinbase')}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">Coinbase Commerce</div>
                      <div className="text-sm text-slate-600">Pay with cryptocurrency</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Bitcoin className="w-6 h-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card
                  className={`cursor-pointer transition-all ${
                    selectedPaymentMethod === 'stripe' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePaymentMethodSelect('stripe')}
                >
                  <CardContent className="p-4 flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={selectedPaymentMethod === 'stripe'}
                      onChange={() => handlePaymentMethodSelect('stripe')}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-slate-900">Credit/Debit Card</div>
                      <div className="text-sm text-slate-600">Pay with card via Stripe</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Button
                onClick={handleProceedToPayment}
                disabled={!selectedPackage || !selectedPaymentMethod}
                className="w-full py-4 bg-gradient-primary hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </Button>
              
              {/* Security Notice */}
              <div className="flex items-center justify-center mt-4 text-sm text-slate-600">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure payment powered by industry-leading encryption</span>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
