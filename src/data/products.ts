import { Laptop, Monitor, Cpu, HardDrive, MemoryStick, Keyboard, Mouse, Headphones, MonitorPlay, Server, Camera, Video, Computer, type LucideIcon } from "lucide-react";

export type Categoria = "Laptops" | "Monitores" | "Componentes" | "Periféricos" | "Cámaras de Acción" | "Computadoras de Escritorio";

export interface ComputerProduct {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  icon: LucideIcon;
  descripcion: string;
  imagen: string;
  imagenes?: string[];
}

export const CATEGORIAS: Categoria[] = ["Laptops", "Monitores", "Componentes", "Periféricos", "Cámaras de Acción", "Computadoras de Escritorio"];

export const COMPUTER_PRODUCTS: ComputerProduct[] = [
  // Laptops
  { id: 101, nombre: "MacBook Pro 14\" M3", categoria: "Laptops", precio: 1999, icon: Laptop, descripcion: "Chip M3, 16GB RAM, 512GB SSD", imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", imagenes: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"] },
  { id: 102, nombre: "Dell XPS 15", categoria: "Laptops", precio: 1799, icon: Laptop, descripcion: "Intel i7, 32GB RAM, RTX 4060", imagen: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", imagenes: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80"] },
  { id: 103, nombre: "Lenovo ThinkPad X1", categoria: "Laptops", precio: 1599, icon: Laptop, descripcion: "Intel i7, 16GB RAM, 1TB SSD", imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80" },
  { id: 104, nombre: "ASUS ROG Zephyrus", categoria: "Laptops", precio: 2299, icon: Laptop, descripcion: "Ryzen 9, RTX 4070, 240Hz", imagen: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80", imagenes: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80", "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80", "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&q=80"] },

  // Monitores
  { id: 201, nombre: "LG UltraGear 27\" 165Hz", categoria: "Monitores", precio: 349, icon: Monitor, descripcion: "QHD IPS, 1ms, G-Sync", imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80" },
  { id: 202, nombre: "Samsung Odyssey G9", categoria: "Monitores", precio: 1299, icon: Monitor, descripcion: "49\" curvo, 240Hz, DQHD", imagen: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&q=80" },
  { id: 203, nombre: "Dell UltraSharp 32\" 4K", categoria: "Monitores", precio: 699, icon: Monitor, descripcion: "IPS Black, USB-C 90W", imagen: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&q=80" },
  { id: 204, nombre: "ASUS ProArt 27\"", categoria: "Monitores", precio: 549, icon: Monitor, descripcion: "4K HDR, calibrado de fábrica", imagen: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80" },

  // Componentes
  { id: 301, nombre: "Intel Core i9-14900K", categoria: "Componentes", precio: 589, icon: Cpu, descripcion: "24 núcleos, 6.0 GHz boost", imagen: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800&q=80" },
  { id: 302, nombre: "AMD Ryzen 9 7950X", categoria: "Componentes", precio: 549, icon: Cpu, descripcion: "16 núcleos, AM5, 5.7 GHz", imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80" },
  { id: 303, nombre: "NVIDIA RTX 4080 SUPER", categoria: "Componentes", precio: 999, icon: MonitorPlay, descripcion: "16GB GDDR6X, DLSS 3", imagen: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80" },
  { id: 304, nombre: "Corsair Vengeance 32GB DDR5", categoria: "Componentes", precio: 149, icon: MemoryStick, descripcion: "6000 MHz, 2x16GB", imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80" },
  { id: 305, nombre: "Samsung 990 Pro 2TB NVMe", categoria: "Componentes", precio: 189, icon: HardDrive, descripcion: "PCIe 4.0, 7450 MB/s", imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80" },
  { id: 306, nombre: "Servidor Dell PowerEdge", categoria: "Componentes", precio: 3499, icon: Server, descripcion: "Xeon, 64GB ECC, RAID", imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80" },

  // Periféricos
  { id: 401, nombre: "Logitech MX Keys S", categoria: "Periféricos", precio: 119, icon: Keyboard, descripcion: "Inalámbrico, retroiluminado", imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" },
  { id: 402, nombre: "Razer DeathAdder V3", categoria: "Periféricos", precio: 89, icon: Mouse, descripcion: "30K DPI, 64g, ergonómico", imagen: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80" },
  { id: 403, nombre: "Sony WH-1000XM5", categoria: "Periféricos", precio: 399, icon: Headphones, descripcion: "Cancelación de ruido líder", imagen: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80" },
  { id: 404, nombre: "Keychron K2 Pro", categoria: "Periféricos", precio: 109, icon: Keyboard, descripcion: "Mecánico, hot-swap, QMK", imagen: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&q=80" },

  // Cámaras de Acción
  { id: 501, nombre: "GoPro HERO12 Black", categoria: "Cámaras de Acción", precio: 399, icon: Camera, descripcion: "5.3K60, HyperSmooth 6.0", imagen: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80" },
  { id: 502, nombre: "DJI Osmo Action 4", categoria: "Cámaras de Acción", precio: 349, icon: Video, descripcion: "Sensor 1/1.3\", 10-bit D-Log M", imagen: "https://images.unsplash.com/photo-1606986628253-49b0b1d2f9b3?w=800&q=80" },
  { id: 503, nombre: "Insta360 X3", categoria: "Cámaras de Acción", precio: 449, icon: Camera, descripcion: "360° 5.7K, sumergible 10m", imagen: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80" },
  { id: 504, nombre: "GoPro HERO11 Mini", categoria: "Cámaras de Acción", precio: 249, icon: Video, descripcion: "Compacta, 5.3K, HyperSmooth", imagen: "https://images.unsplash.com/photo-1625834509490-d5e2eb22da6d?w=800&q=80" },

  // Computadoras de Escritorio
  { id: 601, nombre: "Apple iMac 24\" M3", categoria: "Computadoras de Escritorio", precio: 1499, icon: Computer, descripcion: "Pantalla Retina 4.5K, M3", imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80" },
  { id: 602, nombre: "PC Gamer RTX 4070", categoria: "Computadoras de Escritorio", precio: 1899, icon: Computer, descripcion: "Ryzen 7, 32GB, 1TB NVMe", imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80" },
  { id: 603, nombre: "Mac mini M2 Pro", categoria: "Computadoras de Escritorio", precio: 1299, icon: Computer, descripcion: "M2 Pro, 16GB, 512GB SSD", imagen: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80" },
  { id: 604, nombre: "HP OMEN 45L", categoria: "Computadoras de Escritorio", precio: 2199, icon: Computer, descripcion: "Intel i9, RTX 4080, líquida", imagen: "https://images.unsplash.com/photo-1591238372338-22d1ef896590?w=800&q=80" },

  // Más Laptops
  { id: 105, nombre: "MacBook Air 15\" M2", categoria: "Laptops", precio: 1299, icon: Laptop, descripcion: "M2, 8GB RAM, 256GB SSD", imagen: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80" },
  { id: 106, nombre: "HP Spectre x360", categoria: "Laptops", precio: 1499, icon: Laptop, descripcion: "Convertible, OLED, i7", imagen: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&q=80" },
  { id: 107, nombre: "Razer Blade 16", categoria: "Laptops", precio: 2799, icon: Laptop, descripcion: "i9, RTX 4080, OLED 240Hz", imagen: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80" },

  // Más Monitores
  { id: 205, nombre: "Apple Studio Display", categoria: "Monitores", precio: 1599, icon: Monitor, descripcion: "27\" 5K Retina, P3", imagen: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80" },
  { id: 206, nombre: "BenQ PD3220U", categoria: "Monitores", precio: 1199, icon: Monitor, descripcion: "32\" 4K, Thunderbolt 3", imagen: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&q=80" },
  { id: 207, nombre: "MSI MAG 274QRF QD", categoria: "Monitores", precio: 429, icon: Monitor, descripcion: "27\" QHD 170Hz Quantum Dot", imagen: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&q=80" },

  // Más Componentes
  { id: 307, nombre: "NVIDIA RTX 4090", categoria: "Componentes", precio: 1799, icon: MonitorPlay, descripcion: "24GB GDDR6X, 4K Ultra", imagen: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?w=800&q=80" },
  { id: 308, nombre: "AMD Radeon RX 7900 XTX", categoria: "Componentes", precio: 949, icon: MonitorPlay, descripcion: "24GB GDDR6, RDNA 3", imagen: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800&q=80" },
  { id: 309, nombre: "WD Black SN850X 4TB", categoria: "Componentes", precio: 329, icon: HardDrive, descripcion: "PCIe 4.0, 7300 MB/s", imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80" },
  { id: 310, nombre: "G.Skill Trident Z5 64GB", categoria: "Componentes", precio: 289, icon: MemoryStick, descripcion: "DDR5 6400, 2x32GB RGB", imagen: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80" },

  // Más Periféricos
  { id: 405, nombre: "Logitech MX Master 3S", categoria: "Periféricos", precio: 99, icon: Mouse, descripcion: "8K DPI, silencioso, USB-C", imagen: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80" },
  { id: 406, nombre: "Bose QuietComfort Ultra", categoria: "Periféricos", precio: 429, icon: Headphones, descripcion: "ANC, audio espacial", imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
  { id: 407, nombre: "SteelSeries Apex Pro", categoria: "Periféricos", precio: 199, icon: Keyboard, descripcion: "Switches OmniPoint ajustables", imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80" },

  // Más Cámaras de Acción
  { id: 505, nombre: "DJI Action 2 Dual-Screen", categoria: "Cámaras de Acción", precio: 399, icon: Camera, descripcion: "Modular, 4K120, magnética", imagen: "https://images.unsplash.com/photo-1606986628253-49b0b1d2f9b3?w=800&q=80" },
  { id: 506, nombre: "Insta360 Ace Pro", categoria: "Cámaras de Acción", precio: 449, icon: Video, descripcion: "Sensor Leica 1/1.3\", 8K", imagen: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80" },
  { id: 507, nombre: "Sony RX0 II", categoria: "Cámaras de Acción", precio: 699, icon: Camera, descripcion: "Ultra compacta, 4K HDR", imagen: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80" },

  // Más Computadoras de Escritorio
  { id: 605, nombre: "Mac Studio M2 Max", categoria: "Computadoras de Escritorio", precio: 1999, icon: Computer, descripcion: "M2 Max, 32GB, 512GB SSD", imagen: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80" },
  { id: 606, nombre: "Alienware Aurora R16", categoria: "Computadoras de Escritorio", precio: 2499, icon: Computer, descripcion: "i9-14900F, RTX 4090", imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80" },
  { id: 607, nombre: "Lenovo Legion Tower 7i", categoria: "Computadoras de Escritorio", precio: 2099, icon: Computer, descripcion: "i9, RTX 4080, 32GB DDR5", imagen: "https://images.unsplash.com/photo-1591238372338-22d1ef896590?w=800&q=80" },
  { id: 608, nombre: "Mini PC Intel NUC 13", categoria: "Computadoras de Escritorio", precio: 899, icon: Computer, descripcion: "i7, 16GB, compacto", imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80" },
];
