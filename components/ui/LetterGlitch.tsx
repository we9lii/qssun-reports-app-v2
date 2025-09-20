import { useRef, useEffect, useState, useCallback } from 'react';

// تعريف أنواط الأنماط المختلفة
type GlitchTheme = 'classic' | 'matrix' | 'cyberpunk' | 'retro' | 'minimal';
type GlitchPattern = 'random' | 'wave' | 'spiral' | 'cascade' | 'ripple';
type GlitchIntensity = 'low' | 'medium' | 'high' | 'extreme';
type GlitchDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial';

interface LetterGlitchProps {
  // الخيارات الأساسية
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
  
  // الخيارات الجديدة المتقدمة
  theme?: GlitchTheme;
  pattern?: GlitchPattern;
  intensity?: GlitchIntensity;
  direction?: GlitchDirection;
  pauseOnHover?: boolean;
  responsive?: boolean;
  enableScanlines?: boolean;
  enableNoise?: boolean;
  enableMouseTracking?: boolean;
  enablePerformanceMode?: boolean;
  customFont?: string;
  fontSize?: number;
  
  // خيارات التفاعل
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
}

// قوالب الألوان للأنماط المختلفة
const THEME_COLORS = {
  classic: ['#2b4539', '#61dca3', '#61b3dc'],
  matrix: ['#00ff00', '#008000', '#00ff41', '#003300'],
  cyberpunk: ['#ff0080', '#00ffff', '#ff8000', '#8000ff'],
  retro: ['#ffff00', '#ff8000', '#ff0000', '#00ff00'],
  minimal: ['#ffffff', '#cccccc', '#999999', '#666666']
};

// قوالب الحروف للأنماط المختلفة
const THEME_CHARACTERS = {
  classic: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
  matrix: '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789',
  cyberpunk: '█▓▒░▄▀■□▪▫◆◇○●◊◈※★☆♦♠♣♥',
  retro: '▀▄█▌▐░▒▓■□▪▫◆◇○●',
  minimal: '01'
};

