import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height) {
  // Simple uncompressed or deflate PNG generator
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(len + 12);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC calculation
    let crc = 0xffffffff;
    for (let i = 4; i < len + 8; i++) {
      let c = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ c) & 1) {
          crc = (crc >>> 1) ^ 0xedb88320;
        } else {
          crc = crc >>> 1;
        }
        c = c >>> 1;
      }
    }
    crc = crc ^ 0xffffffff;
    buf.writeInt32BE(crc, len + 8);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate image raw scanlines: dark luxury gradient with cyan/violet center
  const rawData = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter type 0
    const ny = (y / height) * 2 - 1;
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 2 - 1;
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Deep dark futuristic background
      let r = 10, g = 14, b = 24, a = 255;

      if (dist < 0.85) {
        // Hexagon & brain glow
        const angle = Math.atan2(ny, nx);
        const ring = Math.abs(dist - 0.7);
        if (ring < 0.08) {
          // outer neon ring
          r = 56; g = 189; b = 248; // cyan
        } else if (dist < 0.5) {
          // Center core
          r = Math.floor(129 + 60 * Math.cos(angle * 3));
          g = Math.floor(140 - 40 * Math.sin(angle * 3));
          b = Math.floor(248);
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.resolve('public');
fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPng(512, 512));
console.log('[Icons] Generated 192x192 and 512x512 PNGs successfully.');
