/**
 * MINDVERSE Standalone Offline QR Code & PDF Generator Script
 * Generates pre-built, print-ready QR PNG and PDF files in qr-codes/
 */

import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

const DESTINATION_URL = process.argv[2] || 'https://mindverse.app';
const OUT_DIR = path.resolve('qr-codes');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log(`[QR Generator] Generating assets for destination: ${DESTINATION_URL}`);

  // 1. Generate High-Res PNG
  const pngPath = path.join(OUT_DIR, 'mindverse-qr.png');
  await QRCode.toFile(pngPath, DESTINATION_URL, {
    errorCorrectionLevel: 'H',
    width: 1200,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  console.log(`[QR Generator] Created PNG: ${pngPath}`);

  // 2. Generate Print-Ready A4 Poster PDF
  const qrDataUrl = await QRCode.toDataURL(DESTINATION_URL, {
    errorCorrectionLevel: 'H',
    width: 1200,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Header banner
  doc.setFillColor(10, 12, 22);
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('MINDVERSE', pageWidth / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(56, 189, 248);
  doc.text('Enter. Observe. Think. Play.', pageWidth / 2, 38, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('BRAIN & KNOWLEDGE ARCADE • 5 OFFLINE GAMES • NO LOGIN REQUIRED', pageWidth / 2, 47, { align: 'center' });

  // QR Code Frame
  const qrSize = 110;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 75;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 4, 4, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 4, 4, 'D');

  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  // Instructions
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SCAN TO PLAY INSTANTLY', pageWidth / 2, qrY + qrSize + 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('Point your smartphone camera at this code to enter the arcade.', pageWidth / 2, qrY + qrSize + 30, { align: 'center' });

  const bulletY = qrY + qrSize + 42;
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('• 100% Free & Offline-Ready', pageWidth / 2, bulletY, { align: 'center' });
  doc.text('• Telugu • English • Hindi', pageWidth / 2, bulletY + 6, { align: 'center' });
  doc.text('• Instant browser play — No App Store or download needed', pageWidth / 2, bulletY + 12, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Destination: ${DESTINATION_URL}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

  doc.setDrawColor(226, 232, 240);
  doc.line(20, pageHeight - 22, pageWidth - 20, pageHeight - 22);

  const pdfPath = path.join(OUT_DIR, 'mindverse-qr-print.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, pdfBuffer);

  console.log(`[QR Generator] Created PDF: ${pdfPath}`);
  console.log('[QR Generator] Assets generation complete.');
}

run().catch(err => {
  console.error('[QR Generator] Failed:', err);
  process.exit(1);
});
