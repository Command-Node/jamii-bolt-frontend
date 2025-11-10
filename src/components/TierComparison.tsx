import { Check, Zap, Crown, Shield, Star, TrendingUp, Waves, Sparkles } from 'lucide-react';

type TierComparisonProps = {
  onSelectTier?: (tier: 'basic' | 'pro' | 'premium') => void;
  showSelectionButtons?: boolean;
};

const tiers = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Shield,
    price: '$10',
    priceDetail: '10-day free trial, then /month',
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-300',
    bgAccent: 'bg-gray-50',
    textColor: 'text-gray-700',
    buttonColor: 'bg-gray-600 hover:bg-gray-700',
    popular: false,
    description: 'Start serving your neighborhood',
    platformFee: '10%',
    features: [
      { text: '1 service category in 5-mile radius', included: true },
      { text: '$500 monthly earnings cap', included: true },
      { text: '10% platform fee', included: true },
      { text: '3 Waves/month allocation', included: true },
      { text: 'Earn Waves for great service', included: true },
      { text: 'Basic profile & messaging', included: true },
      { text: 'Jamii Shop Access', included: false },
      { text: 'Multiple service categories', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: Zap,
    price: '$25',
    priceDetail: 'Per month ($20 for verified professionals)',
    color: 'from-[#FF6B35] to-[#E5612F]',
    borderColor: 'border-[#FF6B35]',
    bgAccent: 'bg-orange-50',
    textColor: 'text-[#FF6B35]',
    buttonColor: 'bg-gradient-to-r from-[#FF6B35] to-[#E5612F] hover:shadow-xl',
    popular: true,
    badge: 'Most Popular',
    description: 'Grow your commUNITY impact',
    platformFee: '8%',
    features: [
      { text: '3 service categories in 5-mile radius', included: true },
      { text: '$2,500 monthly earnings cap', included: true },
      { text: '8% platform fee', included: true },
      { text: '5 Waves/month allocation', included: true },
      { text: 'Jamii Shop access', included: true },
      { text: '$20/month for Military/Teachers/First Responders', included: true },
      { text: 'Enhanced profile & analytics', included: true },
      { text: 'Priority listing', included: true },
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    icon: Crown,
    price: '$50',
    priceDetail: 'Per month',
    color: 'from-[#2ECC71] to-[#27AE60]',
    borderColor: 'border-[#2ECC71]',
    bgAccent: 'bg-green-50',
    textColor: 'text-[#2ECC71]',
    buttonColor: 'bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:shadow-xl',
    popular: false,
    badge: 'Best Value',
    description: 'Scale your neighborhood business',
    platformFee: '5%',
    features: [
      { text: '5 service categories in 5-mile radius', included: true },
      { text: '$5,000 monthly earnings cap', included: true },
      { text: '5% platform fee', included: true },
      { text: '8 Waves/month allocation', included: true },
      { text: 'Enhanced shop features', included: true },
      { text: 'Premium support', included: true },
      { text: 'Featured placement', included: true },
      { text: 'Advanced analytics', included: true },
    ],
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    icon: Sparkles,
    price: '$150',
    priceDetail: 'Application only',
    color: 'from-purple-600 to-purple-700',
    borderColor: 'border-purple-600',
    bgAccent: 'bg-purple-50',
    textColor: 'text-purple-700',
    buttonColor: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-xl',
    popular: false,
    badge: 'Elite',
    description: 'Maximum impact & earnings',
    platformFee: '3%',
    features: [
      { text: '8 service categories in 5-mile radius', included: true },
      { text: '$15,000 monthly earnings cap', included: true },
      { text: '3% platform fee (lowest!)', included: true },
      { text: '20 Waves/month allocation', included: true },
      { text: 'Premium shop with advanced analytics', included: true },
      { text: 'Featured placement & coordinator opportunities', included: true },
      { text: 'Application required - community impact based', included: true },
      { text: 'Required for all registered businesses', included: true },
    ],
  },
];

export function TierComparison({ onSelectTier, showSelectionButtons = false }: TierComparisonProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 mb-6">
            <Star className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-sm font-semibold text-[#1F2937]">Choose Your Tier</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            Keep More of What You Earn
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto mb-6">
            Build comm<span className="font-bold">UNITY</span> wealth, not corporate profits. JAMII's fees are designed to keep money in your pocket.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-green-50 border-2 border-orange-200 rounded-xl px-8 py-6 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#6B7280] mb-2">Industry Standard</p>
                <p className="text-3xl font-bold text-red-600 mb-1">20-30%</p>
                <p className="text-xs text-[#6B7280]">+ Payment Processing Fees</p>
                <p className="text-xs text-[#6B7280] mt-1">Most marketplace platforms</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#2ECC71] mb-2">JAMII Fees</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent mb-1">3-10%</p>
                <p className="text-xs text-[#6B7280]">+ Standard Payment Processing</p>
                <p className="text-xs text-[#2ECC71] font-semibold mt-1">As low as 3% at Community Leader tier</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-200 text-center">
              <p className="text-sm text-[#6B7280]">
                <span className="font-semibold text-[#1F2937]">Payment Processing:</span> $0.30 + 2.9% per transaction (standard across all platforms)
              </p>
              <p className="text-sm font-bold text-[#FF6B35] mt-2">
                Keep more of what you earn - typical marketplace platforms take 20-30%, we take as little as 3%
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl px-8 py-6 max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-3xl">🌊</div>
              <h3 className="text-2xl font-bold text-[#1F2937]">Introducing Waves</h3>
            </div>
            <p className="text-center text-[#6B7280] mb-4 max-w-2xl mx-auto">
              <span className="font-bold text-[#1F2937]">Waves 🌊 are JAMII's premium community recognition currency.</span> Unlike free ratings, Waves have real value.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1F2937]">Higher Search Ranking</p>
                <p className="text-xs text-[#6B7280] mt-1">More Waves = Better visibility</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1F2937]">Community Status</p>
                <p className="text-xs text-[#6B7280] mt-1">Progress to higher levels</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Sparkles className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#1F2937]">Future Rewards</p>
                <p className="text-xs text-[#6B7280] mt-1">100 Waves = $100 in local rewards</p>
              </div>
            </div>
            <p className="text-center text-sm text-[#6B7280]">
              <span className="font-semibold text-blue-700">Earn through great service</span> or purchase at $5 per Wave
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-[#6B7280] bg-green-50 border border-green-200 rounded-lg px-6 py-3 inline-flex">
            <TrendingUp className="w-5 h-5 text-[#2ECC71]" />
            <span className="font-semibold text-[#2ECC71]">Keep up to 97%</span>
            <span>of your earnings with Community Leader tier</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => {
            const IconComponent = tier.icon;
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-xl border-2 ${tier.borderColor} overflow-hidden transition-all hover:scale-105 ${
                  tier.popular ? 'ring-4 ring-[#FF6B35] ring-opacity-20' : ''
                }`}
              >
                {tier.badge && (
                  <div className={`absolute top-0 right-0 bg-gradient-to-r ${tier.color} text-white px-4 py-1 rounded-bl-lg text-xs font-bold`}>
                    {tier.badge}
                  </div>
                )}

                <div className={`p-8 ${tier.popular ? 'pt-12' : 'pt-8'}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#1F2937]">{tier.name}</h3>
                      <p className="text-sm text-[#6B7280]">{tier.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-5xl font-bold text-[#1F2937]">{tier.price}</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">{tier.priceDetail}</p>
                  </div>

                  {showSelectionButtons && onSelectTier && (
                    <button
                      onClick={() => onSelectTier(tier.id as 'basic' | 'pro' | 'premium')}
                      className={`w-full px-6 py-3 ${tier.buttonColor} text-white rounded-xl transition-all font-bold text-lg shadow-lg mb-6`}
                    >
                      Choose {tier.name}
                    </button>
                  )}

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        {feature.included ? (
                          <Check className={`w-5 h-5 ${tier.textColor} flex-shrink-0 mt-0.5`} />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5"></div>
                        )}
                        <span className={`text-sm ${feature.included ? 'text-[#1F2937] font-medium' : 'text-gray-400'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {tier.popular && (
                  <div className="bg-gradient-to-r from-[#FF6B35] to-[#E5612F] p-4 text-center">
                    <p className="text-white text-sm font-semibold">Recommended for most helpers</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-[#1F2937] mb-6 text-center">Tier Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-3 font-semibold text-[#1F2937] text-sm">Feature</th>
                  <th className="text-center py-4 px-2 font-semibold text-[#1F2937] text-sm">Starter</th>
                  <th className="text-center py-4 px-2 font-semibold text-[#FF6B35] text-sm">Growth</th>
                  <th className="text-center py-4 px-2 font-semibold text-[#2ECC71] text-sm">Scale</th>
                  <th className="text-center py-4 px-2 font-semibold text-purple-700 text-sm">Leader</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Monthly Cost</td>
                  <td className="py-3 px-2 text-center font-bold text-[#1F2937] text-sm">$10<div className="text-xs text-[#2ECC71] font-normal mt-1">10-day trial</div></td>
                  <td className="py-3 px-2 text-center font-bold text-[#FF6B35] text-sm">$25<div className="text-xs text-blue-600 font-normal mt-1">$20 verified</div></td>
                  <td className="py-3 px-2 text-center font-bold text-[#2ECC71] text-sm">$50</td>
                  <td className="py-3 px-2 text-center font-bold text-purple-700 text-sm">$150</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Platform Fee</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">10%</td>
                  <td className="py-3 px-2 text-center font-semibold text-[#FF6B35] text-sm">8%</td>
                  <td className="py-3 px-2 text-center font-semibold text-[#2ECC71] text-sm">5%</td>
                  <td className="py-3 px-2 text-center font-semibold text-purple-700 text-sm">3%</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Service Categories</td>
                  <td className="py-3 px-2 text-center text-sm">1</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">3</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">5</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">8</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Monthly Cap</td>
                  <td className="py-3 px-2 text-center text-sm">$500</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">$2,500</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">$5,000</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">$15,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Waves/Month</td>
                  <td className="py-3 px-2 text-center text-sm">3</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">5</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">8</td>
                  <td className="py-3 px-2 text-center font-semibold text-sm">20</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Jamii Shop</td>
                  <td className="py-3 px-2 text-center">—</td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 text-[#FF6B35] mx-auto" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 text-[#2ECC71] mx-auto" /></td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 text-purple-700 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-[#6B7280] text-sm">Business Required</td>
                  <td className="py-3 px-2 text-center">—</td>
                  <td className="py-3 px-2 text-center">—</td>
                  <td className="py-3 px-2 text-center">—</td>
                  <td className="py-3 px-2 text-center"><Check className="w-4 h-4 text-purple-700 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-[#2ECC71] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1F2937] mb-2">Comm<span className="font-extrabold">UNITY</span> First</h4>
                <p className="text-sm text-[#6B7280]">Unlike competitors who prioritize investor profits, we're built to keep wealth circulating in local communities.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-[#2ECC71] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1F2937] mb-2">10-Day Free Trial</h4>
                <p className="text-sm text-[#6B7280]">Test JAMII risk-free for 10 days. No credit card required. See if we're the right fit for your neighborhood business.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <Check className="w-6 h-6 text-[#2ECC71] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1F2937] mb-2">Transparent Pricing</h4>
                <p className="text-sm text-[#6B7280]">What you see is what you pay. No hidden marketplace fees or surprise charges that eat into your earnings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


