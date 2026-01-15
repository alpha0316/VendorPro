import './../App.css';
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import PrimaryButton from '../components/PrimaryButton';

interface ExtractedOrder {
  image: File;
  rawText: string;
  name: string;
  phone: string;
  product: string;
  amount: string;
  location: string;
}

interface OrderImagesProps {
  goToPreparedList: (orders: ExtractedOrder[]) => void;
  goBackToAddOrders: () => void;
}



/* ---------------- RANDOM SOFT COLOR GENERATOR ---------------- */
const getRandomSoftColor = () => {
  // Array of soft, light colors with good text contrast
  const softColors = [
    'bg-red-50',
    'bg-orange-50',
    'bg-amber-50',
    'bg-yellow-50',
    'bg-lime-50',
    'bg-green-50',
    'bg-emerald-50',
    'bg-teal-50',
    'bg-cyan-50',
    'bg-sky-50',
    'bg-blue-50',
    'bg-indigo-50',
    'bg-violet-50',
    'bg-purple-50',
    'bg-fuchsia-50',
    'bg-pink-50',
    'bg-rose-50'
  ];

  // Return a random color from the array
  return softColors[Math.floor(Math.random() * softColors.length)];
};

// Predefined product list for intelligent matching
const KNOWN_PRODUCTS = [
  'shawarma',
  'shawarmas',
  'chicken wings',
  'wings',
  'honey glazed wings',
  'glazed wings',
  'thighs',
  'chicken thighs',
  'honey glazed thighs',
  'drumsticks',
  'chicken',
  'burger',
  'fries',
  'rice',
  'jollof',
  'set',
  'set-8 pcs',
  'pieces',
  '1 set'
];

