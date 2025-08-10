import React from 'react';
import { MapPin, Star, DollarSign, Phone, Globe, Clock } from 'lucide-react';

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: number;
  photoUrl?: string;
  distance?: number;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  types: string[];
}

interface PlacesSectionProps {
  title: string;
  places: PlaceResult[];
  loading: boolean;
  error: string;
  icon: React.ReactNode;
}

const PlacesSection: React.FC<PlacesSectionProps> = ({
  title,
  places,
  loading,
  error,
  icon
}) => {
  const getPriceDisplay = (priceLevel?: number) => {
    if (!priceLevel) return null;
    return '₹'.repeat(priceLevel);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 slide-up">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 slide-up">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="bg-red-500/15 border border-red-400/30 rounded-xl p-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 slide-up hover-lift">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-white/70 text-sm">({places.length})</span>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {places.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-white/70">No {title.toLowerCase()} found nearby</p>
          </div>
        ) : (
          places.map((place) => (
            <div
              key={place.id}
              className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 hover-lift"
            >
              <div className="flex items-start gap-4">
                {place.photoUrl && (
                  <img
                    src={place.photoUrl}
                    alt={place.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg mb-1 truncate">
                    {place.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-white/70 flex-shrink-0" />
                    <p className="text-white/85 text-sm truncate">{place.address}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{place.rating}</span>
                      </div>
                    )}
                    
                    {place.priceLevel && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-400" />
                        <span className="text-white font-medium">
                          {getPriceDisplay(place.priceLevel)}
                        </span>
                      </div>
                    )}

                    {place.distance && (
                      <div className="text-white/70">
                        {formatDistance(place.distance)}
                      </div>
                    )}
                  </div>

                  {(place.phoneNumber || place.website) && (
                    <div className="flex items-center gap-3 mt-2">
                      {place.phoneNumber && (
                        <a
                          href={`tel:${place.phoneNumber}`}
                          className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs"
                        >
                          <Phone size={12} />
                          Call
                        </a>
                      )}
                      
                      {place.website && (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs"
                        >
                          <Globe size={12} />
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlacesSection;