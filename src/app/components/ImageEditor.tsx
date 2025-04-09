'use client';

import { useState, useRef, useEffect } from 'react';

// 创建默认图片数据（KFC风格）
const createDefaultImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  // 设置画布尺寸
  canvas.width = 500;
  canvas.height = 500;

  // 绘制KFC红色背景
  ctx.fillStyle = '#E4002B'; // KFC标准红色
  ctx.fillRect(0, 0, 500, 500);

  // 添加一些KFC风格的装饰元素
  // 顶部白色条纹
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 20, 500, 15);

  // 底部白色条纹
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 465, 500, 15);

  // 绘制文字
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  // 绘制KFC文字
  ctx.strokeText('友情提示', canvas.width / 2, 100);
  ctx.fillText('友情提示', canvas.width / 2, 100);

  ctx.font = 'bold 36px Arial';
  ctx.strokeText('请将KFC图片', canvas.width / 2, 200);
  ctx.fillText('请将KFC图片', canvas.width / 2, 200);

  ctx.strokeText('保存至public/kfc.jpg', canvas.width / 2, 250);
  ctx.fillText('保存至public/kfc.jpg', canvas.width / 2, 250);

  // 绘制KFC桶
  // 桶底部（椭圆）
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, 370, 90, 30, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  // 桶身（梯形）
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 90, 370);
  ctx.lineTo(canvas.width / 2 - 70, 280);
  ctx.lineTo(canvas.width / 2 + 70, 280);
  ctx.lineTo(canvas.width / 2 + 90, 370);
  ctx.closePath();
  ctx.fillStyle = '#E4002B'; // KFC红色
  ctx.fill();
  ctx.stroke();

  // 桶上的白色条纹
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(canvas.width / 2 - 60, 300, 120, 20);
  ctx.strokeRect(canvas.width / 2 - 60, 300, 120, 20);

  // 添加KFC标志
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('KFC', canvas.width / 2, 335);
};

