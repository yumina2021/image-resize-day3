let currentImage = null;
const input = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const origSize = document.getElementById('origSize');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const keepAspect = document.getElementById('keepAspect');
const quality = document.getElementById('quality');
const qualityVal = document.getElementById('qualityVal');
const format = document.getElementById('format');
const processBtn = document.getElementById('processBtn');
const canvas = document.createElement('canvas');

input.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    preview.src = url;
    origSize.textContent = `${img.width} x ${img.height}`;
    widthInput.value = img.width;
    heightInput.value = img.height;
  };
  img.src = url;
});

quality.addEventListener('input', () => {
  qualityVal.textContent = quality.value;
});

widthInput.addEventListener('input', () => {
  if (!currentImage) return;
  if (keepAspect.checked) {
    const w = parseInt(widthInput.value) || currentImage.width;
    heightInput.value = Math.round(currentImage.height * (w / currentImage.width));
  }
});

heightInput.addEventListener('input', () => {
  if (!currentImage) return;
  if (keepAspect.checked) {
    const h = parseInt(heightInput.value) || currentImage.height;
    widthInput.value = Math.round(currentImage.width * (h / currentImage.height));
  }
});

processBtn.addEventListener('click', () => {
  if (!currentImage) {
    alert('画像を選択してください。');
    return;
  }
  const outW = parseInt(widthInput.value) || currentImage.width;
  const outH = parseInt(heightInput.value) || currentImage.height;
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, outW, outH);
  ctx.drawImage(currentImage, 0, 0, outW, outH);

  const outType = format.value;
  const q = parseFloat(quality.value);
  canvas.toBlob((blob) => {
    if (!blob) {
      alert('変換に失敗しました。');
      return;
    }
    const a = document.createElement('a');
    const ext = outType.split('/')[1] || 'jpg';
    a.href = URL.createObjectURL(blob);
    a.download = `converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 100);
  }, outType, (outType === 'image/png') ? undefined : q);
});
