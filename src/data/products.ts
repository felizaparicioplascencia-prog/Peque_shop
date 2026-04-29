import { Laptop, Monitor, Cpu, HardDrive, MemoryStick, Keyboard, Mouse, Headphones, MonitorPlay, Server, type LucideIcon } from "lucide-react";

export type Categoria = "Laptops" | "Monitores" | "Componentes" | "Periféricos";

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

export const CATEGORIAS: Categoria[] = ["Laptops", "Monitores", "Componentes", "Periféricos"];

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
];
