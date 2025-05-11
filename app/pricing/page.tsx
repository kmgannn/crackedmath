'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function Pricing() {
  const { user } = useAuth();

  const handleUpgrade = async () => {
    // TODO: Implement HitPay integration
    console.log('Upgrading user:', user?.uid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Start solving math problems today
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {/* Free Tier */}
          <Card className="relative p-8 bg-white border-2 border-gray-200 rounded-2xl shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$0</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500">Perfect for getting started</p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">5 questions per day</span>
                </li>
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">Basic solver access</span>
                </li>
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">Step-by-step solutions</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Pro Tier */}
          <Card className="relative p-8 bg-white border-2 border-primary rounded-2xl shadow-sm flex flex-col">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
              Popular
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
              <p className="mt-4 flex items-baseline text-gray-900">
                <span className="text-5xl font-extrabold tracking-tight">$9.99</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </p>
              <p className="mt-6 text-gray-500">For serious math students</p>

              <ul className="mt-6 space-y-4">
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">Unlimited questions</span>
                </li>
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">All practice modes</span>
                </li>
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">Priority support</span>
                </li>
                <li className="flex">
                  <Check className="flex-shrink-0 h-6 w-6 text-green-500" />
                  <span className="ml-3 text-gray-500">Advanced analytics</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleUpgrade}
              className="mt-8 w-full bg-primary text-white hover:bg-primary/90"
            >
              Upgrade to Pro
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
} 