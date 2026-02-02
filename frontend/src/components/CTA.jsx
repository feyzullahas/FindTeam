import React from 'react';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Indicators */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2 text-white/90">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8/5 Değerlendirme</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Güvenli Platform</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Anında Bağlantı</span>
          </div>
        </div>

        {/* Main Content */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Hemen Takım Arkadaşı Bulun
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Binlerce aktif kullanıcı arasında sizin için uygun takım arkadaşlarını bulun ve maçlara hazır olun. 
          Ücretsiz kaydolun ve saniyeler içinde ilanınızı yayınlayın!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a 
            href="/create-post"
            className="group inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Ücretsiz İlan Ver
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={20} />
          </a>
          <a 
            href="/posts"
            className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            İlanları Keşfet
          </a>
        </div>

        {/* Additional Info */}
        <p className="text-white/70 text-sm">
          ✓ Kredi kartı gerekmez • ✓ 5 dakikada kayıt olun • ✓ İlk ilanınız ücretsiz
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </section>
  );
};

export default CTA;
