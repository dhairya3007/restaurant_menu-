import React from 'react';
import { QrCode, Download, ExternalLink } from 'lucide-react';

const QRPreview = ({ profileToken, handleDownloadQR, onClose }) => {
  const publicUrl = window.location.origin + '/' + profileToken;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
      <div className="modal d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pb-0 pt-4 px-4">
              <h5 className="modal-title fw-bold text-dark">Your Public QR Link</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            
            <div className="modal-body p-4 text-center">
              <div className="bg-light p-3 rounded-4 d-inline-block border mb-4">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="img-fluid rounded"
                  style={{ width: '180px', height: '180px' }}
                />
              </div>
              
              <p className="text-muted mb-2">Users can scan this to view your personal card.</p>
              
              <div className="px-3">
                <input 
                  type="text" 
                  className="form-control text-center fw-bold mb-4 bg-white" 
                  value={publicUrl} 
                  readOnly 
                  onClick={(e) => e.target.select()}
                  style={{ color: '#0d6efd', cursor: 'text' }}
                />
              </div>

              <div className="d-flex justify-content-center gap-2">
                <button 
                  onClick={onClose} 
                  className="btn text-white px-4 fw-bold rounded-2" 
                  style={{ backgroundColor: '#5e35b1', border: 'none' }}
                >
                  Done
                </button>
                <button 
                  onClick={handleDownloadQR} 
                  className="btn btn-outline-secondary px-4 fw-bold rounded-2"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRPreview;