const LetterGlitch: React.FC<LetterGlitchProps> = ({
  // القيم الافتراضية المحسنة
  glitchColors,
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters,
  theme = 'classic',
  pattern = 'random',
  intensity = 'medium',
  direction = 'horizontal',
  pauseOnHover = false,
  responsive = true,
  enableScanlines = false,
  enableNoise = false,
  enableMouseTracking = false,
  enablePerformanceMode = false,
  customFont = 'monospace',
  fontSize = 16,
  onHover,
  onLeave,
  onClick
}) => {
  // المراجع والحالات
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<any[]>([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const offscreenContext = useRef<OffscreenCanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());
  const mousePos = useRef({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // تحديد الألوان والحروف حسب النمط
  const effectiveColors = glitchColors || THEME_COLORS[theme];
  const effectiveCharacters = characters || THEME_CHARACTERS[theme];
  const lettersAndSymbols = Array.from(effectiveCharacters);

  // تحديد حجم الخط والأبعاد حسب النمط
  const charWidth = Math.ceil(fontSize * 0.6);
  const charHeight = Math.ceil(fontSize * 1.2);

  // معاملات الكثافة
  const intensityMultipliers = {
    low: 0.02,
    medium: 0.05,
    high: 0.1,
    extreme: 0.2
  };

  // معاملات السرعة
  const speedMultipliers = {
    low: 2,
    medium: 1,
    high: 0.5,
    extreme: 0.2
  };

  const getRandomChar = useCallback(() => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  }, [lettersAndSymbols]);

  const getRandomColor = useCallback(() => {
    return effectiveColors[Math.floor(Math.random() * effectiveColors.length)];
  }, [effectiveColors]);

  // تحسين دعم OffscreenCanvas
  const supportsOffscreenCanvas = useCallback(() => {
    return typeof OffscreenCanvas !== 'undefined' && !enablePerformanceMode;
  }, [enablePerformanceMode]);

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const interpolateColor = (start: any, end: any, factor: number) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width: number, height: number) => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  // تحسين تهيئة الحروف مع أنماط مختلفة
  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    const totalLetters = columns * rows;
    
    letters.current = Array.from({ length: totalLetters }, (_, index) => {
      const x = index % columns;
      const y = Math.floor(index / columns);
      
      return {
        char: getRandomChar(),
        color: getRandomColor(),
        targetColor: getRandomColor(),
        colorProgress: 1,
        x,
        y,
        age: 0,
        intensity: Math.random(),
        phase: Math.random() * Math.PI * 2,
        lastUpdate: 0
      };
    });
  };

  // تحسين تغيير حجم الكانفاس مع دعم OffscreenCanvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = enablePerformanceMode ? 1 : (window.devicePixelRatio || 1);
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // إعداد OffscreenCanvas إذا كان مدعوماً
    if (supportsOffscreenCanvas()) {
      try {
        offscreenCanvasRef.current = new OffscreenCanvas(rect.width * dpr, rect.height * dpr);
        offscreenContext.current = offscreenCanvasRef.current.getContext('2d');
        if (offscreenContext.current) {
          offscreenContext.current.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      } catch (error) {
        console.warn('OffscreenCanvas not supported, falling back to regular canvas');
        offscreenCanvasRef.current = null;
        offscreenContext.current = null;
      }
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);

    drawLetters();
  }, [enablePerformanceMode, charWidth, charHeight, getRandomChar, getRandomColor, supportsOffscreenCanvas]);

  // رسم التأثيرات الإضافية مع تحسين الأداء
  const drawEffects = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, width: number, height: number) => {
    if (!ctx) return;

    // تأثير Scanlines
    if (enableScanlines) {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = theme === 'matrix' ? '#00ff00' : effectiveColors[0];
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }
      ctx.globalAlpha = 1;
    }

    // تأثير Noise محسن
    if (enableNoise && !enablePerformanceMode) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // تحسين الأداء بتقليل عدد البكسلات المعالجة
      for (let i = 0; i < data.length; i += 16) { // تخطي بكسلات للأداء
        if (Math.random() < 0.03) {
          const noise = Math.random() * 30;
          data[i] += noise;     // Red
          data[i + 1] += noise; // Green
          data[i + 2] += noise; // Blue
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
  };

  // رسم الحروف مع أنماط مختلفة وتحسين الأداء
  const drawLetters = useCallback(() => {
    if (letters.current.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { width, height } = canvas.getBoundingClientRect();
    
    // استخدام OffscreenCanvas إذا كان متاحاً
    const targetContext = offscreenContext.current || context.current;
    if (!targetContext) return;

    targetContext.clearRect(0, 0, width, height);
    targetContext.font = `${fontSize}px ${customFont}`;
    targetContext.textBaseline = 'top';

    // تحسين الرسم بتجميع العمليات
    const now = Date.now();
    
    letters.current.forEach((letter, index) => {
      let x = letter.x * charWidth;
      let y = letter.y * charHeight;

      // تطبيق أنماط الحركة المختلفة
      if (pattern === 'wave') {
        x += Math.sin(letter.phase + now * 0.001) * 5;
      } else if (pattern === 'spiral') {
        const centerX = width / 2;
        const centerY = height / 2;
        const angle = Math.atan2(y - centerY, x - centerX);
        x += Math.cos(angle + now * 0.001) * 2;
        y += Math.sin(angle + now * 0.001) * 2;
      } else if (pattern === 'ripple' && enableMouseTracking) {
        const dx = x - mousePos.current.x;
        const dy = y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          const ripple = Math.sin(distance * 0.1 - now * 0.005) * 3;
          x += (dx / distance) * ripple;
          y += (dy / distance) * ripple;
        }
      }

      // تطبيق تأثيرات النمط
      if (theme === 'matrix') {
        targetContext.shadowColor = letter.color;
        targetContext.shadowBlur = 10;
      } else if (theme === 'cyberpunk') {
        targetContext.shadowColor = letter.color;
        targetContext.shadowBlur = 15;
        targetContext.globalAlpha = 0.8 + Math.sin(now * 0.01 + letter.phase) * 0.2;
      }

      targetContext.fillStyle = letter.color;
      targetContext.fillText(letter.char, x, y);
      
      // إعادة تعيين التأثيرات
      targetContext.shadowBlur = 0;
      targetContext.globalAlpha = 1;
    });

    // رسم التأثيرات الإضافية
    drawEffects(targetContext, width, height);

    // نسخ من OffscreenCanvas إلى Canvas الرئيسي
    if (offscreenCanvasRef.current && context.current) {
      context.current.clearRect(0, 0, width, height);
      context.current.drawImage(offscreenCanvasRef.current, 0, 0);
    }
  }, [fontSize, customFont, charWidth, charHeight, pattern, theme, enableMouseTracking, enableScanlines, enableNoise, enablePerformanceMode, effectiveColors]);

  // تحديث الحروف مع أنماط مختلفة وتحسين الأداء
  const updateLetters = useCallback(() => {
    if (!letters.current || letters.current.length === 0 || (pauseOnHover && isHovered) || !isVisible) return;

    const now = Date.now();
    const updateCount = Math.max(1, Math.floor(letters.current.length * intensityMultipliers[intensity]));

    // تحسين الأداء بتحديث دفعي
    const indicesToUpdate = [];
    for (let i = 0; i < updateCount; i++) {
      let index;
      
      if (pattern === 'cascade') {
        // تحديث متتالي من الأعلى للأسفل
        const column = Math.floor(Math.random() * grid.current.columns);
        const row = Math.floor(Math.random() * grid.current.rows);
        index = row * grid.current.columns + column;
      } else {
        index = Math.floor(Math.random() * letters.current.length);
      }
      
      if (letters.current[index] && now - letters.current[index].lastUpdate > 16) { // تحديد معدل التحديث
        indicesToUpdate.push(index);
      }
    }

    // تطبيق التحديثات
    indicesToUpdate.forEach(index => {
      letters.current[index].char = getRandomChar();
      letters.current[index].targetColor = getRandomColor();
      letters.current[index].age++;
      letters.current[index].phase = Math.random() * Math.PI * 2;
      letters.current[index].lastUpdate = now;

      if (!smooth) {
        letters.current[index].color = letters.current[index].targetColor;
        letters.current[index].colorProgress = 1;
      } else {
        letters.current[index].colorProgress = 0;
      }
    });
  }, [pauseOnHover, isHovered, isVisible, intensity, pattern, smooth, getRandomChar, getRandomColor]);

  const handleSmoothTransitions = useCallback(() => {
    let needsRedraw = false;
    letters.current.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      drawLetters();
    }
  }, [drawLetters]);

  // تحسين حلقة الرسوم المتحركة
  const animate = useCallback(() => {
    if (isPaused || !isVisible) return;
    
    const now = Date.now();
    const effectiveSpeed = glitchSpeed * speedMultipliers[intensity];
    
    if (now - lastGlitchTime.current >= effectiveSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTime.current = now;
    }

    if (smooth) {
      handleSmoothTransitions();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isVisible, glitchSpeed, intensity, smooth, updateLetters, drawLetters, handleSmoothTransitions]);

  // معالجات الأحداث
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enableMouseTracking) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [enableMouseTracking]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.();
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onLeave?.();
  }, [onLeave]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // مراقب الرؤية لتحسين الأداء
  const handleVisibilityChange = useCallback(() => {
    setIsVisible(!document.hidden);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      if (!responsive) return;
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        resizeCanvas();
        animate();
      }, 100);
    };

    // إضافة معالجات الأحداث
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    if (enableMouseTracking) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    if (pauseOnHover || onHover || onLeave) {
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }
    if (onClick) {
      canvas.addEventListener('click', handleClick);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [glitchSpeed, smooth, responsive, enableMouseTracking, pauseOnHover, resizeCanvas, animate, handleMouseMove, handleMouseEnter, handleMouseLeave, handleClick, handleVisibilityChange]);

  // تحديد فئات CSS حسب النمط
  const getThemeClasses = () => {
    const baseClasses = "relative w-full h-full overflow-hidden";
    
    switch (theme) {
      case 'matrix':
        return `${baseClasses} bg-black`;
      case 'cyberpunk':
        return `${baseClasses} bg-gradient-to-br from-purple-900 via-black to-blue-900`;
      case 'retro':
        return `${baseClasses} bg-gradient-to-b from-yellow-900 via-orange-900 to-red-900`;
      case 'minimal':
        return `${baseClasses} bg-gray-100 dark:bg-gray-900`;
      default:
        return `${baseClasses} bg-black`;
    }
  };

  return (
    <div className={getThemeClasses()}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{ 
          imageRendering: enablePerformanceMode ? 'auto' : 'pixelated',
          filter: theme === 'retro' ? 'sepia(0.3) contrast(1.2)' : 'none'
        }}
      />
      {centerVignette && (
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50" />
      )}
      {outerVignette && (
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-30" />
      )}
      {/* مؤشر الحالة */}
      {isPaused && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
          PAUSED
        </div>
      )}
      {enablePerformanceMode && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          PERFORMANCE MODE
        </div>
      )}
    </div>
  );
};

export default LetterGlitch;