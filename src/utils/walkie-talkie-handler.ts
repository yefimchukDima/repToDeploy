/**
 * @description Generate WAV header
 * @param {number} sampleRate Audio sample rate, example: 48000, 44100, 16000
 * @param {number} channelsCount Number of channels, example: 1, 2
 * @param {number} framesCount Number of frames
 * @param {number} bytesPerSample Number of bytes per sample
 * @returns {ArrayBuffer} Buffer of the WAV headers
 * @private
 */
function _generateWAVHeader(
  sampleRate,
  channelsCount,
  framesCount,
  bytesPerSample,
) {
  const buffer = new ArrayBuffer(44);
  const _ba = channelsCount * bytesPerSample;
  const _br = sampleRate * _ba;
  const _ds = framesCount * _ba;
  const dv = new DataView(buffer);
  let p = 0;

  const writeString = (s) => {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  };

  const writeUint32 = (d) => {
    dv.setUint32(p, d, true);
    p += 4;
  };

  const writeUint16 = (d) => {
    dv.setUint16(p, d, true);
    p += 2;
  };

  writeString('RIFF');
  writeUint32(_ds + 36);
  writeString('WAVE');
  writeString('fmt ');
  writeUint32(16);
  writeUint16(1);
  writeUint16(channelsCount);
  writeUint32(sampleRate);
  writeUint32(_br);
  writeUint16(_ba);
  writeUint16(bytesPerSample * 8);
  writeString('data');
  writeUint32(_ds);

  return buffer;
}

/**
 * @description Convert PCM to WAV
 * @param {string} pcmFilePath Path to the pcm file
 * @param {string} wavFilePath Path to the wav file
 * @public
 */
export function PCMtoWAV(base64: string) {
  const options = { sampleRate: 44100, channels: 1 };
  const _buffer = Buffer.from(base64, 'base64');
  const _header = _generateWAVHeader(
    options.sampleRate,
    options.channels,
    _buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    Uint8Array.BYTES_PER_ELEMENT * options.channels,
  );

  const wavHeader = new Uint8Array(_header);
  const wav = new Uint8Array(wavHeader.byteLength + _buffer.length);

  wav.set(wavHeader, 0);
  wav.set(new Uint8Array(_buffer), wavHeader.byteLength);

  const dataURI =
    'data:audio/wav;base64,' + Buffer.from(wav).toString('base64');

  return dataURI;
}