const OrderImages: React.FC<OrderImagesProps> = ({ goToPreparedList }) => {
  const [images, setImages] = useState<File[]>([]);
  const [orders, setOrders] = useState<ExtractedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [productList, setProductList] = useState<string[]>(KNOWN_PRODUCTS);

  // Generate a random color for each image on initial render
  const [imageColors] = useState<string[]>(() =>
    Array.from({ length: 20 }, getRandomSoftColor)
  );




  const isValidCustomerName = (line: string) => {
    const clean = line
      .replace(/[✓✔✅]/g, '')
      .trim();

    return (
      /^[A-Za-z ]+$/.test(clean) && // letters & spaces only
      clean.length >= 2 &&
      clean.length <= 25
    );
  };

  const cleanCustomerName = (line: string) =>
    line
      .replace(/[✓✔✅]/g, '')
      .replace(/[^A-Za-z ]/g, '') // removes emojis, numbers, symbols
      .replace(/\s+/g, ' ')
      .trim();

  /* ---------------- PARSE PRODUCT ITEMS WITH AMOUNTS ---------------- */
 const parseProductItems = (text: string): Array<{name: string, quantity: number, price?: number}> => {
  const items: Array<{name: string, quantity: number, price?: number}> = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  lines.forEach(line => {
    // Clean the line
    const cleanLine = line.replace(/[✓✔✅¥)\\]/g, '').trim();
    
    // Pattern 1: "2 Shawarmas-60.00" - quantity, name, dash, price
    const pattern1 = /^(\d+)\s+([^-]+)-(\d+(?:\.\d{2})?)$/i;
    const match1 = cleanLine.match(pattern1);
    if (match1) {
      const quantity = parseInt(match1[1]);
      const name = match1[2].trim();
      const price = parseFloat(match1[3]);
      items.push({ name, quantity, price });
      return;
    }
    
    // Pattern 2: "1 set-8 pcs-48.00" - quantity, product name (set-8 pcs), dash, price
    const pattern2 = /^(\d+)\s+([a-zA-Z\s-]+pcs?)-(\d+(?:\.\d{2})?)$/i;
    const match2 = cleanLine.match(pattern2);
    if (match2) {
      const quantity = parseInt(match2[1]);
      const name = match2[2].trim();
      const price = parseFloat(match2[3]);
      items.push({ name, quantity, price });
      return;
    }
    
    // Pattern 3: "1 set wings-48.00" - quantity, product name (set wings), dash, price
    const pattern3 = /^(\d+)\s+([a-zA-Z\s]+)-(\d+(?:\.\d{2})?)$/i;
    const match3 = cleanLine.match(pattern3);
    if (match3) {
      const quantity = parseInt(match3[1]);
      const name = match3[2].trim();
      const price = parseFloat(match3[3]);
      items.push({ name, quantity, price });
      return;
    }
    
    // Pattern 4: "Shawarmas (€60.00) | 2" - name, price in parentheses, pipe, quantity
    const pattern4 = /^([^(]+?)\s*\([^)]*(\d+(?:\.\d{2})?)[^)]*\)\s*\|\s*(\d+)/i;
    const match4 = cleanLine.match(pattern4);
    if (match4) {
      const name = match4[1].trim();
      const price = parseFloat(match4[2]);
      const quantity = parseInt(match4[3]);
      items.push({ name, quantity, price });
      return;
    }
    
    // Pattern 5: "Set 8 Pcs (€48.00) | 1" 
    const pattern5 = /^([^|]+?)\s*\|\s*(\d+)/i;
    const match5 = cleanLine.match(pattern5);
    if (match5) {
      const namePart = match5[1].trim();
      const quantity = parseInt(match5[2]);
      
      // Extract price from parentheses if present
      const priceMatch = namePart.match(/\([^)]*(\d+(?:\.\d{2})?)[^)]*\)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : undefined;
      
      // Clean name
      const name = namePart.replace(/\([^)]*\)/g, '').trim();
      
      items.push({ name, quantity, price });
      return;
    }
    
    // Pattern 6: "Shawarma,honey glazed wings and thighs-78.00" - multiple items, single total price
    if (cleanLine.includes(',') && cleanLine.includes('-')) {
      const [itemsPart, pricePart] = cleanLine.split('-');
      const totalPrice = parseFloat(pricePart);
      const itemNames = itemsPart.split(',').map(item => item.trim());
      
      if (itemNames.length > 0 && !isNaN(totalPrice)) {
        // Add each item WITHOUT individual price (dash will be shown)
        itemNames.forEach(itemName => {
          items.push({ 
            name: itemName, 
            quantity: 1, 
            // NO price here - will show dash
          });
        });
      }
      return;
    }
    
    // Pattern 7: "Shawarma-30.00" - single item with price, quantity 1
    const pattern7 = /^([a-zA-Z\s]+)-(\d+(?:\.\d{2})?)$/i;
    const match7 = cleanLine.match(pattern7);
    if (match7 && !cleanLine.match(/^\d/)) {
      const name = match7[1].trim();
      const price = parseFloat(match7[2]);
      items.push({ name, quantity: 1, price });
      return;
    }
    
    // Fallback: Check for known product patterns
    if (cleanLine && 
        !cleanLine.includes('|') && 
        !cleanLine.includes('GHC') && 
        !cleanLine.match(/0\d{9}/) &&
        !cleanLine.match(/0\d{2}\s?\d{3}\s?\d{4}/) &&
        cleanLine.length > 2 &&
        !cleanLine.toLowerCase().includes('orders') &&
        !cleanLine.toLowerCase().includes('order history') &&
        !cleanLine.toLowerCase().includes('your riders') &&
        !cleanLine.toLowerCase().includes('analytics')) {
      
      // Check if it has a quantity at the beginning
      const quantityMatch = cleanLine.match(/^(\d+)\s+(.+)$/);
      if (quantityMatch) {
        const quantity = parseInt(quantityMatch[1]);
        const rest = quantityMatch[2].trim();
        
        // Check if rest has a price
        const priceMatch = rest.match(/-(\d+(?:\.\d{2})?)$/);
        if (priceMatch) {
          const name = rest.replace(/-(\d+(?:\.\d{2})?)$/, '').trim();
          const price = parseFloat(priceMatch[1]);
          items.push({ name, quantity, price });
        } else {
          items.push({ name: rest, quantity });
        }
      }
    }
  });
  
  return items;
};


  /* ---------------- CLEAN PRODUCT NAME ---------------- */
  const cleanProductName = (name: string): string => {
  // Clean but keep hyphens for things like "set-8 pcs"
  return name
    .replace(/[✓✔✅¥)\\]/g, '')
    .replace(/\([^)]*\)/g, '')  // Remove everything in parentheses
    .replace(/[€₵]/g, '')
    .replace(/\|\s*\d+$/g, '')  // Remove pipe and quantity at end
    .replace(/\s+/g, ' ')  // Normalize spaces
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // Keep "pcs" as lowercase
      if (word === 'pcs' || word === 'pc') return word;
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};



  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------------- EXTRACT ALL AMOUNTS FROM TEXT ---------------- */
  const extractAllAmounts = (text: string): { amounts: number[], rawAmounts: string[] } => {
    // Match various amount formats including decimal numbers
    const amountPatterns = [
      /GHC\s*(\d+(?:\.\d{2})?)/gi,  // GHC 354.00
      /€(\d+(?:\.\d{2})?)/gi,       // €60.00
      /-(\d+(?:\.\d{2})?)(?!\d)/g,  // -60.00 (not followed by digit)
      /\b(\d{1,3}(?:\.\d{2})?)\s*(?:gh|cedi|ghs)?\b/gi, // 60.00 gh
    ];

    const allAmounts: number[] = [];
    const rawAmounts: string[] = [];

    // Try each pattern
    for (const pattern of amountPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const amountStr = match[1] || match[0];
        // Clean the amount string
        const cleanAmount = amountStr.replace(/[^\d.]/g, '');
        if (cleanAmount) {
          const amountNum = parseFloat(cleanAmount);
          // Only add reasonable amounts (between 1 and 1000)
          if (!isNaN(amountNum) && amountNum >= 1 && amountNum <= 1000) {
            // Check if this is likely a phone number part
            const context = text.substring(Math.max(0, match.index - 5), Math.min(text.length, match.index + 10));
            if (!context.match(/0\d{9}/) && !context.match(/0\d{2}\s?\d{3}\s?\d{4}/)) {
              allAmounts.push(amountNum);
              rawAmounts.push(cleanAmount);
            }
          }
        }
      }
    }

    return { amounts: allAmounts, rawAmounts };
  };

  /* ---------------- EXTRACT AND SUM ALL AMOUNTS ---------------- */
  const extractAndSumAmounts = (text: string): string => {
    // First try to find GHC total
    const ghaMatch = text.match(/GHC\s*(\d+(?:\.\d{2})?)/i);
    if (ghaMatch) {
      return ghaMatch[1];
    }

    // Fallback: sum all amounts
    const { amounts } = extractAllAmounts(text);

    if (amounts.length === 0) return '';

    // Sum all amounts
    const total = amounts.reduce((sum, amount) => sum + amount, 0);

    // Format to 2 decimal places
    return total.toFixed(2);
  };

  /* ---------------- PARSE SINGLE ORDER ---------------- */
