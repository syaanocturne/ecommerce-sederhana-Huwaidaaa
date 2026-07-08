/**
 * products.js
 * Data katalog produk Mammalia Cookies.
 * Setiap produk memiliki: id, name, category, price (Rupiah), image, description, stock, badge
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Dark Cocoa Bites",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/chocolate-bites.jpeg",
    description:
      "One bites cookies renyah yang dilapisi cokelat premium dengan rasa cokelat yang nyoklat banget.",
    stock: 55,
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Kyoto Matcha Bites",
    category: "cookies",
    weight: "350gr",
    price: 55000,
    image: "images/matcha-bites.jpeg",
    description:
      "Cookies klasik yang dibalut cokelat matcha tanpa rasa pahit berlebihan, dapat meninggalkan after taste matchayang khas di setiap gigitan.",
    stock: 55,
    badge: "New",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Velvet Crinkles",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/red-velvet-cookies.jpeg",
    description:
      "Cookies dengan tekstur ringan dan renyah, terinspirasi dari klasiknya kue lidah kucing. Dilapisi dengan cokelat dan sentuhan sprinkle di atasnya.",
    stock: 55,
    badge: "",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Signature Kastangel",
    category: "cookies",
    weight: "350gr",
    price: 55000,
    image: "images/kastangel.jpeg",
    description:
      "Perpaduan butter dan keju pilihan, dipanggang hingga menghasilkan tekstur renyah yang ringan. Menghasilkan cita rasa gurih yang seimbang dengan aroma keju yang lembut di setiap gigitan.",
    stock: 55,
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Classisc Nastar",
    category: "cookies",
    weight: "350gr",
    price: 45000,
    image: "images/nastar.svg",
    description:
      "Dibuat dengan adonan buttery yang lembut dan isian selai nanas yang kaya rasa. Dipanggang hingga berwarna keemasan untuk menghasilkan nastar dengan tekstur yang ringan dan rasa yang seimbang.",
    stock: 55,
    badge: "Best Seller",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Choco Chip Cookies",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/choco-chip.svg",
    description:
      "Sebuah interpretasi klasik dari chocolate chip cookie, cocok untuk jadi teman minum teh.",
    stock: 30,
    badge: "",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Palm Sugar & Cheese",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/oatmeal-raisin.svg",
    description:
      "Perpaduan gula aren dan keju pilihan yang menciptakan cita rasa yang seimbang, dengan sentuhan karamel yang lembut dan gurih di setiap gigitan.",
    stock: 55,
    badge: "Cheesy",
    rating: 4.5,
  },
  {
    id: 8,
    name: "Butter Sogo Cookies",
    category: "cookies",
    weight: "350gr",
    price: 45000,
    image: "images/almond-crunch.svg",
    description:
      "Kue sagu dengan tekstur yang ringan dan mudah lumer di mulut. Sederhana, klasik, dan selalu nyaman untuk dinikmati kapan saja.",
    stock: 55,
    badge: "Cheesy",
    rating: 4.5,
  },
  {
    id: 9,
    name: "Hampers by Mammalia (Mix 3 Toples)",
    category: "giftbox",
    weight: "3 x 350gr",
    price: 120000,
    image: "images/gift-box-lebaran.svg",
    description:
      "Paket hampers berisi 3 toples cookies pilihan, dikemas eksklusif dengan kotak elegan. Pilihan tepat untuk hadiah hari raya dan momen spesialmu.",
    stock: 10,
    badge: "Hampers",
    rating: 5.0,
  },
  {
    id: 10,
    name: "Tote Bag",
    category: "giftbox",
    weight: "15gr",
    price: 10000,
    image: "images/sampler-pack.svg",
    description:
      "Dibuat dari bahan kanvas berkualitas untuk penggunaan sehari-hari.",
    stock: 15,
    badge: "Hampers",
    rating: 5.0,
  },
];

/** Kategori untuk keperluan filter */
const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "cookies", label: "Cookies" },
  { value: "giftbox", label: "Gift Box / Hampers" },
];

/** Helper format rupiah */
function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}
