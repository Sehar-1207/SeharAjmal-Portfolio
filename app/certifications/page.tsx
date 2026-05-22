"use client";
import React, { useState } from "react";
import Image from "next/image";
import { HiZoomIn } from "react-icons/hi";
import certificates from "../../public/certs/certificates.json";

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const openCertModal = (certUrl: string) => {
    setSelectedCert(certUrl);
    if (typeof window !== 'undefined') document.body.style.overflow = "hidden";
  };

  const closeCertModal = () => {
    setSelectedCert(null);
    if (typeof window !== 'undefined') document.body.style.overflow = "auto";
  };

  return (
    <main className="grid-bg min-h-screen px-6 py-16 sm:px-12 md:px-24 flex flex-col items-center">
      <div className="mx-auto max-w-7xl w-full space-y-12">
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Certifications & <span className="text-primary">credentials</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Click any certificate to view it full size.
          </p>
          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col rounded-3xl border border-border bg-card backdrop-blur-md overflow-hidden min-h-[420px] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl"
            >
              <div 
                onClick={() => openCertModal(cert.imageUrl)}
                className="relative h-55 w-full bg-accent/5 flex items-center justify-center overflow-hidden cursor-zoom-in"
              >
                <Image
                  src={cert.imageUrl} 
                  alt={cert.title}
                  fill
                  className="object-fit transform transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <HiZoomIn className="h-10 w-10 text-white" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-accent/20 border border-accent/30 text-primary w-fit inline-block">
                    {cert.issuer}
                  </span>
                  <p className="text-sm text-muted-foreground pt-2 line-clamp-3">
                    {cert.desc}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground pt-4 border-t border-border/30 mt-4">
                  {cert.issueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={closeCertModal}
        >
          <button className="absolute top-6 right-6 text-white text-3xl font-light hover:text-primary transition-colors z-50">
            &times;
          </button>
          <div 
            className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedCert} 
              alt="Fullscreen certificate"
              fill
              className="object-contain"
              sizes="80vw"
              priority
            />
          </div>
        </div>
      )}
    </main>
  );
}