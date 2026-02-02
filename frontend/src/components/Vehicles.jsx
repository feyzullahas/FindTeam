import React from 'react';
import { Search, Filter, MapPin, Calendar, Users, Star } from 'lucide-react';

const Vehicles = () => {
  // Sample data for demonstration
  const vehicles = [
    {
      id: 1,
      title: 'Profesyonel Takım Arıyoruz',
      type: 'team',
      location: 'İstanbul, Kadıköy',
      date: '2024-02-15',
      time: '18:00-20:00',
      playersNeeded: 2,
      skillLevel: 'Orta',
      price: '50₺/kişi',
      rating: 4.8,
      image: '/api/placeholder/400/300',
      description: 'Salı akşamları düzenli maç yapan takımımıza 2 arkadaş arıyoruz.'
    },
    {
      id: 2,
      title: 'Kaleci Arıyorum',
      type: 'player',
      location: 'Ankara, Çankaya',
      date: '2024-02-16',
      time: '19:00-21:00',
      playersNeeded: 1,
      skillLevel: 'İleri',
      price: '40₺/kişi',
      rating: 4.9,
      image: '/api/placeholder/400/300',
      description: 'Takımımıza kaleci arıyoruz. Deneyimli tercihimizdir.'
    },
    {
      id: 3,
      title: 'Amatör Maç İçin Takım Arkadaşı',
      type: 'team',
      location: 'İzmir, Bornova',
      date: '2024-02-17',
      time: '17:00-19:00',
      playersNeeded: 3,
      skillLevel: 'Başlangıç',
      price: '30₺/kişi',
      rating: 4.7,
      image: '/api/placeholder/400/300',
      description: 'Eğlenmek için oynamak isteyen arkadaşlar bekliyoruz.'
    }
  ];

  const getTypeLabel = (type) => {
    return type === 'team' ? 'Takım Arıyorum' : 'Oyuncu Arıyorum';
  };

  const getTypeColor = (type) => {
    return type === 'team' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Son İlanlar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Türkiye'nin dört bir yanından güncel takım arkadaşı ilanları
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="İlanlarda ara..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tüm Türler</option>
                <option value="team">Takım Arıyorum</option>
                <option value="player">Oyuncu Arıyorum</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tüm Şehirler</option>
                <option value="istanbul">İstanbul</option>
                <option value="ankara">Ankara</option>
                <option value="izmir">İzmir</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                <Filter size={20} />
                Filtrele
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center">
                    <Users className="text-blue-600" size={40} />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(vehicle.type)}`}>
                    {getTypeLabel(vehicle.type)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{vehicle.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {vehicle.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {vehicle.description}
                </p>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{vehicle.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{vehicle.date} • {vehicle.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      <span>{vehicle.playersNeeded} kişi needed</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{vehicle.price}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                  İlanı Görüntüle
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a 
            href="/posts"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Tüm İlanları Görüntüle
          </a>
        </div>
      </div>
    </section>
  );
};

export default Vehicles;
