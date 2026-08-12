export interface JournalInlineImage {
  /** Insert the image AFTER this paragraph index (0-based). */
  after: number;
  src: string;
  alt: string;
  caption?: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  image: string;
  imageAlt: string;
  /** Optional override for small square card thumbnails (About page strip). */
  cardImage?: string;
  category: string;
  date: string; // ISO 8601: YYYY-MM-DD
  author: string;
  inlineImages?: JournalInlineImage[];
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const JOURNAL: JournalArticle[] = [
  {
    slug: 'making-of-credenza',
    title: 'The Making of the Lusitano Credenza',
    subtitle: 'From sketch to finished piece: how a credenza becomes architecture.',
    excerpt: 'Every piece in the Lusitano Collection begins as a line on paper. Here is the story of how the Credenza evolved from a personal project into a defining piece of the collection.',
    content: [
      'The Credenza was not designed for a client or a gallery. It was designed for a living room, my own. After fifteen years in luxury fashion, working with digital tools and global supply chains, I wanted to make something I could hold in my hands. Something built to outlast the season it was made in.',
      'I began with oak. Not because it is the easiest wood to work with, but because it is honest. It has grain that tells a story, weight that gives presence, and a surface that ages well. I paired it with black satin steel, a material that brings precision and sharpness to the warmth of the wood. The contrast between the two became the language of the collection.',
      'The dimensions of the Credenza were determined by the room it was built for. A long wall, a need for storage, a desire for something that felt like furniture but read like architecture. The proportions, 276 cm wide, 86.5 cm tall, 52 cm deep, were chosen to anchor the space without overwhelming it.',
      'Once the structure was resolved, I added the details that mattered for daily life: two different-size drawers, a dropdown-door cabinet, a sliding door compartment, open shelves, wireless charging built into the surface, and cable management integrated into the frame. These are not afterthoughts. They are the reason the piece works as well as it looks.',
      'Every credenza is made to order in my workshop. Each one takes weeks: the joinery, the finishing, the assembly. There is no production line and no warehouse of pre-built stock. Just a bench, a set of tools, and the same care that went into the first one.',
      'The Credenza started as furniture for a single room. It became the foundation of a collection and a studio. That is what happens when you make fewer, make better, and make personal.',
    ],
    image: '/images/products/credenza/credenza-01.webp',
    imageAlt: 'Lusitano Credenza in solid oak and black steel',
    cardImage: '/images/journal/credenza-assembly.webp',
    category: 'Craft',
    date: '2026-08-12',
    author: 'Rui Silva',
    inlineImages: [
      {
        after: 1,
        src: '/images/journal/credenza-oak-stock.webp',
        alt: 'Rough white oak planks stacked in the workshop, ready for selection',
        caption: 'Rough oak stock, acclimatising in the workshop before milling.',
      },
      {
        after: 3,
        src: '/images/journal/credenza-steel-frame.webp',
        alt: 'The black satin steel frame of the Credenza on the workshop floor',
        caption: 'The black satin steel frame, fabricated and dry-fitted before assembly.',
      },
    ],
  },
  {
    slug: 'why-white-oak',
    title: 'Why White Oak? Choosing Materials That Age Well',
    subtitle: 'On building a collection around a single, enduring wood.',
    excerpt: 'Oak is not the cheapest or the most exclusive wood. It is the most honest. Here is why it became the spine of the Lusitano Collection.',
    content: [
      'When I started designing furniture, I tested many materials. Walnut, cherry, ash, maple, European oak, American white oak. Each has its own character, its own weight, its own way of taking light. But one kept returning to my hands: white oak.',
      'White oak (Quercus alba) is dense, durable, and naturally resistant to moisture. Its grain is pronounced but not aggressive, reading as texture rather than pattern. It takes a clear satin varnish well, allowing the wood to warm over time without yellowing. In ten years, a white oak piece will look richer than the day it was made.',
      'The Lusitano Collection uses solid white oak throughout. Not veneer, not engineered wood. Solid stock, joined by hand, finished with multiple passes of varnish sanded between coats. The result is a surface that feels the way furniture should: substantial, warm, alive.',
      'I chose white oak over walnut because walnut, beautiful as it is, darkens until the grain disappears. I chose it over ash because ash can feel busy, its grain competing with the form. White oak has the restraint to support a design without shouting.',
      'Sustainability mattered too. White oak grows across the Northern Hemisphere and is responsibly harvested. The Studio works with suppliers who practice selective cutting and replanting, and we do not stockpile raw material we will not use.',
      'A piece of furniture is not a fast-fashion purchase. It is something you live with for years, possibly decades. The materials should earn their place in your home. White oak, for me, earns it every time.',
    ],
    image: '/images/materials/white-oak.webp',
    imageAlt: 'White oak material swatch — solid wood with clear satin varnish',
    cardImage: '/images/journal/white-oak-grain-sq.webp',
    category: 'Materials',
    date: '2026-08-11',
    author: 'Rui Silva',
    inlineImages: [
      {
        after: 1,
        src: '/images/journal/white-oak-grain.webp',
        alt: 'Close-up of white oak grain running along a board in the workshop',
        caption: 'White oak grain, unfinished. Pronounced, but it reads as texture rather than pattern.',
      },
    ],
  },
  {
    slug: 'from-fashion-to-furniture',
    title: 'From Fashion to Furniture — The Studio Story',
    subtitle: 'How fifteen years in luxury fashion led to a workshop in Guimarães.',
    excerpt: 'After a career leading creative operations at FARFETCH, Rui Silva traded the digital for the tangible. One credenza, built for his own living room, became the foundation of a studio.',
    content: [
      'For fifteen years, I worked in luxury fashion. Most recently as SVP of Creative Operations at FARFETCH, I led teams that bridged creativity and logistics, making sure the world\u2019s most coveted brands reached their customers with precision and care. It was a world of deadlines, data, and digital tools.',
      'I was surrounded by beautiful things, yet I never made any of them. The gap between my hands and the finished object had grown too wide. I wanted to close it.',
      'So I started building furniture in my spare time. A workbench. A few hand tools. Weekend after weekend, learning through failure. The first pieces were not good, but they taught me the thing I needed to know: I was willing to fail in order to learn.',
      'The Credenza changed everything. I designed it for my own living room, a piece to hold my books, my records, the objects I had collected over years of travel. When it was finished, friends asked if I could make one for them. Then strangers started asking.',
      'In 2024, I founded Rui Silva Studio. The workshop is in Guimarães, in northern Portugal, a city built on craftsmanship and granite. It is not a showroom. It is a working atelier where every piece is designed, built, and finished by hand.',
      'Moving from fashion to furniture was not a rejection of one world for another. It was a return to something older: the idea that making things with your hands is a valid form of thinking. The Studio is what that belief looks like in practice.',
    ],
    image: '/images/workshop/workshop-golden-hour.webp',
    imageAlt: 'The studio workshop framework at golden hour',
    category: 'Studio',
    date: '2026-08-10',
    author: 'Rui Silva',
    inlineImages: [
      {
        after: 4,
        src: '/images/journal/studio-workshop-build.webp',
        alt: 'The wooden studio workshop in Guimarães, with a deck frame under construction in front',
        caption: 'The workshop in Guimarães, built by hand before the first collection.',
      },
    ],
  },
];
