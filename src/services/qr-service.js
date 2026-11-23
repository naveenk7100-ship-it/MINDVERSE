/**
 * MINDVERSE Permanent QR Code & Print Generator
 * High-resolution QR code generator with PDF and PNG export.
 */

import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { CONFIG } from '../config.js';
import { db } from './db.js';

export class QRService {
  static async getDestinationUrl() {
    const saved = await db.getSetting(CONFIG.STORAGE_KEYS.DESTINATION_URL);
    return saved || CONFIG.DEFAULT_DESTINATION_URL;
  }

  static async setDestinationUrl(url) {
    if (!url || typeof url !== 'string') return false;
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    await db.setSetting(CONFIG.STORAGE_KEYS.DESTINATION_URL, cleanUrl);
    return cleanUrl;
  }

  /**
   * Generates a high-res PNG Data URL of the QR code
   */
  static async generateQrDataUrl(destinationUrl, size = 1024) {
    const url = destinationUrl || await this.getDestinationUrl();
    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1.0,
      margin: 4,
      width: size,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };
    return await QRCode.toDataURL(url, options);
  }

  /**
   * Generates SVG string of the QR code
   */
  static async generateQrSvg(destinationUrl) {
    const url = destinationUrl || await this.getDestinationUrl();
    return await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  }

  /**
   * Triggers download of high-resolution PNG
   */
  static async downloadQrPng(destinationUrl, filename = 'MINDVERSE-Permanent-QR.png') {
    const dataUrl = await this.generateQrDataUrl(destinationUrl, 1200);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  /**
   * Generates and triggers download of a print-ready A4 PDF
   */
  static async downloadQrPdf(destinationUrl, filename = 'MINDVERSE-Print-Poster-A4.pdf') {
    const url = destinationUrl || await this.getDestinationUrl();
    const qrDataUrl = await this.generateQrDataUrl(url, 1200);

    // Create A4 PDF (210mm x 297mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // Background luxury styling
    doc.setFillColor(10, 12, 20); // Deep luxury dark header
    doc.rect(0, 0, pageWidth, 55, 'F');

    // Title & Branding
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.text('MINDVERSE', pageWidth / 2, 26, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(56, 189, 248); // Cyan accent
    doc.text('Enter. Observe. Think. Play.', pageWidth / 2, 38, { align: 'center' });

    // Sub-banner
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('BRAIN & KNOWLEDGE ARCADE • 5 OFFLINE GAMES • NO LOGIN REQUIRED', pageWidth / 2, 47, { align: 'center' });

    // Central QR Code Container
    const qrSize = 110; // 110mm x 110mm high res
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = 75;

    // QR Border Card
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 4, 4, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 4, 4, 'D');

    // Insert QR Code
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // Call to action
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('SCAN TO PLAY INSTANTLY', pageWidth / 2, qrY + qrSize + 22, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text('Open your camera, point at this QR code, and tap to begin.', pageWidth / 2, qrY + qrSize + 30, { align: 'center' });

    // Highlights bullets
    const bulletY = qrY + qrSize + 42;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('• 100% Free & Offline-Ready', pageWidth / 2, bulletY, { align: 'center' });
    doc.text('• Telugu • English • Hindi', pageWidth / 2, bulletY + 6, { align: 'center' });
    doc.text('• Works on all Android & iOS devices', pageWidth / 2, bulletY + 12, { align: 'center' });

    // Destination URL display for verification
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Destination: ${url}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

    // Footer rule
    doc.setDrawColor(226, 232, 240);
    doc.line(20, pageHeight - 22, pageWidth - 20, pageHeight - 22);

    doc.save(filename);
    return true;
  }
}