const parseSingleOrder = (text: string): Omit<ExtractedOrder, 'image' | 'rawText'> => {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  // Extract name using your existing logic
  let name = '';
  for (const rawLine of lines) {
    const cleanedName = cleanCustomerName(rawLine);

    if (
      isValidCustomerName(cleanedName) &&
      !rawLine.match(/0\d{2}\s?\d{3}\s?\d{4}/) &&
      !rawLine.match(/0\d{9}/) &&
      !rawLine.match(/\d{1,3}\.\d{2}/) &&
      !rawLine.toLowerCase().includes('pick') &&
      !rawLine.toLowerCase().includes('brunei') &&
      !rawLine.toLowerCase().includes('complex')
    ) {
      name = cleanedName;
      break;
    }
  }

  // Extract phone number
  const phoneMatch = text.match(/(0\d{2}\s?\d{3}\s?\d{4}|0\d{9})/);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, '') : '';

  // Extract location
  let location = '';
  if (text.toLowerCase().includes('pick-up') || text.toLowerCase().includes('pick up')) {
    location = 'Pick-up';
  } else if (text.toLowerCase().includes('brunei') || text.toLowerCase().includes('complex')) {
    location = 'Brunei Complex';
  }

  // Parse order items with amounts
  const orderItems = parseProductItems(text);
  
  // Format product string with quantities AND prices (only if price exists)
  let product = '';
  if (orderItems.length > 0) {
    product = orderItems.map(item => {
      const cleanedName = cleanProductName(item.name);
      if (item.price) {
        return `${item.quantity} ${cleanedName} (₵${item.price.toFixed(2)})`;
      }
      return `${item.quantity} ${cleanedName}`;
    }).join(', ');
  }

  // Calculate total amount
  let totalAmount = '';
  
  // For Kelvin's case: we need to extract the total from the text
  // Check if text has a total price pattern
  const totalMatch = text.match(/-(\d+(?:\.\d{2})?)$/);
  if (totalMatch) {
    totalAmount = totalMatch[1];
  } 
  // Otherwise sum individual item amounts
  else {
    const individualAmounts = orderItems.filter(item => item.price).map(item => item.price!);
    if (individualAmounts.length > 0) {
      const total = individualAmounts.reduce((sum, amount) => sum + amount, 0);
      totalAmount = total.toFixed(2);
    } 
    // Fallback: extract GHC amount from text
    else {
      totalAmount = extractAndSumAmounts(text);
    }
  }

  return { 
    name: name || 'Unknown', 
    phone: phone || '', 
    product: product || '', 
    amount: totalAmount || '', 
    location: location || '' 
  };
};


  /* ---------------- SPLIT TEXT INTO MULTIPLE ORDERS ---------------- */
  const splitIntoOrders = (text: string): string[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const orderBlocks: string[] = [];
    let currentBlock: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

      // Check if this looks like a name
      const looksLikeName =
        line.length < 30 &&
        !line.match(/0\d{2}\s?\d{3}\s?\d{4}/) &&
        !line.match(/0\d{9}/) &&
        !line.match(/\d{1,3}\.\d{2}/) &&
        line.replace(/[✓✔]/g, '').trim().length > 0;

      const nextIsPhone = /0\d{2}\s?\d{3}\s?\d{4}|0\d{9}/.test(nextLine);

      // If this is a new order start and we have accumulated content
      if (looksLikeName && nextIsPhone && currentBlock.length > 0) {
        // Save the previous order
        orderBlocks.push(currentBlock.join('\n'));
        // Start new order with current line
        currentBlock = [line];
      } else {
        // Continue accumulating lines for current order
        currentBlock.push(line);
      }
    }

    // Add the last order block
    if (currentBlock.length > 0) {
      orderBlocks.push(currentBlock.join('\n'));
    }

    // Filter out blocks that don't have phone numbers
    return orderBlocks.filter(block =>
      block.trim().length > 10 && /0\d{2}\s?\d{3}\s?\d{4}|0\d{9}/.test(block)
    );
  };

  /* ---------------- OCR + PARSE MULTIPLE ORDERS ---------------- */
  const extractFromImage = async (file: File): Promise<ExtractedOrder[]> => {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: info => {
        if (info.status === 'recognizing text') {
          console.log(`Processing: ${Math.round(info.progress * 100)}%`);
        }
      }
    });

    const rawText = result.data.text;
    console.log('Raw OCR Text:', rawText);

    // Split into individual orders
    const orderTexts = splitIntoOrders(rawText);
    console.log('Split Orders:', orderTexts.length);

    // If no clear split found, treat as single order
    if (orderTexts.length === 0) {
      const parsed = parseSingleOrder(rawText);
      return [{
        image: file,
        rawText,
        ...parsed
      }];
    }

    // Parse each order
    return orderTexts.map(orderText => {
      const parsed = parseSingleOrder(orderText);
      return {
        image: file,
        rawText: orderText,
        ...parsed
      };
    });
  };

  /* ---------------- AUTO PROCESS IMAGES ---------------- */
  useEffect(() => {
    if (images.length === 0) {
      setOrders([]);
      return;
    }

    const process = async () => {
      setLoading(true);
      setProgress({ current: 0, total: images.length });
      const extracted: ExtractedOrder[] = [];

      for (let i = 0; i < images.length; i++) {
        setProgress({ current: i + 1, total: images.length });
        const ordersFromImage = await extractFromImage(images[i]);
        extracted.push(...ordersFromImage);
      }

      setOrders(extracted);
      setLoading(false);
      setProgress({ current: 0, total: 0 });

      console.log('Extracted Orders:', extracted);
    };

    process();
  }, [images]);

  /* ---------------- NAVIGATE WITH DATA ---------------- */
  const handlePrepareOrderList = () => {
    goToPreparedList(orders);
  };

  return (
    <main className="flex w-[1132px] flex-col gap-10 mx-auto mt-8">
      {/* HEADER with random soft background */}
      <div className={`flex items-center justify-between p-4 rounded-lg `}>
        <p className="text-lg font-bold text-black">
          Upload Orders
          <span className="text-black/70 font-normal"> ({orders.length} orders from {images.length} {images.length === 1 ? 'image' : 'images'})</span>
        </p>

        <div className="w-48">
          <PrimaryButton
            title="Prepare Order List"
            onClick={handlePrepareOrderList}
            disabled={orders.length === 0 || loading}
          />
        </div>
      </div>


      {/* IMAGE GRID */}
      <section className="grid grid-cols-6 gap-4">
        {/* UPLOAD BOX with random soft background */}
        <label className={`flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${getRandomSoftColor()} border-gray-300 hover:border-gray-400`}>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <svg className="w-8 h-8 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-xs text-gray-700">+ Upload Image</span>
        </label>

        {/* PREVIEWS with random soft backgrounds */}
        {images.map((file, index) => (
          <div key={index} className="relative w-40 h-40 group">
            <div className={`absolute inset-0 rounded-xl ${imageColors[index % imageColors.length]} opacity-50 group-hover:opacity-30 transition-opacity`}></div>
            <img
              src={URL.createObjectURL(file)}
              alt={`Order ${index + 1}`}
              className="relative w-full h-full object-cover rounded-xl border shadow-sm group-hover:shadow-lg transition-all duration-300"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:scale-110"
              aria-label="Remove image"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Order count badge with matching background */}
            <div className={`absolute bottom-2 left-2 ${imageColors[index % imageColors.length]} text-black text-xs px-2 py-1 rounded-full shadow-sm`}>
              {orders.filter(o => o.image === file).length} orders
            </div>
          </div>
        ))}
      </section>



    </main>
  );
};

export default OrderImages;