const ImageEditor = () => {
  const [taxRate, setTaxRate] = useState<number>(0);
  const [baseAmount] = useState<number>(50);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(50);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 计算最终金额
  const calculateAmount = () => {
    const calculated = baseAmount * (1 + taxRate / 100);
    setCalculatedAmount(Math.round(calculated));
  };

  // 处理涨价幅度变化
  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // 确保涨价幅度不能小于0且不大于18888%
    setTaxRate(isNaN(value) ? 0 : Math.min(18888, Math.max(0, value)));
  };

  // 在图片上绘制数字
  const drawNumberOnImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // 设置文字样式 - 只绘制数字
    ctx.fillStyle = 'rgb(243, 225, 182)'; // 淡黄色

    // 根据数字位数调整字体大小
    const digitCount = calculatedAmount.toString().length;
    let baseFontSize = digitCount >= 4 ? 100 : (digitCount === 3 ? 130 : 140); // 先计算基础字体大小

    // 检测是手机端还是电脑端
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // 小于768px视为手机端

    // 如果是手机端，字体稍微小一点 (例如，缩小15%)
    const fontSize = isMobile ? Math.round(baseFontSize * 0.95) : baseFontSize;

    ctx.font = `bold ${fontSize}px Arial`; // 调整字体大小
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'; // 使文字垂直居中

    // 红色按钮区域的位置估计 (需要根据实际图片调整)
    // 假设按钮在图片底部中间位置
    const newButtonXplus = digitCount >= 4 ? 124 : (digitCount === 3 ? 118 : 105);
    const buttonX = canvas.width / 2 + newButtonXplus; // 略微向右偏移以适应"V我"后面的位置

    // const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // 小于768px视为手机端 - 已移到前面
    const buttonY = canvas.height * (isMobile ? 0.833 : 0.85); // 根据设备类型调整 Y 坐标

    // 将数字拆分为单个字符，并为每个字符添加间距
    const amountStr = calculatedAmount.toString();

    const spacechanging = digitCount >= 3 ? -0.005 : 0.07;
    const letterSpacing = fontSize * spacechanging; // 字符间距为字体大小的10%

    // 计算整个文本的总宽度（包括间距）
    const totalWidth = amountStr.length * fontSize * 0.6 + (amountStr.length - 1) * letterSpacing;

    // 起始X坐标（向左偏移总宽度的一半，以保持整体居中）
    let currentX = buttonX - totalWidth / 2;

    // 逐个绘制每个字符
    for (let i = 0; i < amountStr.length; i++) {
      const char = amountStr[i];
      // 获取当前字符的宽度
      const charWidth = ctx.measureText(char).width;

      // 绘制字符（在x位置加上字符宽度的一半，以便字符中心对准位置）
      ctx.fillText(char, currentX + charWidth / 2, buttonY);

      // 移动到下一个字符位置
      currentX += charWidth + letterSpacing;
    }

    // 在图片底部添加小白字"根据汇率实时计算"
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = 'rgb(243, 225, 182)'; // 淡黄色
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('根据汇率实时计算', canvas.width / 2, canvas.height - 10);
  };

  // 尝试加载图片
  const loadImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // 创建一个新的图片对象
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // 首先尝试加载PNG格式
    img.src = 'https://www.viwoplus.site/kfc.png';

    // 图片加载完成后绘制
    img.onload = () => {
      // 设置canvas尺寸与图片一致
      canvas.width = img.width;
      canvas.height = img.height;

      // 绘制图片
      ctx.drawImage(img, 0, 0, img.width, img.height);
      setImageLoaded(true);

      // 绘制数字
      drawNumberOnImage(canvas, ctx);
    };

    // 如果PNG加载失败，尝试JPG格式
    img.onerror = () => {
      // 尝试加载JPG格式
      const jpgImg = new Image();
      jpgImg.crossOrigin = 'anonymous';
      jpgImg.src = '/kfc.jpg';

      jpgImg.onload = () => {
        // 设置canvas尺寸与图片一致
        canvas.width = jpgImg.width;
        canvas.height = jpgImg.height;

        // 绘制图片
        ctx.drawImage(jpgImg, 0, 0, jpgImg.width, jpgImg.height);
        setImageLoaded(true);

        // 绘制数字
        drawNumberOnImage(canvas, ctx);
      };

      // 如果JPG也加载失败，使用默认图片
      jpgImg.onerror = () => {
        // 图片加载失败时创建默认图片
        setImageLoaded(false);
        createDefaultImage(canvas, ctx);

        // 在默认图片上添加数字
        // 设置文字样式 - 只绘制数字
        ctx.fillStyle = 'rgb(243, 225, 182)'; // 淡黄色
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 将数字拆分为单个字符，并为每个字符添加间距
        const amountStr = calculatedAmount.toString();
        const fontSize = 36; // 字体大小
        const letterSpacing = fontSize * 0.1; // 字符间距为字体大小的10%

        // 计算整个文本的总宽度（包括间距）
        const totalWidth = amountStr.length * fontSize * 0.6 + (amountStr.length - 1) * letterSpacing;

        // 起始X坐标（向左偏移总宽度的一半，以保持整体居中）
        const centerX = canvas.width / 2 + 15;
        let currentX = centerX - totalWidth / 2;
        const centerY = canvas.height * 0.73;

        // 逐个绘制每个字符
        for (let i = 0; i < amountStr.length; i++) {
          const char = amountStr[i];
          // 获取当前字符的宽度
          const charWidth = ctx.measureText(char).width;

          // 绘制字符（在x位置加上字符宽度的一半，以便字符中心对准位置）
          ctx.fillText(char, currentX + charWidth / 2, centerY);

          // 移动到下一个字符位置
          currentX += charWidth + letterSpacing;
        }
      };
    };
  };

  // 在图片上绘制文字
  useEffect(() => {
    const drawCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 加载图片
      loadImage(canvas, ctx);
    };

    drawCanvas();
  }, [calculatedAmount]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
      <div className="w-full p-5 bg-red-50 rounded-xl border-2 border-red-200 shadow-inner">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="taxRate" className="text-lg font-bold text-red-800">
              加价百分比 (%)
            </label>
            <div className="relative">
              <input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={handleTaxRateChange}
                min="0"
                max="18888"
                className="p-3 border-2 border-red-300 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-red-600 font-bold">%</span>
              </div>
            </div>
          </div>
          <button
            onClick={calculateAmount}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 mt-auto font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-red-700 flex-shrink-0"
          >
            计算
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg text-center shadow-md border-2 border-red-200 w-full">
        <div className="flex items-center justify-center">
          <div className="text-xl font-semibold">
            <span className="text-gray-800">计算结果: </span>
            <span className="text-red-600 font-bold">{baseAmount}</span>
            <span className="mx-2 text-gray-800">×</span>
            <span className="text-gray-800">(1 + </span>
            <span className="text-red-600 font-bold">{taxRate}%</span>
            <span className="text-gray-800">)</span>
            <span className="mx-2 text-gray-800">=</span>
            <span className="text-2xl text-red-600 font-black">{calculatedAmount}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full shadow-lg rounded-lg overflow-hidden border-4 border-red-600">
        <canvas
          ref={canvasRef}
          className="w-full object-contain"
        />
      </div>

      {!imageLoaded && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg shadow-md w-full">
          <p className="font-bold">提示</p>
          <p>未找到KFC图片，请重启以获得完整体验（也可能不行）。</p>
        </div>
      )}

      <div className="mt-4 text-center w-full">
        <button
          onClick={() => {
            if (canvasRef.current) {
              const link = document.createElement('a');
              link.download = `viwo${calculatedAmount}.png`;
              link.href = canvasRef.current.toDataURL('image/png');
              link.click();
            }
          }}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-red-700 w-full sm:w-auto"
        >
          下载图片
        </button>
      </div>
    </div>
  );
};

export default ImageEditor;
