import { Laptop, Monitor, Cpu, HardDrive, MemoryStick, Keyboard, Mouse, Headphones, Gpu, Server, type LucideIcon } from "lucide-react";

export type Categoria = "Laptops" | "Monitores" | "Componentes" | "Periféricos";

export interface ComputerProduct {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  icon: LucideIcon;
  descripcion: string;
}

export const CATEGORIAS: Categoria[] = ["Laptops", "Monitores", "Componentes", "Periféricos"];

export const COMPUTER_PRODUCTS: ComputerProduct[] = [
  // Laptops
  { id: 101, nombre: "MacBook Pro 14\" M3", categoria: "Laptops", precio: 1999, icon: Laptop, descripcion: "Chip M3, 16GB RAM, 512GB SSD" },
  { id: 102, nombre: "Dell XPS 15", categoria: "Laptops", precio: 1799, icon: Laptop, descripcion: "Intel i7, 32GB RAM, RTX 4060" },
  { id: 103, nombre: "Lenovo ThinkPad X1", categoria: "Laptops", precio: 1599, icon: Laptop, descripcion: "Intel i7, 16GB RAM, 1TB SSD" },
  { id: 104, nombre: "ASUS ROG Zephyrus", categoria: "Laptops", precio: 2299, icon: Laptop, descripcion: "Ryzen 9, RTX 4070, 240Hz" },

  // Monitores
  { id: 201, nombre: "LG UltraGear 27\" 165Hz", categoria: "Monitores", precio: 349, icon: Monitor, descripcion: "QHD IPS, 1ms, G-Sync" },
  { id: 202, nombre: "Samsung Odyssey G9", categoria: "Monitores", precio: 1299, icon: Monitor, descripcion: "49\" curvo, 240Hz, DQHD" },
  { id: 203, nombre: "Dell UltraSharp 32\" 4K", categoria: "Monitores", precio: 699, icon: Monitor, descripcion: "IPS Black, USB-C 90W" },
  { id: 204, nombre: "ASUS ProArt 27\"", categoria: "Monitores", precio: 549, icon: Monitor, descripcion: "4K HDR, calibrado de fábrica" },

  // Componentes
  { id: 301, nombre: "Intel Core i9-14900K", categoria: "Componentes", precio: 589, icon: Cpu, descripcion: "24 núcleos, 6.0 GHz boost" },
  { id: 302, nombre: "AMD Ryzen 9 7950X", categoria: "Componentes", precio: 549, icon: Cpu, descripcion: "16 núcleos, AM5, 5.7 GHz" },
  { id: 303, nombre: "NVIDIA RTX 4080 SUPER", categoria: "Componentes", precio: 999, icon: Gpu, descripcion: "16GB GDDR6X, DLSS 3" },
  { id: 304, nombre: "Corsair Vengeance 32GB DDR5", categoria: "Componentes", precio: 149, icon: MemoryStick, descripcion: "6000 MHz, 2x16GB" },
  { id: 305, nombre: "Samsung 990 Pro 2TB NVMe", categoria: "Componentes", precio: 189, icon: HardDrive, descripcion: "PCIe 4.0, 7450 MB/s" },
  { id: 306, nombre: "Servidor Dell PowerEdge", categoria: "Componentes", precio: 3499, icon: Server, descripcion: "Xeon, 64GB ECC, RAID" },

  // Periféricos
  { id: 401, nombre: "Logitech MX Keys S", categoria: "Periféricos", precio: 119, icon: Keyboard, descripcion: "Inalámbrico, retroiluminado" },
  { id: 402, nombre: "Razer DeathAdder V3", categoria: "Periféricos", precio: 89, icon: Mouse, descripcion: "30K DPI, 64g, ergonómico" },
  { id: 403, nombre: "Sony WH-1000XM5", categoria: "Periféricos", precio: 399, icon: Headphones, descripcion: "Cancelación de ruido líder" },
  { id: 404, nombre: "Keychron K2 Pro", categoria: "Periféricos", precio: 109, icon: Keyboard, descripcion: "Mecánico, hot-swap, QMK" },
];
