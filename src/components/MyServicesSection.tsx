import { useState } from 'react';
import { Briefcase, Edit, Eye, MessageCircle, DollarSign, Plus, ToggleLeft, ToggleRight } from 'lucide-react';

type Service = {
  id: string;
  service_id: string;
  price_min: number;
  price_max: number;
  is_active: boolean;
  services: {
    name: string;
    icon: string;
  };
};

type MyServicesSectionProps = {
  services: Service[];
  onNavigate: (page: string) => void;
};

export function MyServicesSection({ services, onNavigate }: MyServicesSectionProps) {
  const [localServices, setLocalServices] = useState(services);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  const toggleServiceStatus = (serviceId: string) => {
    setLocalServices(prev =>
      prev.map(s => s.id === serviceId ? { ...s, is_active: !s.is_active } : s)
    );
  };

  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-[#2ECC71]" />
          <span>My Services</span>
        </h2>
        <button
          onClick={() => onNavigate('helper-services')}
          className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-all font-medium flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {localServices.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
          <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No services yet</p>
          <button
            onClick={() => onNavigate('helper-services')}
            className="px-6 py-3 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-all font-medium"
          >
            Create Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localServices.map((service) => (
            <div
              key={service.id}
              className={`p-5 bg-[#374151] rounded-lg border-2 transition-all ${
                service.is_active
                  ? 'border-[#2ECC71] shadow-md'
                  : 'border-gray-600 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{service.services.icon}</span>
                    <h3 className="text-lg font-semibold text-white">
                      {service.services.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <DollarSign className="w-4 h-4 text-[#2ECC71]" />
                    <span className="text-[#2ECC71] font-semibold">
                      {formatPrice(service.price_min)} - {formatPrice(service.price_max)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {service.is_active ? (
                    <ToggleRight className="w-6 h-6 text-[#2ECC71]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="bg-[#1F2937] rounded-lg p-2">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Eye className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Views</div>
                </div>
                <div className="bg-[#1F2937] rounded-lg p-2">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Inquiries</div>
                </div>
                <div className="bg-[#1F2937] rounded-lg p-2">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Briefcase className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="text-lg font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Bookings</div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('helper-services')}
                className="w-full px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E5612F] transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Service</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


