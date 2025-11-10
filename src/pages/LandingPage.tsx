import { Home, Leaf, Sparkles, ChefHat, Scissors, Dog, Truck, Baby, Shield, Clock, DollarSign, Users, ArrowRight, CheckCircle, Star, MapPin, Heart, TrendingUp, MessageCircle, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TierComparison } from '../components/TierComparison';

// Try to import supabase, but handle if it doesn't exist
let supabase: any = null;
type Service = {
  id: string;
  title: string;
  description: string;
  price_cents: number;
  category: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
};
try {
  const supabaseModule = require('../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (err) {
  // Supabase not available - that's okay, we'll use empty data
  console.log('Supabase not available, using fallback');
}

const serviceIcons: Record<string, any> = {
  'home': Home,
  'leaf': Leaf,
  'sparkles': Sparkles,
  'chef-hat': ChefHat,
  'scissors': Scissors,
  'dog': Dog,
  'truck': Truck,
  'baby': Baby,
};

type LandingPageProps = {
  onNavigate: (page: string) => void;
};

const testimonials = [
  {
    name: "Shae Washington",
    role: "Hair Braiding",
    location: "Atlanta, GA",
    image: "SW",
    text: "I was working two jobs and still struggling until I found JAMII. Started doing hair braiding for neighbors on weekends and now I'm making an extra $800/month! But the real magic? My neighbor Janet taught me to make dumplings, and I taught her daughter to braid. We're building something beautiful here - actual community. JAMII brought back what we been missing!",
    rating: 5,
    waves: true
  },
  {
    name: "Carlos Rodriguez",
    role: "Mobile Mechanic",
    location: "Phoenix, AZ",
    image: "CR",
    text: "Hermano, I was laid off from construction but JAMII kept my family afloat. Started fixing neighbors' cars in my driveway - now I'm pulling in $1,200 extra each month! But check this - the whole block looks out for each other now. Kids play together, we share tools, Janet brings me tamales when I fix her car. This is how neighborhoods used to be, man. JAMII didn't just help me pay bills - it gave us back our community.",
    rating: 5,
    waves: true
  },
  {
    name: "Tasha Hill",
    role: "Navy Spouse Childcare",
    location: "San Diego, CA",
    image: "TH",
    text: "I used JAMII to offer last-minute babysitting because deployments make everybody's schedule unpredictable. I figured I'd get maybe one booking a week. Nope. Try five. I started making $800-$1500 a month, EASY. But here's how we built community on top of the money: Every parent I babysat for started dropping off kids' clothes, snacks, and supplies they weren't using anymore. We turned my porch into a mini exchange that stays stocked like a tiny commissary. Tell me why JAMII doing more for my block than the entire base support office?",
    rating: 5,
    waves: true
  },
  {
    name: "Devin Marce",
    role: "Home Repairs",
    location: "Norfolk, VA",
    image: "DM",
    text: "My wife said I needed a hobby. Now I've got a hobby that pays like a part-time job. I'm making $1,500-$2,200 a month doing small home repairs for people within my 5-mile pocket. Leaky pipes, broken tiles, doors that will NOT close — easy money. We reinvested part of it into a neighborhood quick-fix fund. If a young enlisted couple or single parent needs something repaired but can't afford it, we cover it. No questions. No paperwork. Just neighbors acting like neighbors.",
    rating: 5,
    waves: true
  }
];

const stats = [
  { value: "2,500+", label: "Neighbors Helping", icon: Users },
  { value: "$485K+", label: "Kept in Community", icon: DollarSign },
  { value: "12,000+", label: "Jobs Completed", icon: CheckCircle },
  { value: "4.9/5", label: "Average Rating", icon: Star }
];

const featuredBadges = [
  {
    icon: "🚑",
    name: "First Responder",
    description: "Police, fire, EMT, or paramedic serving our communities"
  },
  {
    icon: "🎖️",
    name: "Military Veteran",
    description: "Served in the armed forces with honor"
  },
  {
    icon: "🪖",
    name: "Active Duty Military",
    description: "Currently serving in the armed forces"
  },
  {
    icon: "👩‍🏫",
    name: "Certified Teacher",
    description: "Licensed educator shaping future generations"
  }
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Try Supabase first (if available)
      if (supabase) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('created_at');

        if (error) {
          console.error('Error fetching services:', error);
        } else {
          setServices(data || []);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log('Supabase not available, using empty services list');
    }
    
    // Fallback: empty services list (will show placeholder content)
    setServices([]);
    setLoading(false);
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF6B35] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2ECC71] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 mb-6">
              <div className="w-2 h-2 bg-[#2ECC71] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#1F2937]">156 Neighbors Available Now</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#1F2937] mb-6 leading-tight">
              Bring Back the <span className="font-extrabold bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent">UNITY</span><br />
              <span className="text-[#FF6B35]">in Comm<span className="font-extrabold">UNITY</span></span>
            </h1>

            <p className="text-xl md:text-2xl text-[#6B7280] mb-10 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-[#FF6B35]">Jamii with your neighbors</span> for everyday tasks. Rebuild authentic neighborhood connections where everyone helps each other thrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => onNavigate('marketplace')}
                className="group px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white rounded-xl hover:shadow-2xl transition-all hover:scale-105 shadow-lg text-lg font-bold flex items-center justify-center space-x-2"
              >
                <span>Let's Jamii</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-8 py-4 bg-white text-[#FF6B35] border-2 border-[#FF6B35] rounded-xl hover:bg-orange-50 transition-all text-lg font-bold shadow-md"
              >
                Start Jamii-ing Today
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Shield className="w-5 h-5 text-[#2ECC71]" />
                <span className="font-semibold text-[#1F2937]">ID Verified</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Heart className="w-5 h-5 text-[#FF6B35]" />
                <span className="font-semibold text-[#1F2937]">Neighbor Trusted</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <DollarSign className="w-5 h-5 text-[#2ECC71]" />
                <span className="font-semibold text-[#1F2937]">Keep 90%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-orange-100 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
              Comm<span className="font-extrabold bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent">UNITY</span> Badges
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Real recognition from your neighbors for being <span className="font-semibold">authentic and excellent</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {featuredBadges.map((badge, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-100 hover:border-[#FF6B35] hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4 text-center">{badge.icon}</div>
                <h3 className="text-lg font-bold text-[#1F2937] mb-2 text-center">{badge.name}</h3>
                <p className="text-sm text-[#6B7280] text-center leading-relaxed">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
              Ready to <span className="text-[#FF6B35]">Jamii</span>?
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              From quick fixes to regular help, <span className="font-semibold">Jamii with verified neighbors</span> for any task
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => {
                const IconComponent = serviceIcons[service.icon] || Home;
                return (
                  <button
                    key={service.id}
                    onClick={() => onNavigate('marketplace')}
                    className="group bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#FF6B35] hover:shadow-xl transition-all text-left"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all shadow-md">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1F2937] mb-2">{service.name}</h3>
                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-[#2ECC71]">
                        {formatPrice(service.average_price_min)} - {formatPrice(service.average_price_max)}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
              What Your Neighbors Say
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Real stories from real people in your comm<span className="font-bold">UNITY</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 hover:border-[#FF6B35]">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#2ECC71] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
                    {testimonial.image}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2937]">{testimonial.name}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-[#FF6B35] font-semibold">{testimonial.role}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[#6B7280] flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Waves key={i} className="w-5 h-5 fill-blue-500 text-blue-500" />
                  ))}
                  <span className="ml-2 text-sm font-bold text-[#1F2937]">5.0</span>
                </div>
                <p className="text-[#6B7280] leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
              Why Neighbors <span className="text-[#FF6B35]">Jamii</span>
            </h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
              Building stronger, more connected comm<span className="font-bold">UNITY</span> <span className="font-semibold">one Jamii at a time</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#2ECC71] transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">Safe & Verified</h3>
              <p className="text-[#6B7280] mb-6 leading-relaxed">
                Every helper goes through ID verification. Optional badges for military veterans, first responders, teachers, and licensed professionals add extra trust.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">Government ID required</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">Phone verification</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">Comm<span className="font-bold">UNITY</span> ratings & reviews</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#FF6B35] transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">Help When You Need It</h3>
              <p className="text-[#6B7280] mb-6 leading-relaxed">
                See real-time availability. Find someone ready to help right now, or schedule for later. Message helpers directly to coordinate details.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">"Available Now" status</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">In-app messaging</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">5-mile local radius</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#2ECC71] transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F2937] mb-4">Keep Money Local</h3>
              <p className="text-[#6B7280] mb-6 leading-relaxed">
                Helpers keep 90% of earnings—the best rate around. Money stays in your neighborhood, strengthening the local economy and building comm<span className="font-bold">UNITY</span> wealth.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">90% to helpers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">Secure escrow protection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#2ECC71] mt-0.5 flex-shrink-0" />
                  <span className="text-[#6B7280]">Transparent pricing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide mb-6">
              OUR MISSION
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-6">
              Building Authentic Connections
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#E5612F] p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="text-6xl font-bold text-white mb-4">JAMII</div>
                  <div className="text-3xl font-semibold text-orange-100 mb-2">jah-mee-ee</div>
                  <div className="text-xl text-white font-medium">Bringing back the <span className="font-extrabold">UNITY</span> in comm<span className="font-extrabold">UNITY</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-lg">Represents the interconnectedness of neighbors</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-lg">Celebrates mutual support and collective strength</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-lg">Transform strangers into neighbors who look out for each other</p>
                  </div>
                </div>
              </div>

              <div className="p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-[#1F2937] mb-6">Our Mission</h3>
                <p className="text-xl text-[#6B7280] mb-6 leading-relaxed">
                  We're on a mission to <span className="font-bold text-[#FF6B35]">bring back the UNITY in comm<span className="font-extrabold">UNITY</span></span> by rebuilding the authentic neighborhood connections that have been lost in our modern world.
                </p>
                <p className="text-lg text-[#6B7280] mb-6 leading-relaxed">
                  Remember when neighbors knew each other's names? When you could knock on a door and ask for help? When skills were shared freely and everyone looked out for each other?
                </p>
                <p className="text-lg text-[#6B7280] mb-8 leading-relaxed">
                  That's the world we're rebuilding. One neighborhood at a time.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                    <span className="text-[#1F2937] font-semibold">Keep money circulating in your comm<span className="font-bold">UNITY</span></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                    <span className="text-[#1F2937] font-semibold">Celebrate diverse skills in our comm<span className="font-bold">UNITY</span></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                    <span className="text-[#1F2937] font-semibold">Transform strangers into neighbors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
                    <span className="text-[#1F2937] font-semibold">Build resilient, connected neighborhoods</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-[#1F2937] mb-4">
              Join the movement to bring back the <span className="bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent font-extrabold">UNITY</span> in comm<span className="font-extrabold">UNITY</span>
            </p>
            <button
              onClick={() => onNavigate('auth')}
              className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white rounded-xl hover:shadow-2xl transition-all text-lg font-bold shadow-lg hover:scale-105"
            >
              Start Building Unity Today
            </button>
          </div>
        </div>
      </section>

      <TierComparison />

      <section className="py-20 bg-gradient-to-br from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-6">
                Strengthen Your Local Comm<span className="bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] bg-clip-text text-transparent font-extrabold">UNITY</span>
              </h2>
              <p className="text-xl text-[#6B7280] mb-8 leading-relaxed">
                <span className="font-semibold text-[#FF6B35]">Jamii</span> is more than a marketplace. We're building neighborhoods where people <span className="font-semibold">Jamii with each other</span>, where skills are valued, and where money stays local.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <Users className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Build Real Connections</h4>
                    <p className="text-[#6B7280] leading-relaxed">Get to know your neighbors beyond just transactions. Many customers and helpers become friends.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Support Local Entrepreneurs</h4>
                    <p className="text-[#6B7280] leading-relaxed">Helpers are independent business owners. Your support helps them build sustainable local careers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1F2937] mb-2 text-lg">Keep It Hyperlocal</h4>
                    <p className="text-[#6B7280] leading-relaxed">All services within 5 miles. Your neighborhood, your comm<span className="font-bold">UNITY</span>, your economy.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FF6B35] to-[#E5612F] rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold">Keep 90%</div>
                  <div className="text-orange-100 text-sm">Industry-leading rate</div>
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold mb-4">Start Earning in Your Neighborhood</h3>
              <p className="text-orange-100 mb-8 text-lg leading-relaxed">
                Join thousands of neighbors earning extra income on their own schedule. Be your own boss and build your local reputation.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Quick ID verification—get started today</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Choose your services, set your own rates</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Work when you want, where you want</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Grow your reach after 10 successful jobs</span>
                </li>
              </ul>

              <button
                onClick={() => onNavigate('auth')}
                className="w-full px-6 py-4 bg-white text-[#FF6B35] rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-lg"
              >
                Become a Helper Today
              </button>

              <p className="text-center text-orange-100 text-sm mt-4">
                No subscription fees • No hidden costs • Just fair pay
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#1F2937] to-[#374151]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Neighborhood is Ready to <span className="text-[#FF6B35]">Jamii</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Whether you need help or want to help others, <span className="font-semibold">start Jamii-ing with neighbors</span> and strengthen your comm<span className="font-bold">UNITY</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('marketplace')}
              className="group px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#2ECC71] text-white rounded-xl hover:shadow-2xl transition-all text-lg font-bold shadow-lg flex items-center justify-center space-x-2 hover:scale-105"
            >
              <span>Let's Jamii</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-8 py-4 bg-white text-[#1F2937] rounded-xl hover:bg-gray-100 transition-all text-lg font-bold shadow-lg"
            >
              Start Jamii-ing Today
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-8">
            Trusted by over 2,500 neighbors • $485K+ kept in local comm<span className="font-bold">UNITY</span>
          </p>
        </div>
      </section>
    </div>
  );
}


