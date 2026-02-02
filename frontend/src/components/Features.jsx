import React from 'react';
import { Users, Clock, MapPin, Shield, TrendingUp, Award } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Geniş Kullanıcı Kitlesi',
      description: 'Türkiye\'nin dört bir yanından binlerce aktif kullanıcı ile anında takım arkadaşı bulun.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      title: 'Anında Bağlantı',
      description: 'İlanlarınız saniyeler içinde yayınlanır ve dakikalar içinde geri dönüş alırsınız.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      title: 'Lokasyon Bazlı',
      description: 'Bulunduğunuz bölgedeki halı sahalara yakın takım arkadaşları bulun.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Güvenilir Platform',
      description: 'Kullanıcı doğrulama ve güvenli iletişim sistemi ile güvenli ortam.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: TrendingUp,
      title: 'Hızlı Büyüme',
      description: 'Her gün yeni kullanıcılar ve ilanlarla büyüyen dinamik platform.',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Award,
      title: 'Kaliteli Hizmet',
      description: '7/24 destek ve kullanıcı memnuniyeti odaklı hizmet anlayışı.',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden FindTeam?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hızlı, güvenli ve etkili takım arkadaşı bulma deneyimi için en iyi platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <feature.icon className="text-white" size={32} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Hover Indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-b-2xl"
                style={{
                  backgroundImage: `linear-gradient(to right, ${feature.color.split(' ')[0]}, ${feature.color.split(' ')[1]})`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Hemen Takım Arkadaşı Bulun!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Binlerce kullanıcı arasında sizin için uygun takım arkadaşlarını bulun ve maçlara hazır olun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/create-post"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Ücretsiz İlan Ver
              </a>
              <a 
                href="/posts"
                className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                İlanları İncele
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
