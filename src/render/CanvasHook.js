/*
 * virtual-dom hook for drawing to the canvas element.
 */
class CanvasHook {
  constructor(peaks, offset, bits, color, scale, height) {
    this.peaks = peaks;
    // http://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    this.offset = offset;
    this.color = color;
    this.bits = bits;
    this.scale = scale;
    this.height = height;
  }

  static drawFrame(cc, h2, x, minPeak, maxPeak) {
    const min = Math.abs(minPeak * h2);
    const max = Math.abs(maxPeak * h2);

    // draw max
    cc.fillRect(x, 0, 1, h2 - max);
    // draw min
    cc.fillRect(x, h2 + min, 1, h2 - min);
  }

  hook(canvas, prop, prev) {
    // canvas is up to date
    if (
      prev !== undefined &&
      prev.peaks === this.peaks &&
      prev.scale === this.scale &&
      prev.height === this.height
    ) {
      return;
    }

    const scale = this.scale;
    const len = canvas.width / scale;
    const cc = canvas.getContext("2d");
    const h2 = canvas.height / scale / 2;
    const maxValue = 2 ** (this.bits - 1);

    cc.clearRect(0, 0, canvas.width, canvas.height);

    cc.save();
    cc.fillStyle = this.color;
    cc.scale(scale, scale);

    for (let i = 0; i < len; i += 1) {
      const minPeak = this.peaks[(i + this.offset) * 2] / maxValue;
      const maxPeak = this.peaks[(i + this.offset) * 2 + 1] / maxValue;
      CanvasHook.drawFrame(cc, h2, i, minPeak, maxPeak);
    }

    cc.restore();
  }
}

export default CanvasHook;
