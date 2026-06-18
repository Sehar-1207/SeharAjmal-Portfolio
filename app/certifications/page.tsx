"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HiZoomIn } from "react-icons/hi";
import { FaExternalLinkAlt } from "react-icons/fa"; // Imported link icon for your credentialLink
import { getCertificates } from "../service/certificateService"; 
import { Certificate } from "../admin/certificate/typeCertificate"; 

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getCertificates();
        
        if (result?.success && Array.isArray(result.data)) {
          const mappedCerts: Certificate[] = result.data.map((c: any) => ({
            id: c._id || c.id,
            title: c.title || "Untitled Certificate",
            issuer: c.issuer || "Unknown Issuer",
            // 💡 Safely extracts the new description field from database payload
            description: c.description || "", 
            image_url: c.image?.url || c.image_url || c.imageUrl || "",
            // 💡 Maps 'issueDate' from schema safely down to frontend component 'date'
            date: c.issueDate || c.date || "",
            // 💡 Captured and embedded your credential links parameter safely 
            credentialLink: c.credentialLink || ""
          }));
          setCerts(mappedCerts);
        } else {
          console.error("Error fetching certs:", result?.error);
        }
      } catch (err) {
        console.error("Unexpected failure loading certificates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const openCertModal = (certUrl: string) => {
    if (!certUrl) return;
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
        
        {/* Header Block */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Certifications & <span className="text-primary">credentials</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Click any certificate to view it full size.
          </p>
          <div className="mx-auto h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        {/* Dynamic Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[440px] rounded-3xl bg-muted/30 animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-6">
            {certs.map((cert: any) => (
              <div
                key={cert.id}
                className="group flex flex-col rounded-3xl border border-border bg-card/40 backdrop-blur-md overflow-hidden min-h-[440px] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl"
              >
                {/* Visual Thumbnail */}
                <div 
                  onClick={() => openCertModal(cert.image_url)} 
                  className="relative h-56 w-full bg-accent/5 flex items-center justify-center overflow-hidden cursor-zoom-in"
                >
                  {cert.image_url ? ( 
                    <Image
                      src={cert.image_url} 
                      alt={cert.title}
                      fill
                      unoptimized={true} 
                      sizes="(max-width: 1280px) 100vw, 33vw"
                      className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-muted-foreground/40 text-xs">No Image Available</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <HiZoomIn className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Content Core details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-accent/20 border border-accent/30 text-primary w-fit inline-block">
                      {cert.issuer}
                    </span>
                    
                    {/* Description Paragraph shows up here smoothly now */}
                    <p className="text-sm text-muted-foreground pt-1 line-clamp-3">
                      {cert.description || "No validation description provided for this credential entry."}
                    </p>
                  </div>

                  {/* Date & Credential Link Row */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30 mt-4">
                    <span>{cert.date}</span>
                    
                    {cert.credentialLink && (
                      <a 
                        href={cert.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()} // Prevents launching image modal overlay on link clicks
                      >
                        Verify <FaExternalLinkAlt className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Empty Fallback Block */}
        {!loading && certs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No certificates found in the database.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={closeCertModal}>
          <button className="absolute top-6 right-6 text-white text-3xl hover:text-primary transition-colors" onClick={closeCertModal}>&times;</button>
          <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={selectedCert} 
              alt="Certificate Full View" 
              fill 
              unoptimized={true}
              className="object-contain" 
              priority 
            />
          </div>
        </div>
      )}
    </main>
  );
}