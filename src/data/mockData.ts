import { Attraction, Destination } from "../types";
import { getDisplayProductId } from "../utils/productIdGenerator";
import lindtImage from "../assets/images/lindt_chocolate_fountain_1779240843252.png";

export const POPULAR_ATTRACTIONS: Attraction[] = [
  {
    id: "ams-rijksmuseum",
    timezone: "W. Europe Standard Time",
    name: "Rijksmuseum: Skip-the-line Admission",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Museum",
    rating: 4.7,
    reviewsCount: 3682,
    price: 21,
    discountPrice: 16,
    imageUrl:
      "https://aws-tiqets-cdn.imgix.net/images/content/0efa6312d9f84dc683af182d0c37f673.jpeg?auto=format%2Ccompress&dpr=2&fit=clip&h=695.2000122070312&q=85&s=519110b4ab8db921a4b7e4f12cce1025&w=null",
    isPopular: true,
    description:
      "Explore Dutch art and history from the Middle Ages to the present day at the national museum of the Netherlands.",
    highlights: [
      "Explore the iconic Rijksmuseum and discover over 8,000 artworks, including paintings, sculptures, decorative arts, prints, and historical artefacts.",
      "Wander through 80 galleries showcasing different periods and themes, offering a fascinating insight into Dutch art, culture, and heritage.",
      "Admire the museum’s stunning Neo-Renaissance architecture, designed by renowned Dutch architect Pierre Cuypers.",
      "Visit the Asian Pavilion and discover an impressive collection of artworks from India, China, Japan, and Indonesia.",
    ],
    included: [
      "Skip-the-line entrance ticket",
      "Access to permanent collections",
      "Access to temporary exhibitions",
    ],
    duration: "2-3 hours",
    openingHours: "Daily: 09:00 - 17:00",
  },
  {
    id: "lis-jeronimos",
    timezone: "GMT Standard Time",
    name: "Jerónimos Monastery: Admission Ticket",
    location: "Lisbon, Portugal",
    city: "Lisbon",
    region: "Europe",
    category: "Landmark",
    rating: 4.7,
    reviewsCount: 12500,
    price: 10,
    imageUrl:
      "https://aws-tiqets-cdn.imgix.net/images/content/8dda2bb7142f44b38c3d90d1fd677d2f.jpg?auto=format%2Ccompress&fit=crop&q=85&w=1200&s=6ad1c37b4fe53de884ec10685140b5e8",
    isPopular: true,
    description:
      "Visit the Mosteiro dos Jerónimos, a magnificent 16th-century monastery and UNESCO World Heritage site in Lisbon.",
    highlights: [
      "Visit the Jerónimos Monastery, a UNESCO World Heritage Site, and discover its rich religious and cultural history.",
      "Learn about the monastery’s past as a place of worship, school, and orphanage, gaining insights into Portuguese heritage.",
      "Explore the magnificent 16th-century cloisters and the historic monks’ dining hall.",
      "Admire the intricate Portuguese Late Gothic and Manueline architecture.",
      "Pay tribute to notable historical figures, including poet Luís de Camões and explorer Vasco da Gama, whose tomb lies within the monastery.",
    ],
    included: ["Admission ticket", "Access to the cloisters and church"],
    duration: "1-2 hours",
    openingHours: "Tue-Sun: 10:00 - 18:30 (Closed Mondays)",
  },
  {
    id: "bcn-casa-batllo",
    timezone: "Romance Standard Time",
    name: "Casa Batlló: Entrance Ticket + Audio Guide",
    location: "Barcelona, Spain",
    city: "Barcelona",
    region: "Europe",
    category: "Architecture",
    rating: 4.8,
    reviewsCount: 35000,
    price: 35,
    discountPrice: 28,
    imageUrl:
      "https://infotur.scene7.com/is/image/cta/act-24-0836-finestra-vitralls-colors-casa-batllo:1-1?wid=748&hei=748",
    isPopular: true,
    description:
      "Step inside Antoni Gaudí’s architectural masterpiece, Casa Batlló, and discover a world of magic and fantasy.",
    highlights: [
      "Entrance to Casa Batlló",
      "Augmented reality smart guide",
      "Explore the Noble Floor and attic",
      "See the iconic roof terrace with its dragon-back scale",
    ],
    included: [
      "Entrance ticket",
      "Smart guide (AR audio guide)",
      "Access to the Gaudi Cube and Gaudi Dome",
    ],
    duration: "1-1.5 hours",
    openingHours: "Daily: 09:00 - 20:00",
  },
  {
    id: "bcn-casa-mila",
    timezone: "Romance Standard Time",
    name: "La Pedrera - Casa Milà: Skip-the-line Ticket",
    location: "Barcelona, Spain",
    city: "Barcelona",
    region: "Europe",
    category: "Architecture",
    rating: 4.7,
    reviewsCount: 28000,
    price: 25,
    discountPrice: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1583772212953-b26a1caea864?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Explore La Pedrera (Casa Milà), another of Gaudí’s iconic buildings, famous for its unique stone facade and sculptural roof.",
    highlights: [
      "Visit Casa Milà (La Pedrera), Gaudí’s iconic modernist masterpiece.",
      "Admire its stone façade, twisting iron balconies, and sculptural chimneys.",
      "Enjoy breathtaking Barcelona skyline views from the rooftop.",
      "Explore a recreated apartment showcasing early 20th-century bourgeois living.",
    ],
    included: [
      "Skip-the-line ticket",
      "Audio guide",
      "Access to the Warrior Rooftop",
    ],
    duration: "1.5 hours",
    openingHours: "Daily: 09:00 - 20:30",
  },
  {
    id: "ny-edge",
    timezone: "Eastern Standard Time",
    name: "Edge NYC: Observation Deck Admission",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Observation Deck",
    rating: 4.8,
    reviewsCount: 15200,
    price: 36,
    imageUrl:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Experience 360-degree views of New York City from the highest outdoor sky deck in the Western Hemisphere.",
    highlights: [
      "Experience Edge New York, soaring over 1,100 feet above Manhattan for breathtaking 360° skyline views.",
      "Step onto the Western Hemisphere’s highest outdoor sky deck, extending 80 feet out over the city.",
      "Feel the thrill of leaning against glass walls tilted outward at 6.6°, offering a unique perspective of Manhattan.",
      "Walk across the 225-square-foot glass floor and look down 100 storeys at the bustling streets below.",
    ],
    included: [
      "Admission ticket",
      "Access to the Level 100 indoor and outdoor decks",
      "Glass floor and Skyline Steps",
    ],
    duration: "1-2 hours",
    openingHours: "Daily: 10:00 - 22:00",
  },
  {
    id: "zrh-lindt",
    timezone: "W. Europe Standard Time",
    name: "Lindt Home of Chocolate Museum: Tour & Tasting",
    location: "Zurich, Switzerland",
    city: "Zurich",
    region: "Europe",
    category: "Museum",
    rating: 4.9,
    reviewsCount: 12800,
    price: 15,
    imageUrl: lindtImage,
    isPopular: true,
    description:
      "Discover the world of chocolate at the Lindt Home of Chocolate, featuring a massive 9-meter chocolate fountain.",
    highlights: [
      "Enjoy a spontaneous visit to Lindt Home of Chocolate with a convenient last-minute entry ticket.",
      "Explore interactive exhibits and indulge in delicious tastings of Lindt’s finest chocolates.",
      "Join a hands-on chocolate-making workshop and learn expert techniques from professional chocolatiers.",
      "Combine your visit with a guided Zurich city tour and discover the historic charm of Old Town.",
      "Enhance your experience with a scenic Lake Zurich cruise and admire the city from the water.",
    ],
    included: ["Admission ticket", "Audio guide", "Chocolate tasting"],
    duration: "1.5 - 2 hours",
    openingHours: "Daily: 10:00 - 18:00",
  },
  {
    id: "rom-colosseum",
    timezone: "W. Europe Standard Time",
    name: "Colosseum: Priority Entrance Ticket",
    location: "Rome, Italy",
    city: "Rome",
    region: "Europe",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 45000,
    price: 24,
    discountPrice: 19,
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    description:
      "Step back in time and explore the mighty Colosseum, the largest amphitheater ever built.",
    highlights: [
      "Explore the iconic Colosseum, one of the Seven Wonders of the World.",
      "Discover the ancient amphitheatre where gladiators once fought.",
      "Learn about its construction in 72 AD under Emperor Vespasian.",
      "Visit Palatine Hill, the birthplace of Rome, and enjoy panoramic city views.",
      "Uncover ancient Roman history and culture with an informative audio guide.",
    ],
    included: [
      "Skip-the-line entrance ticket",
      "Access to the Roman Forum",
      "Access to Palatine Hill",
    ],
    duration: "3 hours",
    openingHours: "Daily: 08:30 - 19:00",
  },
  {
    id: "rom-forum",
    timezone: "W. Europe Standard Time",
    name: "Roman Forum & Palatine Hill Admission",
    location: "Rome, Italy",
    city: "Rome",
    region: "Europe",
    category: "History",
    rating: 4.7,
    reviewsCount: 32000,
    price: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Explore the ruins of the central hub of ancient Rome and the hill where the city was founded.",
    highlights: [
      "Explore the Roman Forum, the historic heart of the Roman Empire.",
      "Discover ancient landmarks like the Temple of Saturn, Arch of Titus, and Basilica Julia.",
      "Walk along Via Sacra, the famous ceremonial route of ancient Rome.",
      "Uncover fascinating insights into Roman history, architecture, and culture.",
      "Secure last-minute entry tickets for a hassle-free visit.",
    ],
    included: ["Admission ticket", "Digital map"],
    duration: "2 hours",
    openingHours: "Daily: 09:00 - 18:30",
  },
  {
    id: "rom-castel",
    timezone: "W. Europe Standard Time",
    name: "Castel Sant'Angelo: Fast Track Ticket",
    location: "Rome, Italy",
    city: "Rome",
    region: "Europe",
    category: "Museum",
    rating: 4.6,
    reviewsCount: 21000,
    price: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Visit Hadrian's mausoleum, transformed into a fortress and Papal residence over the centuries.",
    highlights: [
      "Explore Castel Sant’Angelo and discover centuries of Roman history.",
      "Visit all five floors of the museum with skip-the-line entry.",
      "Enjoy panoramic views of Rome and the Tiber River from the castle terrace.",
      "Discover its fascinating past as a fortress protecting Rome from invasions.",
    ],
    included: ["Skip-the-line entrance", "Access to all open sections"],
    duration: "1.5 - 2 hours",
    openingHours: "Daily: 09:00 - 19:30",
  },
  {
    id: "rom-vatican",
    timezone: "W. Europe Standard Time",
    name: "Vatican Museums & Sistine Chapel Entrance Ticket",
    location: "Vatican City, Rome, Italy",
    city: "Rome",
    region: "Europe",
    category: "Museum",
    rating: 4.8,
    reviewsCount: 52000,
    price: 28,
    discountPrice: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1548625361-165c71d05370?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Walk through the breathtaking exhibitions of the Vatican Museums and stand in awe under Michelangelo's legendary frescoes in the Sistine Chapel.",
    highlights: [
      "Visit the Vatican Museums and Sistine Chapel to explore an incredible collection of over 70,000 artworks and historical treasures.",
      "Enjoy skip-the-line access and discover famous attractions like Raphael’s Rooms, Pinacoteca, and the world-renowned Sistine Chapel.",
      "Explore fascinating galleries and sections, including the Borgia Apartment and the Jewish Lapidarium.",
      "Discover captivating temporary exhibitions showcasing art, culture, and history from around the world.",
      "Book your last-minute entrance tickets and secure your spot at this iconic attraction.",
    ],
    included: [
      "Fast-track admission ticket to the Vatican Museums",
      "Admission ticket to the Sistine Chapel",
      "Access to all open galleries and exhibitions",
    ],
    duration: "3 - 4 hours",
    openingHours: "Mon-Sat: 09:00 - 18:00 (Closed Sundays)",
  },
  {
    id: "ist-cistern",
    timezone: "Türkiye Standard Time",
    name: "Basilica Cistern: Skip-the-Line Entry",
    location: "Istanbul, Turkey",
    city: "Istanbul",
    region: "Asia",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 18500,
    price: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Descend beneath the streets of Istanbul to discover the magical Basilica Cistern, the largest of several hundred ancient cisterns.",
    highlights: [
      "Explore the magnificent Basilica Cistern, a hidden underground wonder beneath the streets of Istanbul.",
      "Admire the mysterious Medusa heads, featuring the legendary Gorgon with snakes for hair.",
      "Marvel at the vaulted ceilings, raised wooden walkways, and impressive Roman-era architecture.",
      "Enjoy the unique inverted visual experience as the crystal-clear water reflects the cistern’s stunning ceiling.",
    ],
    included: ["Admission ticket", "Access to the entire cistern"],
    duration: "1 hour",
    openingHours: "Daily: 09:00 - 19:00",
  },
  {
    id: "ist-hagia",
    timezone: "Türkiye Standard Time",
    name: "Hagia Sophia: Entry & Highlights Guided Tour",
    location: "Istanbul, Turkey",
    city: "Istanbul",
    region: "Asia",
    category: "Religious",
    rating: 4.9,
    reviewsCount: 52000,
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    description:
      "Visit one of the world's most significant historical and religious landmarks, a masterpiece of Byzantine architecture.",
    highlights: [
      "Explore the magnificent Hagia Sophia, a masterpiece of Byzantine architecture featuring a grand dome and intricate mosaics blending Roman and Islamic influences.",
      "Discover its fascinating history, built under Emperor Justinian in 532 AD, and learn about the legacy of the Ottoman Empire.",
      "Admire the stunning golden mosaics, intricate calligraphy, and beautifully decorated interiors.",
      "Marvel at the majestic dome and remarkable architectural details while exploring this iconic landmark.",
      "Discover a fascinating collection of historical artifacts, including imperial decorations, ancient manuscripts, and religious relics.",
    ],
    included: ["Admission ticket", "Professional guide"],
    duration: "1 hour",
    openingHours: "Daily: 09:00 - 19:30",
  },
  {
    id: "ist-dolmabahce",
    timezone: "Türkiye Standard Time",
    name: "Dolmabahçe Palace: Admission & Audio Guide",
    location: "Istanbul, Turkey",
    city: "Istanbul",
    region: "Asia",
    category: "Architecture",
    rating: 4.7,
    reviewsCount: 15600,
    price: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Explore the lavish and grandiose 19th-century palace that served as the primary residence of Ottoman Sultans.",
    highlights: [
      "Enjoy skip-the-line entry to Dolmabahçe Palace, one of Istanbul’s most iconic landmarks.",
      "Explore the Harem section, featuring the private living quarters of the sultan and his family.",
      "Admire the magnificent Ceremonial Hall, adorned with crystal chandeliers, gilded ceilings, and intricate marblework.",
      "Discover the palace’s impressive art collection, including fine porcelain, crystal, and paintings by renowned Turkish artists.",
      "Take in breathtaking panoramic views of the Bosphorus Strait and Istanbul’s skyline.",
    ],
    included: ["Entry to main palace and Harem", "Multilingual audio guide"],
    duration: "2 hours",
    openingHours: "Daily: 09:00 - 16:00 (Closed Mondays)",
  },
  {
    id: "ist-topkapi",
    timezone: "Türkiye Standard Time",
    name: "Topkapi Palace: Fast Track & Highlights Tour",
    location: "Istanbul, Turkey",
    city: "Istanbul",
    region: "Asia",
    category: "History",
    rating: 4.8,
    reviewsCount: 38000,
    price: 45,
    imageUrl:
      "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Step into the Ottoman Empire's court at Topkapi Palace, featuring opulent courtyards, sacred relics, and magnificent views.",
    highlights: [
      "Fast-track access to the palace complex",
      "Explore the Harem and Treasury",
      "See the Spoonmaker's Diamond",
      "Panoramic views of the Golden Horn",
    ],
    included: [
      "Skip-the-line entry ticket",
      "Access to the Harem",
      "Tour guide introduction",
    ],
    duration: "3 hours",
    openingHours: "Daily: 09:00 - 18:00 (Closed Tuesdays)",
  },
  {
    id: "ist-galata",
    timezone: "Türkiye Standard Time",
    name: "Galata Tower Entry Tickets",
    location: "Galata, Istanbul, Turkey",
    city: "Istanbul",
    region: "Asia",
    category: "Landmark",
    rating: 4.7,
    reviewsCount: 28000,
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    description:
      "Climb to the top of the iconic Galata Tower for breathtaking 360-degree views of Istanbul, the Bosporus, and the Golden Horn.",
    highlights: [
      "Explore Galata Tower, a symbol of Istanbul’s rich history and cultural heritage.",
      "Admire breathtaking panoramic views of the city skyline.",
      "Enjoy refreshments at the tower’s café or restaurant at your own cost.",
      "Capture stunning sunset views and unforgettable memories.",
    ],
    included: [
      "Standard admission ticket",
      "Access to the viewing platform",
      "Access to the museum exhibition sections",
    ],
    duration: "1 hour",
    openingHours: "Daily: 08:30 - 23:00",
  },
  {
    id: "sin-universal",
    timezone: "Singapore Standard Time",
    name: "Universal Studios Singapore Admission",
    location: "Sentosa Island, Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Fun",
    rating: 4.8,
    reviewsCount: 42000,
    price: 57,
    imageUrl:
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Experience cutting-edge rides, shows, and attractions based on your favorite blockbuster films and television series.",
    highlights: [
      "Visit the themed zones like Hollywood and Ancient Egypt",
      "Ride the Battlestar Galactica rollercoasters",
      "Meet your favorite movie characters",
      "Explore Transformers: The Ride",
    ],
    included: ["Standard admission ticket", "Access to all shows and rides"],
    duration: "Flexible (all day)",
    openingHours: "Daily: 11:00 - 18:00",
  },
  {
    id: "tok-teamlab",
    timezone: "Tokyo Standard Time",
    name: "teamLab Planets TOKYO: Admission Ticket",
    location: "Tokyo, Japan",
    city: "Tokyo",
    region: "Asia",
    category: "Arts",
    rating: 4.9,
    reviewsCount: 28500,
    price: 23,
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Dive into a body-immersive digital art museum where you walk through water and become one with the flowers.",
    highlights: [
      "Grab last-minute tickets to explore immersive interactive digital art.",
      "Experience stunning digital installations that respond to your movements.",
      "Combine your visit with a Tokyo Subway Pass for unlimited rides.",
      "Add Tokyo Tower access for breathtaking skyline views.",
      "Stay connected with an eSIM bundle for seamless mobile data.",
    ],
    included: ["Admission ticket", "Access to all installations"],
    duration: "2 hours",
    openingHours: "Daily: 09:00 - 22:00",
  },
  {
    id: "ams-van-gogh",
    timezone: "W. Europe Standard Time",
    name: "Van Gogh Museum: Entrance Ticket",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Museum",
    rating: 4.4,
    reviewsCount: 2810,
    price: 22,
    imageUrl:
      "https://aws-tiqets-cdn.imgix.net/images/content/71e1edc441ef419789f059c8ee9b3ec4.jpg?auto=format%2Ccompress&dpr=2&fit=crop&h=360&q=30&w=1200",
    isPopular: true,
    provider: "Van Gogh Museum",
    duration: "1.5 - 2 hours",
    fastTrack: true,
    description:
      "Explore the world’s largest collection of works by Vincent van Gogh, including masterpieces like Sunflowers, The Potato Eaters, and Almond Blossom.",
    highlights: [
      "Enjoy a spontaneous visit to the Van Gogh Museum with instant last-minute entry tickets.",
      "Skip the queues and explore an incredible collection of Van Gogh’s masterpieces, rare sketches, and personal letters.",
      "Make the most of your visit with an audio guide offering fascinating insights into the artist’s life and artworks.",
      "Combine your museum experience with a scenic Amsterdam canal cruise and admire the city’s charming waterways.",
      "Enhance your Amsterdam experience with a 1-day nightlife pass, giving you access to some of the city’s top clubs.",
    ],
    included: [
      "Timed-entry admission ticket",
      "Access to the permanent collection",
      "Access to temporary exhibitions",
    ],
    galleryUrls: [
      "https://aws-tiqets-cdn.imgix.net/images/content/71e1edc441ef419789f059c8ee9b3ec4.jpg?auto=format%2Ccompress&dpr=2&fit=crop&h=360&q=30&w=1200",
    ],
    openingHours: "Daily: 09:00 - 18:00",
    cancellationPolicy: "This ticket is non-refundable",
  },
  {
    id: "sagrada-familia",
    timezone: "Romance Standard Time",
    name: "Sagrada Familia: Fast Track Ticket + Optional Towers",
    location: "Barcelona, Spain",
    city: "Barcelona",
    region: "Europe",
    category: "Architecture",
    rating: 4.7,
    reviewsCount: 64965,
    price: 33.8,
    imageUrl:
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    provider: "Sagrada Família",
    duration: "1h 30mins",
    fastTrack: true,
    liveGuide: "English",
    maxGroupSize: 30,
    description:
      "Get fast-track access to Gaudi's unfinished masterpiece. Explore the stunning interior and learn about the history of this iconic basilica.",
    highlights: [
      "Skip the lines with fast-track entry to La Sagrada Familia and explore its stunning blend of art, architecture, and spirituality.",
      "Admire the intricate sculptures depicting biblical scenes, including The Last Supper, Kiss of Judas, Ecce Homo, and the Sanhedrin Trial of Jesus.",
      "Take a relaxing stroll through the beautiful gardens surrounding the basilica.",
      "Marvel at the stunning light and shadow effects inside as colourful stained-glass windows illuminate Gaudí’s extraordinary architectural masterpiece.",
    ],
    included: [
      "Fast track entrance to Sagrada Familia",
      "Downloadable Sagrada Familia app with audio guide",
    ],
    galleryUrls: [
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1583779457094-0cfcf3600897?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1558642084-fd07fae5282e?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&q=85&w=1200",
    ],
    openingHours: "Daily: 09:00 - 20:00",
    cancellationPolicy: "This ticket cannot be cancelled or rescheduled",
  },
  {
    id: "park-guell",
    timezone: "Romance Standard Time",
    name: "Park Güell: Admission Ticket",
    location: "Barcelona, Spain",
    city: "Barcelona",
    region: "Europe",
    category: "Park",
    rating: 4.3,
    reviewsCount: 49291,
    price: 13.5,
    imageUrl:
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    provider: "Park Güell",
    duration: "2 hours",
    description:
      "Secure your Park Güell tickets and enter into Gaudi’s colorful world with timed entry that lets you see it all.",
    highlights: [
      "Enjoy skip-the-line entry to Barcelona’s iconic Park Güell.",
      "Explore Gaudí’s masterpiece, blending art, nature, and creativity.",
      "Admire colourful mosaic patterns made from broken ceramic tiles.",
      "Marvel at vibrant designs, unique sculptures, and intricate details inspired by nature.",
    ],
    included: [
      "Admission to the Monumental Zone",
      "Access to the surrounding park areas",
    ],
    galleryUrls: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&q=80&w=800",
    ],
    openingHours: "Daily: 09:30 - 19:30",
    cancellationPolicy: "Free cancellation up to 24 hours in advance",
  },
  {
    id: "1",
    timezone: "Romance Standard Time",
    name: "The Louvre Museum",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "Museum",
    rating: 4.8,
    reviewsCount: 12450,
    price: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    description:
      "Explore the worlds largest and most visited museum. From the enigmatic Mona Lisa to the majestic Venus de Milo, discover masterpieces that span thousands of years of art history.",
    highlights: [
      "Book Louvre Museum skip-the-line tickets and explore its world-renowned collection of over 30,000 artworks.",
      "Admire iconic masterpieces, including the Mona Lisa, Venus de Milo, and The Wedding Feast at Cana.",
      "Discover the fascinating ancient Egyptian collection, featuring mummies, statues, and hieroglyphs.",
      "Marvel at the Winged Victory of Samothrace, a celebrated marble sculpture from the Hellenistic period.",
      "Secure last-minute entry tickets and experience one of Paris’s most iconic cultural attractions.",
    ],
    included: [
      "Fast-track entrance ticket",
      "Access to permanent collections",
      "Access to temporary exhibitions (subject to availability)",
      "Digital map of the museum",
    ],
    excluded: [
      "Guided tour",
      "Audio guide (available for rent)",
      "Food and drinks",
    ],
    knowBeforeYouGo: [
      "The museum is closed on Tuesdays.",
      "Bags larger than 55 x 35 x 20 cm are not allowed.",
      "Photography is allowed without flash.",
      "Expect long security lines even with skip-the-line tickets.",
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "ID card or Passport",
      "Water bottle",
    ],
    duration: "3-4 hours",
    galleryUrls: [
      "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=85&w=1200",
    ],
    cancellationPolicy: "Free cancellation up to 24 hours in advance",
  },
  {
    id: "2",
    timezone: "Singapore Standard Time",
    name: "Gardens by the Bay",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Nature",
    rating: 4.9,
    reviewsCount: 32000,
    price: 28,
    imageUrl:
      "https://www.reflectionsenroute.com/wp-content/uploads/2022/08/gardens-by-bay-singapore-5-1024x683.jpg.webp",
    isPopular: true,
    galleryUrls: [
      "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1565967511849-75a6fd7f9a0a?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?auto=format&fit=crop&q=85&w=1200",
    ],
    highlights: [
      "Experience the vibrant beauty of Singapore’s Gardens by the Bay.",
      "Explore the Flower Dome, home to over 1.5 million flowers.",
      "Discover the Cloud Forest with its 35-metre mist-covered mountain and stunning waterfall.",
      "Wander through Floral Fantasy and admire its colourful hanging flower displays.",
    ],
  },
  {
    id: "3",
    timezone: "SE Asia Standard Time",
    name: "The Grand Palace",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Cultural",
    rating: 4.7,
    reviewsCount: 15000,
    price: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    galleryUrls: [
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&q=85&w=1200",
    ],
    highlights: [
      "Explore Bangkok’s magnificent Grand Palace and admire its intricate architecture and rich Thai royal heritage.",
      "Learn about the palace’s history and cultural significance, dating back to 1782, with an English-speaking guide.",
      "Visit Wat Phra Kaew and admire the revered Emerald Buddha, a sacred jade-green statue.",
      "Marvel at the world’s longest mural depicting the Thai Ramayana, showcasing Thailand’s rich mythology and artistic heritage.",
    ],
  },
  {
    id: "4",
    timezone: "AUS Eastern Standard Time",
    name: "Sydney Opera House",
    location: "Sydney, Australia",
    city: "Sydney",
    region: "Oceania",
    category: "Architectural",
    rating: 4.9,
    reviewsCount: 45600,
    price: 43,
    imageUrl:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    galleryUrls: [
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&q=85&w=1200",
    ],
    highlights: [
      "Explore the UNESCO-listed Sydney Opera House on a guided tour.",
      "Admire Jørn Utzon’s iconic architectural masterpiece.",
      "Enjoy stunning views of Sydney Harbour and its surroundings.",
      "Discover its history, construction, and cultural significance with an English-speaking guide.",
    ],
  },
  {
    id: "5",
    timezone: "Tokyo Standard Time",
    name: "Tokyo Tower",
    location: "Tokyo, Japan",
    city: "Tokyo",
    region: "Asia",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 22000,
    price: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    galleryUrls: [
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=85&w=1200",
    ],
    highlights: [
      "Enjoy breathtaking 360° panoramic views of Tokyo from the Main Observatory.",
      "Capture stunning photos of the city skyline and iconic landmarks.",
      "Admire views of Mount Fuji, Tokyo Bay, and the surrounding cityscape.",
      "Experience dazzling city lights from 150 metres above the ground.",
      "Savour delicious snacks at the observatory’s restaurants while enjoying scenic views.",
    ],
  },
  {
    id: "osaka-castle",
    timezone: "Tokyo Standard Time",
    name: "Osaka Castle: Entrance & Observatory Ticket",
    location: "Osaka, Japan",
    city: "Osaka",
    region: "Asia",
    category: "History",
    rating: 4.8,
    reviewsCount: 19400,
    price: 15,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Osaka_Castle_03bs3200.jpg/1280px-Osaka_Castle_03bs3200.jpg",
    isPopular: true,
    description:
      "Immerse yourself in Japan's rich history. Explore the legendary Osaka Castle, including the informative museum exhibits and the stunning top-floor panoramic observatory deck.",
    highlights: [
      "Book Osaka Castle tickets and explore this historic landmark, dating back to 1597, renowned for its Japanese feudal architecture.",
      "Discover the castle museum and learn about its rich history and significance in Japanese culture.",
      "Admire the impressive 42-metre-high main tower and enjoy panoramic views of Osaka city.",
      "See fascinating cultural treasures, including a National Treasure sword and suit of armour.",
    ],
    included: [
      "Standard admission ticket to Castle Main Tower",
      "Access to special history museum exhibits",
    ],
    duration: "1.5 - 2 hours",
    openingHours: "Daily: 09:00 - 17:00",
    galleryUrls: [
      "https://images.unsplash.com/photo-1590253465376-7c34090ef84a?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=85&w=1200",
    ],
  },
  {
    id: "osaka-usj",
    timezone: "Tokyo Standard Time",
    name: "Universal Studios Japan (USJ) Osaka Studio Pass",
    location: "Osaka, Japan",
    city: "Osaka",
    region: "Asia",
    category: "Theme Park",
    rating: 4.9,
    reviewsCount: 38200,
    price: 74,
    imageUrl:
      "https://resources.matcha-jp.com/resize/720x2000/2025/03/18-228351.webp",
    isPopular: true,
    description:
      "Experience your favorite movie worlds in Osaka! Visit Super Nintendo World, The Wizarding World of Harry Potter, Minion Park, and hold on tight to world-class rollercoasters.",
    highlights: [
      "Interact with live characters in Super Nintendo World",
      "Explore Hogwarts Castle and sample some butterbeer",
      "Enjoy action-packed thrilling family rides and spectacular evening shows",
      "Convenient direct enter-with-QR-code pass",
    ],
    included: [
      "1-Day general admission studio pass",
      "Access to all themed zones and regular rides",
    ],
    duration: "Full day",
    openingHours: "Daily: 08:30 - 21:00",
    galleryUrls: [
      "https://images.unsplash.com/photo-1627581177641-fc1cb3fe4445?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=85&w=1200",
    ],
  },
  {
    id: "usa-statue",
    timezone: "Eastern Standard Time",
    name: "Statue of Liberty",
    location: "New York, USA",
    city: "USA",
    region: "Other",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 18900,
    price: 24,
    imageUrl:
      "https://assets.cityexperiences.com/wp-content/uploads/2021/07/New-York-Statue-of-Liberty.jpg",
    galleryUrls: [
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&q=85&w=1200",
    ],
    description:
      "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor within New York City, in the United States.",
    highlights: [
      "Cruise across New York Harbour and enjoy stunning panoramic views of the Manhattan skyline, Brooklyn Bridge, and One World Trade Center.",
      "Visit Liberty Island and admire the iconic Statue of Liberty up close while enjoying beautiful views of the city and plenty of photo opportunities.",
      "Explore Ellis Island and discover the history of American immigration at the Immigration Museum, Great Hall, and American Immigrant Wall of Honor.",
      "Listen to engaging audio commentary filled with fascinating stories, historical insights, and lesser-known facts about Liberty Island and Ellis Island.",
      "Enhance your visit with expert-led guided tours or flexible audio guides for a more informative and personalised experience.",
    ],
    included: [
      "Round-trip ferry service",
      "Statue of Liberty Museum access",
      "Ellis Island Immigration Museum access",
    ],
    duration: "3-4 hours",
    openingHours: "Daily: 09:00 - 17:00",
  },
  {
    id: "usa-disney",
    timezone: "Eastern Standard Time",
    name: "Walt Disney World® Resort",
    location: "Orlando, USA",
    city: "USA",
    region: "Other",
    category: "Fun",
    rating: 4.9,
    reviewsCount: 125400,
    price: 109,
    imageUrl:
      "https://www.thetopvillas.com/_next/image?url=https%3A%2F%2Fbkt-euwest2-prod-cms-strapi01.s3.eu-west-2.amazonaws.com%2FDisney_world_Florida_3647c1dd18.jpg&w=3840&q=100",
    description:
      "Magic Kingdom, Epcot, Disney's Hollywood Studios, and Disney's Animal Kingdom – Walt Disney World® Resort is the place where dreams come true.",
    highlights: [
      "Step into the magical world of Walt Disney World Resort and enjoy thrilling rides, spectacular shows, and immersive themed lands.",
      "Customize your Disney adventure with flexible ticket options, allowing you to explore a single park or hop between all four parks.",
      "Discover the four iconic theme parks: Magic Kingdom, Hollywood Studios, EPCOT, and Animal Kingdom, each offering unique attractions and unforgettable experiences.",
      "Be mesmerized by dazzling fireworks displays, enchanting parades, and spectacular live entertainment throughout the parks.",
      "Relive your childhood memories as you meet beloved Disney characters like Mickey Mouse, Donald Duck, and Cinderella.",
    ],
    included: [
      "Admission to the requested parks",
      "Access to all standard attractions and entertainment",
    ],
    duration: "1-7 days",
    openingHours: "Daily: 09:00 - 22:00",
  },
  {
    id: "kor-gyeongbokgung",
    timezone: "Korea Standard Time",
    name: "Gyeongbokgung Palace & Royal Hanbok Experience: Historic Seoul Tour",
    location: "Seoul, South Korea",
    city: "Seoul",
    region: "Asia",
    category: "Landmark",
    rating: 4.9,
    reviewsCount: 16820,
    price: 18,
    discountPrice: 14,
    imageUrl: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&q=85&w=1200",
    galleryUrls: [
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&q=85&w=1200"
    ],
    isPopular: true,
    description: "Step into Korea's Joseon Dynasty at the grand Gyeongbokgung Palace. Wear a traditional Korean Hanbok with complimentary royal palace admission, professional hair styling, and an expert guided tour through historic pavilions and tranquil royal gardens.",
    highlights: [
      "Skip-the-line entrance to Gyeongbokgung Palace with Hanbok rental",
      "Hundreds of designer Hanbok robes & complimentary royal hair styling",
      "Witness the Royal Guard Changing Ceremony at Gwanghwamun Gate",
      "Discover the Hyangwonjeong & Gyeonghoeru lakeside pavilions"
    ],
    included: [
      "Traditional Hanbok rental (2-4 hours)",
      "Free palace admission in Hanbok",
      "Locker service and themed accessories",
      "English & Korean speaking guide"
    ],
    duration: "2-4 hours",
    openingHours: "Daily: 09:00 - 18:00 (Closed Tuesdays)"
  },
  {
    id: "kor-nseoultower",
    timezone: "Korea Standard Time",
    name: "N Seoul Tower Observatory & Namsan Mountain Cable Car Pass",
    location: "Seoul, South Korea",
    city: "Seoul",
    region: "Asia",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 14210,
    price: 16,
    imageUrl: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=85&w=1200",
    galleryUrls: [
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&q=85&w=1200"
    ],
    isPopular: true,
    description: "Admire panoramic 360-degree views of Seoul from the iconic N Seoul Tower. Ride the scenic Namsan Cable Car, see the famous Locks of Love bridge, and gaze across the Han River skyline.",
    highlights: [
      "Book N Seoul Tower tickets and visit one of Seoul’s most iconic landmarks for a memorable experience.",
      "Head to the observation deck and enjoy breathtaking panoramic views of Seoul and its surrounding landscapes.",
      "Experience the tower’s romantic atmosphere and explore the famous love-lock area, a popular spot for couples.",
      "Discover engaging cultural events and exhibitions showcasing Korean culture and traditions.",
      "Visit at night to admire the tower’s dazzling illuminations and stunning views of Seoul’s sparkling skyline.",
    ],
    included: [
      "Observatory deck admission ticket",
      "Access to love padlock observation decks",
      "Interactive media art exhibition"
    ],
    duration: "1-2 hours",
    openingHours: "Daily: 10:00 - 22:30"
  },
  {
    id: "ny-911-memorial",
    timezone: "Eastern Standard Time",
    name: "9/11 Memorial Museum, New York | Skip-The-Line Admission Tickets",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Museum",
    rating: 4.8,
    reviewsCount: 15400,
    price: 33,
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/42/39/57/caption.jpg?w=1200&h=-1&s=1",
    description:
      "Pay your respects at the 9/11 Memorial and explore the Museum to learn about the events of September 11, 2001.",
    highlights: [
      "Explore the three main sections of the 9/11 Memorial Museum – Before 9/11, the Day of 9/11, and After 9/11 – to understand the events leading up to the attacks and their lasting impact.",
      "View photographs and personal tributes honouring the victims while learning about their lives and stories through accounts shared by survivors and family members.",
      "Discover significant historical artifacts, including the iconic Survivors’ Stairs, which provided an escape route for people fleeing the World Trade Center site.",
      "Book 9/11 Memorial Museum tickets and listen to firsthand accounts from survivors, first responders, and others affected by the tragedy through recorded interviews.",
    ],
    duration: "3 hours - 7 days",
    openingHours: "Daily: 09:00 - 19:00",
  },
  {
    id: "ny-one-world",
    timezone: "Eastern Standard Time",
    name: "One World Observatory Tickets, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Observation Deck",
    rating: 4.6,
    reviewsCount: 12400,
    price: 44,
    imageUrl:
      "https://www.oneworldobservatory.com/wp-content/uploads/2022/04/dsc_5921_retouch-1.jpeg",
    description:
      "Experience 360-degree views of New York City from the tallest building in the Western Hemisphere.",
    highlights: [
      "Visit One World Observatory and enjoy breathtaking 360-degree panoramic views of New York City from the tallest building in the Western Hemisphere.",
      "Experience an exhilarating SkyPod elevator ride to the 102nd-floor observation deck in under 60 seconds while discovering fascinating visual exhibits.",
      "Step onto the Sky Portal, a 14-foot-high-definition video floor, and enjoy a unique virtual perspective of the bustling streets below.",
      "Explore interactive exhibits showcasing the construction, architecture, and significance of One World Trade Center.",
      "Discover the moving history of 9/11 and learn about the resilience and rebuilding of New York City at this iconic landmark.",
    ],
    duration: "1 hour - 3 days",
    openingHours: "Daily: 09:00 - 21:00",
  },
  {
    id: "ny-central-park",
    timezone: "Eastern Standard Time",
    name: "Central Park Walking Tour, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Tour",
    rating: 4.5,
    reviewsCount: 3500,
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Discover the hidden gems and history of Manhattan's iconic green oasis on a guided walking tour.",
    highlights: [
      "Explore Central Park, a historic green oasis in the heart of Manhattan, featuring iconic statues of famous figures such as Balto, Alice in Wonderland, and William Shakespeare.",
      "Enjoy seasonal attractions, including skating rinks in winter and picturesque snow-covered landscapes.",
      "Escape the hustle and bustle of New York City as you stroll through lush green spaces, scenic pathways, and peaceful landscapes.",
      "Discover the park’s rich biodiversity, with over 18,000 trees providing a natural habitat for wildlife and more than 200 bird species.",
      "Learn how the Central Park Conservancy, along with its dedicated staff and volunteers, maintains the park through conservation, restoration, and sustainable landscaping initiatives.",
    ],
    duration: "2 hours",
    openingHours: "Daily: 08:00 - 20:00",
  },
  {
    id: "ny-moma",
    timezone: "Eastern Standard Time",
    name: "Museum Of Modern Art Tickets, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Museum",
    rating: 5.0,
    reviewsCount: 23000,
    price: 28,
    imageUrl:
      "https://loving-newyork.com/wp-content/uploads/2019/05/Museum-of-Modern-Art-New-York-191010133114004.jpg",
    description:
      "Explore the world's leading museum of modern and contemporary art, featuring works by Van Gogh, Picasso, and Warhol.",
    highlights: [
      "Explore over 200,000 works of art at the Museum of Modern Art (MoMA), featuring iconic movements such as Cubism, Surrealism, and Abstract Expressionism.",
      "Admire masterpieces by world-renowned artists, including Pablo Picasso, Vincent van Gogh, and Andy Warhol.",
      "Discover six floors of artistic brilliance, tracing the evolution of modern and contemporary art from the 1880s to the present day.",
      "Immerse yourself in diverse art forms, explore groundbreaking artistic movements, and experience the creativity that has shaped the modern art world.",
    ],
    duration: "2 hours - 10 days",
    openingHours: "Daily: 10:30 - 17:30",
  },
  {
    id: "ny-met",
    timezone: "Eastern Standard Time",
    name: "Metropolitan Museum of Art, New York | Skip-The-Line Admission Tickets",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Museum",
    rating: 4.0,
    reviewsCount: 4200,
    price: 30,
    imageUrl:
      "https://www.exp1.com/wp-content/uploads/sites/7/2020/06/Met-Museum-1.jpg",
    description:
      "Discover over 5,000 years of art from around the world at the Met, one of the world's largest art museums.",
    highlights: [
      "Explore the Metropolitan Museum of Art (The Met) and discover an extraordinary collection spanning 5,000 years of art and culture from across five continents.",
      "Admire masterpieces by renowned artists such as Raphael, Van Gogh, Rembrandt, Vermeer, and Picasso while uncovering fascinating stories about their lives through an expert-guided tour.",
      "Visit the magnificent Temple of Dendur and learn how former First Lady Jacqueline Kennedy Onassis helped bring this ancient Egyptian monument to the museum.",
      "Marvel at John Singer Sargent’s iconic Madame X portrait and discover the controversy it sparked when first exhibited in Paris.",
      "Enjoy exclusive access to The Met’s rooftop terrace and take in breathtaking panoramic views of Central Park and the New York City skyline.",
    ],
    duration: "2 hours",
    openingHours: "Daily: 10:00 - 17:00",
  },
  {
    id: "ny-madame-tussauds",
    timezone: "Eastern Standard Time",
    name: "Madame Tussauds Tickets, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Entertainment",
    rating: 4.2,
    reviewsCount: 8900,
    price: 36,
    imageUrl:
      "https://images.trvl-media.com/place/2621/bf9746a3-7c06-49c2-b12e-842e1a0a1464.jpg",
    description:
      "Meet your favorite stars and experience the interactive Marvel 4D Cinema at the world's greatest wax museum.",
    highlights: [
      "Experience an interactive wax museum in Times Square, featuring themed galleries, exciting photo opportunities, and self-paced exploration.",
      "Explore multiple floors filled with lifelike wax figures of celebrities, world leaders, sports icons, and famous movie characters.",
      "Discover dedicated themed sections celebrating music legends, Broadway highlights, and iconic moments from the world of cinema.",
      "Enjoy the freedom to explore at your own pace, capture memorable photos, and spend more time with your favourite exhibits.",
    ],
    duration: "3 hours - 6 days",
    openingHours: "Daily: 10:00 - 20:00",
  },
  {
    id: "ny-broadway-museum",
    timezone: "Eastern Standard Time",
    name: "The Museum Of Broadway, New York | Skip-The-Line Admission Tickets",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Museum",
    rating: 4.7,
    reviewsCount: 1200,
    price: 45,
    imageUrl:
      "https://cdn.prod.website-files.com/645976a6c63b66486d263125/6462fc37221666b53fe5370e_mob-outside-museum.jpg",
    description:
      "Journey through the history of Broadway in this immersive and interactive museum experience.",
    highlights: [
      "Visit the Museum of Broadway in New York and discover the fascinating history and cultural impact of Broadway through interactive exhibits and immersive storytelling.",
      "Explore rare artifacts, original playbills, costumes, and props showcasing the evolution of Broadway’s most iconic productions.",
      "Get a behind-the-scenes look at theatrical magic through detailed set models, costume displays, and insights from renowned Broadway designers, directors, and performers.",
      "Step into recreated stage sets and interactive installations that bring legendary Broadway moments to life.",
      "Discover special exhibits celebrating groundbreaking productions and influential theater pioneers while gaining a deeper appreciation of Broadway’s creative legacy.",
    ],
    duration: "2 hours - 5 days",
    openingHours: "Daily: 10:00 - 22:00",
  },
  {
    id: "ny-go-pass",
    timezone: "Eastern Standard Time",
    name: "Go City New York All-Inclusive Pass",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Card",
    rating: 4.5,
    reviewsCount: 37000,
    price: 139,
    imageUrl:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    description:
      "Save up to 50% on top New York attractions with one pass. Choose from 1 to 10 days of unlimited sightseeing.",
    highlights: [
      "Enjoy access to over 100 top attractions across New York City, including the Statue of Liberty, Empire State Building, and One World Observatory.",
      "Choose from flexible pass durations of 1, 2, 3, 4, 5, 6, 7, or 10 days to match your travel plans.",
      "Explore the city at your own pace and customize your itinerary based on your interests, from history and architecture to art and entertainment.",
      "Discover New York’s vibrant art and culture scene with visits to renowned attractions like the Metropolitan Museum of Art and the Museum of Modern Art.",
      "Enjoy outdoor adventures with bike rides through Central Park, walking tours of Brooklyn’s neighbourhoods, and scenic strolls along the High Line.",
    ],
    duration: "1 day - 10 days",
    openingHours: "Varies by attraction",
  },
  {
    id: "ny-riseny",
    timezone: "Eastern Standard Time",
    name: "RiseNY Tickets, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Fun",
    rating: 4.8,
    reviewsCount: 6500,
    price: 32,
    imageUrl:
      "https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/v1/gc-v1/new-york-pass/rise_ny_visit_photos_outside_gokydd?_a=BAVAZGDY0",
    description:
      "A world-class attraction that combines a museum with a spectacular 4D flight simulation over New York City.",
    highlights: [
      "Enjoy an adrenaline-pumping 4D flying ride at RiseNY and experience an immersive journey across all five boroughs of New York City.",
      "Fly over Central Park and witness its stunning transformation through all four seasons.",
      "Take in breathtaking views of the New York City skyline as you soar 30 feet above the ground.",
      "Watch an award-winning documentary by renowned filmmaker Ric Burns and discover the fascinating history, culture, and pop culture of New York City.",
    ],
    duration: "1 hour - 3 days",
    openingHours: "Daily: 10:00 - 21:00",
  },
  {
    id: "ny-friends",
    timezone: "Eastern Standard Time",
    name: "The FRIENDS Experience New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Fun",
    rating: 4.5,
    reviewsCount: 24000,
    price: 52,
    imageUrl:
      "https://s.yimg.com/ny/api/res/1.2/UBA3oBwl0eOfqN0eFCryNw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD02OTk7Y2Y9d2VicA--/https://s.yimg.com/uu/api/res/1.2/nuH3mkCEBIGG.pXWYdVjvg--~B/aD0yOTIwO3c9NTE5MDthcHBpZD15dGFjaHlvbg--/https://d29szjachogqwa.cloudfront.net/images/user-uploaded/33._central_perk_from_friends_new_york_city_-_edited.jpg",
    description:
      "Step into the world of FRIENDS™ and explore iconic sets, including Rachel and Monica's apartment and Central Perk.",
    highlights: [
      "Visit The FRIENDS™ Experience New York and step into the recreated sets of the iconic American sitcom.",
      "See original props and costumes worn by Ross, Rachel, Phoebe, Monica, Joey, and Chandler, including Chandler’s Bunny Suit and Rachel’s Cow Jacket.",
      "Pose for memorable photos on the iconic orange couch, beside the Foosball table, and at the purple door.",
      "Explore Monica’s kitchen and Joey and Chandler’s apartment, featuring their famous BarcaLoungers.",
      "Stop by The FRIENDS™ Experience Store and shop exclusive merchandise inspired by your favorite TV show.",
    ],
    duration: "1 hour",
    openingHours: "Daily: 10:00 - 19:00",
  },
  {
    id: "ny-statue-cruise",
    timezone: "Eastern Standard Time",
    name: "Statue Of Liberty And Ellis Island Cruise, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Cruise",
    rating: 4.5,
    reviewsCount: 36000,
    price: 24,
    imageUrl:
      "https://assets.cityexperiences.com/wp-content/uploads/2021/07/New-York-Statue-of-Liberty.jpg",
    description:
      "Enjoy a scenic cruise to the Statue of Liberty and Ellis Island, America's most famous landmarks.",
    highlights: [
      "Cruise across New York Harbour and enjoy breathtaking panoramic views of the Manhattan skyline, Brooklyn Bridge, and One World Trade Center.",
      "Visit Liberty Island and admire the iconic Statue of Liberty up close, with plenty of opportunities for memorable photographs.",
      "Explore Ellis Island and discover the fascinating history of American immigration at the Immigration Museum, Great Hall, and American Immigrant Wall of Honour.",
      "Listen to engaging audio commentary filled with historical insights, fascinating stories, and lesser-known facts about Liberty Island and Ellis Island.",
      "Enhance your experience with expert-led guided tours or flexible audio guides for a more informative and personalized visit.",
    ],
    duration: "1 hour",
    openingHours: "Daily: 09:00 - 17:00",
  },
  {
    id: "ny-empire-state",
    timezone: "Eastern Standard Time",
    name: "Empire State Building Tickets, New York",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 3200,
    price: 44,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/df/NYC_Empire_State_Building.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    description:
      "Visit the world's most famous building and experience its 86th-floor open-air observatory.",
    highlights: [
      "Visit the Empire State Building and enjoy breathtaking city views from the 86th-floor open-air observatory, located 1,050 feet above street level, with iconic sights including Central Park, Times Square, Brooklyn Bridge, and the Statue of Liberty.",
      "Head to the 102nd-floor Top Deck, standing 1,250 feet above the city, and admire panoramic views through floor-to-ceiling glass windows stretching up to 80 miles on clear days.",
      "Explore the interactive museum galleries on the 2nd and 80th floors, showcasing the building’s fascinating construction, Art Deco architecture, and pop-culture legacy, including the iconic King Kong exhibit.",
      "Experience the limited-time \"Olympus Awaits\" Percy Jackson-themed takeover, available from November 16 to December 4, 2026, featuring an interactive Throne Room and themed photo opportunities.",
      "Admire the magnificent Fifth Avenue Art Deco Lobby, featuring restored gold-leaf ceiling murals and beautifully illuminated marble walls.",
    ],
    duration: "2 hours - 3 hours",
    openingHours: "Daily: 09:00 - 24:00",
  },
  {
    id: "dubai-burj",
    timezone: "Arabian Standard Time",
    name: "Burj Khalifa",
    location: "Dubai, UAE",
    city: "Dubai",
    region: "Asia",
    category: "Landmark",
    rating: 4.9,
    reviewsCount: 85000,
    price: 45,
    imageUrl:
      "https://climatecontrol.imiplc.com/_next/image?url=https%3A%2F%2Fcdn.tessa.imihy.eimed-project.de%2F621346%2FWeb_Header%2FBurj_Khalifa_Tower.webp&w=3840&q=75",
    isPopular: true,
    galleryUrls: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9d?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1580674205030-cf0fcf360089e?auto=format&fit=crop&q=85&w=1200",
    ],
    highlights: [
      "Enjoy breathtaking 360° views of Dubai and the Arabian Gulf from the 124th floor of Burj Khalifa, the world’s tallest building.",
      "Admire the intricate Mashrabiya designs on the 125th floor, celebrating Arabic art and culture.",
      "Experience a thrilling ride in one of the world’s fastest elevators, reaching the 124th floor in just 35 seconds.",
      "Witness stunning sunset views from the observation deck and capture unforgettable photographs.",
      "Enjoy an exclusive experience at the Sky Lounge on the 148th floor, with refreshing delicacies and spectacular views.",
    ],
  },
  {
    id: "swiss-titlis",
    timezone: "W. Europe Standard Time",
    name: "Mount Titlis Cable Car",
    location: "Engelberg, Switzerland",
    city: "Switzerland",
    region: "Other",
    category: "Nature",
    rating: 4.9,
    reviewsCount: 12500,
    price: 92,
    imageUrl:
      "https://thumbs.dreamstime.com/b/engelberg-switzerland-december-outside-views-infrastructure-ski-resort-december-popular-66304968.jpg?w=768",
    isPopular: true,
    description:
      "Experience the ultimate winter wonderland at Mount Titlis. Ride the worlds first revolving cable car, Titlis Rotair, to the summit at 3,020 meters. Walk across the Cliff Walk, Europes highest suspension bridge, and explore the Glacier Cave.",
    highlights: [
      "Book Mount Titlis cable car tickets and experience the world’s first revolving cable car, the TITLIS Rotair.",
      "Explore the Glacier Cave, featuring fascinating ice formations dating back thousands of years, 10 metres beneath the glacier.",
      "Enjoy a scenic boat ride on the beautiful mountain lake Trübsee and explore its surrounding attractions.",
      "Walk across the Titlis Cliff Walk, Europe’s highest suspension bridge, and admire breathtaking panoramic views of the Swiss Alps.",
    ],
    included: [
      "Round-trip cable car ride from Engelberg",
      "Access to Titlis Cliff Walk",
      "Entrance to Glacier Cave",
      "Ice Flyer chairlift (seasonal)",
    ],
    knowBeforeYouGo: [
      "Dress warmly even in summer.",
      "Average temperature at the summit is around 0°C.",
      "The experience takes at least 4-5 hours.",
      "Check the weather forecast before booking.",
    ],
    whatToBring: [
      "Warm jacket and layers",
      "Sunglasses and sunscreen",
      "Sturdy shoes",
      "Camera",
    ],
    duration: "5-6 hours",
    galleryUrls: [
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=85&w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1200",
    ],
    cancellationPolicy: "Free cancellation up to 48 hours in advance",
  },
  {
    id: "ams-heineken",
    timezone: "W. Europe Standard Time",
    name: "Heineken Experience: Standard Entrance",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Fun",
    rating: 4.6,
    reviewsCount: 2503,
    price: 23,
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/b9/02/65/heineken-experience-in.jpg?w=900&h=-1&s=1",
    isPopular: true,
    highlights: [
      "Enjoy a beer-tasting session at the Heineken Experience and discover the brand’s distinctive flavours and brewing craftsmanship.",
      "Explore historic brewing rooms and see authentic 18th-century machinery that reflects Heineken’s brewing heritage.",
      "Engage your senses by tasting, touching, and smelling the key ingredients used in the beer-making process.",
      "Have fun with interactive football and rugby games inspired by major sporting events sponsored by Heineken, including the UEFA Champions League and Rugby World Cup.",
      "Discover the rich history of Heineken and learn how the iconic brand has been crafting beer since 1864.",
    ],
  },
  {
    id: "ams-canal",
    productId: "8175978",
    timezone: "W. Europe Standard Time",
    name: "1-Hour Amsterdam Canal Cruise",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Cruise",
    rating: 4.3,
    reviewsCount: 1245,
    price: 29,
    discountPrice: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=1200",
    isPopular: true,
    galleryUrls: [
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1588698948796-031fbf1051fa?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1584003564941-616f20f48f53?auto=format&fit=crop&q=80&w=800",
    ],
    highlights: [
      "Enjoy a relaxing Amsterdam Canal Cruise and admire the city’s charming architecture, historic neighbourhoods, and scenic waterways from a unique perspective.",
      "Cruise along iconic canals, including Prinsengracht, Herengracht, and Keizersgracht, while soaking in Amsterdam’s beauty and history.",
      "Spot famous landmarks such as the Anne Frank House, Westerkerk, and the picturesque Skinny Bridge.",
      "Admire beautiful 17th-century merchant houses, historic churches, and other architectural gems that reflect Amsterdam’s rich heritage.",
      "Enhance your journey with an informative audio commentary available in 19 languages, offering fascinating insights into the city’s highlights and hidden gems.",
    ],
    description: "Enjoy a scenic 1-hour cruise through Amsterdam's historic canal belt with pre-booked tickets and panoramic views.",
    included: [
      "1-hour canal cruise ticket",
      "Audio commentary in multiple languages",
      "Free city audio guide map"
    ],
    duration: "1 hour",
    openingHours: "Daily: 09:30 - 21:00",
  },
  {
    id: "ams-keukenhof",
    timezone: "W. Europe Standard Time",
    name: "Keukenhof Gardens Entrance Ticket",
    location: "Lisse, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Nature",
    rating: 4.8,
    reviewsCount: 3200,
    price: 24,
    discountPrice: 19.60,
    imageUrl:
      "https://denhaag.com/sites/default/files/styles/og_image/public/2020-01/Keukenhof.jpg?h=3ec75680&itok=v2pdc0tg",
    isPopular: true,
    highlights: [
      "Enjoy last-minute priority entry to Keukenhof Gardens and stroll along scenic pathways surrounded by stunning tulip fields.",
      "Admire over 800 varieties of tulips and seven million blooming flowers spread across 32 hectares of beautiful gardens.",
      "Explore uniquely designed themed gardens, including the Organic Garden, Tropical Beach Garden, and Pink Tea Garden.",
      "Visit the Beatrix Pavilion to experience the vibrant Anthuriums and Orchids Show, featuring a colorful display of blooming plants.",
      "Discover traditional Dutch culture during the Holland Heritage Days, with live folk music, traditional craft demonstrations, and delicious regional cuisine.",
    ],
  },
  {
    id: "ams-madame-tussauds",
    timezone: "W. Europe Standard Time",
    name: "Madame Tussauds Amsterdam",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Entertainment",
    rating: 4.5,
    reviewsCount: 9800,
    price: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    highlights: [
      "Visit Madame Tussauds Amsterdam and get up close with lifelike wax figures of famous personalities from around the world.",
      "Explore eight themed zones, including A-List, Royals, Fashion, and Music.",
      "Pose with wax figures of global celebrities like Brad Pitt, Beyoncé, and Lady Gaga.",
      "Step into the Music Zone, experience a recording studio setup, and rock out on a stage alongside your favourite music stars.",
    ],
  },
  {
    id: "ams-efteling",
    timezone: "W. Europe Standard Time",
    name: "Efteling Theme Park Ticket",
    location: "Kaatsheuvel, Amsterdam Surroundings",
    city: "Amsterdam",
    region: "Europe",
    category: "Fun",
    rating: 4.9,
    reviewsCount: 45000,
    price: 48,
    imageUrl:
      "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&q=80&w=1080",
    isPopular: true,
    highlights: [
      "Experience the magical fairytale atmosphere of Efteling Theme Park.",
      "Enjoy thrilling rides, exciting attractions, and enchanting surroundings.",
      "Discover sparkling lights, icy entertainment, and cosy bonfires.",
      "Feel the adrenaline on Joris en de Draak, the thrilling dual-track wooden roller coaster.",
    ],
  },
  {
    id: "paris-orsay",
    timezone: "Romance Standard Time",
    name: "Musée d'Orsay: Skip-the-line Admission",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "Museum",
    rating: 4.8,
    reviewsCount: 14200,
    price: 16,
    imageUrl:
      "https://www.hotellesdamesdupantheon.com/uploads/images/monuments/musee.jpg",
    isPopular: true,
    description:
      "Breathtaking collections of Impressionist and Post-Impressionist masterpieces housed in a grand former railway station.",
    highlights: [
      "Secure last-minute entry to the Musée d’Orsay and explore its world-famous Impressionist and Post-Impressionist collections.",
      "Admire iconic masterpieces by renowned artists like Monet, Van Gogh, Renoir, and Manet.",
      "Discover exquisite 19th-century sculptures created by celebrated artists.",
      "Explore the museum’s stunning architecture, housed in a former grand railway station.",
      "Marvel at the magnificent glass ceiling and intricate ironwork that make the building an architectural masterpiece.",
    ],
    included: [
      "Skip-the-line admission ticket",
      "Access to permanent collections",
      "Access to temporary exhibitions",
    ],
    duration: "2-3 hours",
    openingHours: "Tue-Sun: 09:30 - 18:00 (Thu until 21:45)",
  },
  {
    id: "par-disney",
    timezone: "Romance Standard Time",
    name: "Disneyland® Paris: 1-Day Ticket",
    location: "Marne-la-Vallée, France",
    city: "Paris",
    region: "Europe",
    category: "Fun",
    rating: 4.7,
    reviewsCount: 85400,
    price: 62,
    imageUrl:
      "https://news.disneylandparis.com//app/uploads/2022/04/N037009-scaled.jpg",
    isPopular: true,
    description:
      "Experience the magic of Disney with world-class rides, spectacular parades, and meet-and-greets with your favorite characters.",
    highlights: [
      "Visit Disneyland Paris and explore its two magical parks, featuring 50+ attractions, thrilling rides, spectacular shows, and unforgettable experiences.",
      "Step into a fairy tale at the iconic Sleeping Beauty Castle, surrounded by beautiful gardens.",
      "Experience thrilling adventures in Adventureland, including Pirates of the Caribbean, Indiana Jones, and Aladdin’s Enchanted Passage.",
      "Explore Fantasyland and enjoy classic attractions like Peter Pan’s Flight, Dumbo the Flying Elephant, and It’s a Small World.",
      "Book your Disneyland Paris tickets and enjoy magical meet-and-greet sessions with Mickey Mouse, Minnie Mouse, Elsa, and other beloved Disney characters.",
    ],
    included: ["1-day admission ticket", "Access to attractions and shows"],
    duration: "Full day",
    openingHours: "Daily: 09:30 - 21:00",
  },
  {
    id: "par-eiffel",
    timezone: "Romance Standard Time",
    name: "Eiffel Tower: Second Floor or Summit Access",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "Landmark",
    rating: 4.8,
    reviewsCount: 125000,
    price: 18,
    discountPrice: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    isPopular: true,
    description:
      "The global icon of France and one of the most recognizable structures in the world, offering unparalleled views of Paris.",
    highlights: [
      "Get your Eiffel Tower Second Floor Tickets and explore this iconic symbol of romance.",
      "Climb the stairs to the 2nd floor and enjoy breathtaking views of the Seine, Notre-Dame, the Louvre, and Sacré-Cœur.",
      "Discover the tower’s fascinating history, architecture, and construction through engaging exhibits.",
      "Capture stunning photos of the Paris skyline from the open deck and experience the magic of the City of Lights.",
    ],
    included: ["Admission ticket", "Elevator access"],
    duration: "2 hours",
    openingHours: "Daily: 09:30 - 23:45",
  },
  {
    id: "par-sainte-pantheon",
    timezone: "Romance Standard Time",
    name: "Sainte-Chapelle, Conciergerie & Panthéon Combo",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "History",
    rating: 4.9,
    reviewsCount: 22000,
    price: 35,
    imageUrl:
      "https://www.franceguide.info/wp-content/uploads/sites/18/paris-saint-chapelle-stained-glass-hd.jpg",
    isPopular: true,
    description:
      "Explore three of Paris's most significant historical monuments with this combined experience.",
    highlights: [
      "Explore Sainte-Chapelle, a historic masterpiece of French Gothic architecture.",
      "Admire stunning stained-glass windows depicting intricate biblical scenes.",
      "Marvel at soaring ceilings, delicate tracery, and detailed stone carvings.",
      "Discover its royal history and connection to the Crown of Thorns relic.",
      "Secure last-minute entry tickets for a hassle-free visit.",
    ],
    included: ["Combined admission ticket", "Digital audio guides"],
    duration: "4-5 hours",
    openingHours: "Varies by monument (typically 10:00 - 18:00)",
  },
  {
    id: "par-orangerie",
    timezone: "Romance Standard Time",
    name: "Musée de l'Orangerie: Water Lilies Ticket",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "Museum",
    rating: 4.9,
    reviewsCount: 12000,
    price: 13,
    imageUrl:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=1080",
    isPopular: true,
    description:
      "The permanent home of Claude Monet's monumental Water Lilies series, located in a former orangery.",
    highlights: [
      "Secure last-minute entry tickets to the Orangerie Museum and explore its remarkable art collections.",
      "Immerse yourself in Monet’s iconic Water Lilies displayed in specially designed oval galleries.",
      "Discover masterpieces by Impressionist and Post-Impressionist artists and learn about their revolutionary techniques.",
      "Explore curated exhibitions, interactive displays, and digital art installations.",
      "Join guided tours for fascinating insights into Impressionism and the museum’s artistic treasures.",
    ],
    included: [
      "Admission ticket",
      "Access to permanent and temporary exhibitions",
    ],
    duration: "1.5 hours",
    openingHours: "Wed-Mon: 09:00 - 18:00 (Closed Tuesdays)",
  },
  {
    id: "par-rodin",
    timezone: "Romance Standard Time",
    name: "Musée Rodin: Entrance Ticket",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "Museum",
    rating: 4.8,
    reviewsCount: 15000,
    price: 14,
    imageUrl:
      "https://accidentallywesanderson.com/wp-content/uploads/2020/04/Musee_Rodin.jpeg",
    isPopular: true,
    description:
      "Dedicated to the sculpture of Auguste Rodin, housed in the beautiful Hôtel Biron and its magnificent gardens.",
    highlights: [
      "Explore the Rodin Museum and admire the remarkable creations of renowned French sculptor Auguste Rodin.",
      "Discover over 6,000 sculptures made from bronze, wax, plaster, and other materials.",
      "Stroll through the Sculpture Garden and admire iconic masterpieces like The Thinker, The Kiss, Thought, and Fugit Amor.",
      "View Rodin’s paintings, sketches, photographs, letters, and models to understand his creative process and artistic influences.",
      "Discover works by Camille Claudel, Vincent van Gogh, and other celebrated artists through the museum’s diverse collections.",
      "Admire notable paintings, including Père Tanguy, Belle-Île, and Golden Twilight on the Dunes.",
    ],
    included: ["Admission to the museum and gardens"],
    duration: "2 hours",
    openingHours: "Tue-Sun: 10:00 - 18:30 (Closed Mondays)",
  },
  {
    id: "par-aquarium",
    timezone: "Romance Standard Time",
    name: "Aquarium de Paris: Entrance Ticket",
    location: "Paris, France",
    city: "Paris",
    region: "Europe",
    category: "Entertainment",
    rating: 4.5,
    reviewsCount: 8200,
    price: 26,
    imageUrl:
      "https://kimini.fr/wp-content/uploads/2024/07/aquarium-de-paris-1.webp",
    isPopular: true,
    description:
      "Explore the wonders of the ocean in the heart of Paris, featuring the largest shark tank in France.",
    highlights: [
      "Explore L’Aquarium de Paris and discover over 13,000 fish and invertebrates from across the globe.",
      "Visit the Medusarium, Europe’s largest jellyfish exhibit, and watch these fascinating creatures glide gracefully through the water.",
      "Encounter incredible marine life, including 38 sharks, 700 coral colonies, and 2,500 jellyfish.",
      "Enjoy educational films, live shows, interactive exhibits, and workshops to learn more about ocean conservation.",
      "Get hands-on at the caress pool, where you can gently interact with goldfish, Koi carp, and Ide.",
      "Dine at the aquarium’s restaurant overlooking an impressive 650,000-litre marine tank.",
    ],
    included: ["Admission ticket", "Access to all exhibits and shows"],
    duration: "2 hours",
    openingHours: "Daily: 10:00 - 19:00",
  },
  {
    id: "ams-moco",
    timezone: "W. Europe Standard Time",
    name: "Moco Museum Amsterdam",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Museum",
    rating: 4.7,
    reviewsCount: 8500,
    price: 19.5,
    imageUrl:
      "https://dutchwannabe.com/wp-content/uploads/2019/05/moco-museum.jpg",
    isPopular: true,
    highlights: [
      "Explore the museum’s permanent collection featuring diverse artworks by contemporary artists.",
      "Join a guided museum tour to discover fascinating exhibits and gain deeper insights into the artworks.",
      "Visit temporary exhibitions showcasing specialised collections, paintings, and artistic themes.",
      "Explore nearby museums and cultural attractions for a fulfilling day of sightseeing.",
      "Enjoy a scenic city cruise and discover the city’s iconic landmarks from the water.",
    ],
  },
  {
    id: "ams-nemo",
    timezone: "W. Europe Standard Time",
    name: "NEMO Science Museum",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Museum",
    rating: 4.6,
    reviewsCount: 11000,
    price: 17.5,
    imageUrl:
      "https://www.amsterdamtips.com/news/wp-content/uploads/2019/01/nemo-science-museum.jpg",
    isPopular: true,
    highlights: [
      "Visit NEMO Science Museum, the largest science museum in the Netherlands, housed in a striking ship-shaped building.",
      "Explore five floors of interactive exhibitions, hands-on experiments, live demonstrations, and educational shows for all ages.",
      "Discover fascinating topics ranging from biology, physics, chemistry, and technology to space, renewable energy, and sociology.",
      "Head to the NEMO rooftop terrace, the highest city square in Amsterdam, for stunning panoramic views.",
      "Enjoy a meal at the museum’s restaurants and snack bars, and browse the gift shop for unique souvenirs.",
    ],
  },
  {
    id: "ams-palace",
    timezone: "W. Europe Standard Time",
    name: "Royal Palace Amsterdam",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "Landmark",
    rating: 4.7,
    reviewsCount: 9200,
    price: 12.5,
    imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    highlights: [
      "Visit the Royal Palace of Amsterdam, located in the heart of the city at the iconic Dam Square.",
      "Admire its magnificent architecture, grand interiors, and elaborate decorative details.",
      "Discover its fascinating history as Amsterdam’s former Town Hall, once celebrated as the “eighth wonder of the world.”",
      "Join a guided tour to uncover intriguing stories and historical secrets behind the palace walls.",
      "Explore nearby landmarks, including Dam Square and Nieuwe Kerk, a beautiful 15th-century church.",
    ],
  },
  {
    id: "ams-anne-frank",
    timezone: "W. Europe Standard Time",
    name: "Anne Frank House",
    location: "Amsterdam, Netherlands",
    city: "Amsterdam",
    region: "Europe",
    category: "History",
    rating: 4.9,
    reviewsCount: 45000,
    price: 16,
    imageUrl:
      "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description: "Visit the authentic hiding place where Anne Frank wrote her world-famous diary during World War II.",
    highlights: [
      "Get last-minute tickets to explore the historic Anne Frank House.",
      "Enjoy hassle-free entry and avoid long queues.",
      "Combine your visit with a guided tour of Amsterdam’s Jewish Quarter.",
      "Enhance your experience with a scenic Amsterdam canal cruise.",
      "Pair your visit with a 1-day nightlife pass for bars and events.",
    ],
    included: ["Admission ticket", "Audio guide"],
    duration: "1.5 hours",
    openingHours: "Daily: 09:00 - 22:00",
  },
  {
    id: "lis-oceanarium",
    timezone: "GMT Standard Time",
    name: "Lisbon Oceanarium: Entry Ticket",
    location: "Lisbon, Portugal",
    city: "Lisbon",
    region: "Europe",
    category: "Nature",
    rating: 4.8,
    reviewsCount: 32100,
    price: 25,
    imageUrl:
      "https://d3w13n53foase7.cloudfront.net/medium_https%3A//live.staticflickr.com/8806/16505924243_9294b1f883_b.jpg_image.jpg",
    isPopular: true,
    description:
      "Explore the spectacular Lisbon Oceanarium, one of the world’s largest and most acclaimed aquariums, featuring a central tank with diverse global marine life.",
    highlights: [
      "Discover 8,000+ marine creatures across 500 species at Lisbon Oceanarium.",
      "Explore four ocean habitats, from the Atlantic to the Tropical Indian Ocean.",
      "Admire sharks, coral reefs, sea otters, and fascinating marine life.",
      "Experience immersive exhibitions like ONE, The Sea as You've Never Felt It.",
      "Spot dolphins on a Tagus River boat trip with a marine biologist.",
    ],
    included: [
      "Admission ticket to the permanent exhibition",
      "Access to global habitats and oceans",
    ],
    duration: "2-3 hours",
    openingHours: "Daily: 10:00 - 20:00",
  },
  {
    id: "ath-acropolis",
    timezone: "GTB Standard Time",
    name: "Acropolis of Athens: Fast Track Ticket",
    location: "Athens, Greece",
    city: "Athens",
    region: "Europe",
    category: "History",
    rating: 4.8,
    reviewsCount: 48900,
    price: 20,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/65/Parthenon_east_side_Acropolis_Athens%2C_Greece.jpg",
    isPopular: true,
    description:
      "Travel back in time to Ancient Greece and explore the world-famous Acropolis hill, featuring the Parthenon, the Temple of Athena Nike, and spectacular views of Athens.",
    highlights: [
      "Enjoy breathtaking panoramic views of Athens from the Acropolis.",
      "Explore iconic landmarks like the Parthenon, Propylaea, and Erechtheion.",
      "Skip long queues with convenient advance-entry tickets.",
      "Discover Greek mythology, art, and ancient history.",
      "Explore historic landmarks with combined entry tickets.",
      "Enhance your visit with expert-guided tours.",
    ],
    included: [
      "Skip-the-line entrance ticket to the Acropolis",
      "Access to the surrounding archaeological sites",
    ],
    duration: "2 hours",
    openingHours: "Daily: 08:00 - 20:00",
  },
  {
    id: "flo-accademia",
    timezone: "W. Europe Standard Time",
    name: "Accademia Gallery Florence: Skip-the-line Ticket",
    location: "Florence, Italy",
    city: "Florence",
    region: "Europe",
    category: "Arts",
    rating: 4.8,
    reviewsCount: 22400,
    price: 21,
    imageUrl:
      "https://www.througheternity.com/wp-content/uploads/2025/10/florence_accademia_gallery_3-768x614.jpg",
    isPopular: true,
    description:
      "Marvel at Michelangelo's iconic masterwork, David, along with other iconic Renaissance sculptures and paintings at the renowned Accademia Gallery in Florence.",
    highlights: [
      "Get last-minute entry tickets to Florence’s iconic Accademia Gallery.",
      "Admire Michelangelo’s masterpiece, the 17-foot-tall statue of David.",
      "Explore stunning paintings and sculptures by Renaissance masters.",
      "Discover how the Renaissance transformed European art and culture.",
      "Immerse yourself in Florence’s rich artistic heritage and history.",
    ],
    included: [
      "Fast-track admission ticket",
      "Access to all temporary exhibitions",
    ],
    duration: "1.5 hours",
    openingHours: "Tue-Sun: 08:15 - 18:50 (Closed Mondays)",
  },
  {
    id: "dxb-miracle",
    timezone: "Arabian Standard Time",
    name: "Dubai Miracle Garden Admission Ticket",
    location: "Dubai, UAE",
    city: "Dubai",
    region: "Asia",
    category: "Nature",
    rating: 4.7,
    reviewsCount: 16500,
    price: 22,
    imageUrl:
      "https://i.ytimg.com/vi/nEjr5xlZ6OU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD2KQGGgdRoN9A8acRIer5bZonamg",
    isPopular: true,
    description:
      "Explore the Dubai Miracle Garden, the world’s largest natural flower garden, boasting over 150 million blooming flowers arranged in colorful, breathtaking structures.",
    highlights: [
      "Book Dubai Miracle Garden tickets and explore the world’s largest natural flower garden, spread across 72,000 sq. metres.",
      "Wander among over 150 million blooming flowers arranged in stunning floral displays.",
      "Marvel at the Guinness World Record-breaking Emirates A380 floral installation, decorated with over 500,000 fresh flowers and plants.",
      "Visit Smurfs Village, featuring colourful landscape displays across four immersive zones.",
      "Explore the Butterfly Garden, home to 15,000 butterflies housed in 10 custom-built domes.",
    ],
    included: ["General admission ticket to Dubai Miracle Garden"],
    duration: "2-3 hours",
    openingHours: "Daily: 09:00 - 21:00",
  },
  {
    id: "sin-zoo",
    timezone: "Singapore Standard Time",
    name: "Singapore Zoo Tickets with Tram Ride",
    location: "Mandai Wildlife Reserve, Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Nature",
    rating: 4.8,
    reviewsCount: 19800,
    price: 32,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKKB32azMHznB_lzpBBW9Zh5C4Cghk8E5SLA&s",
    isPopular: true,
    description:
      "Visit the world-acclaimed open-concept Singapore Zoo, featuring lush rainforest environments housing over 4,200 animals of 300 diverse species.",
    highlights: [
      "Book Singapore Night Safari tickets and explore the world’s first nocturnal wildlife park, home to over 4,200 animals across 130 species.",
      "Enjoy a guided tram ride through seven geographical zones, spotting elephants, zebras, anteaters, and more in naturalistic habitats.",
      "Discover themed walking trails, including the Fishing Cat and Leopard Trails, for up-close encounters with fascinating wildlife.",
      "Watch the entertaining Creatures of the Night show, featuring otters, civets, and other nocturnal animals.",
      "Experience thrilling fire performances while learning about the Night Safari’s heritage and conservation efforts.",
    ],
    included: [
      "One-day admission ticket to Singapore Zoo",
      "Unlimited standard hop-on tram ride with audio",
    ],
    duration: "3-4 hours",
    openingHours: "Daily: 08:30 - 18:00",
  },
  {
    id: "ny-summit",
    timezone: "Eastern Standard Time",
    name: "SUMMIT One Vanderbilt Admission Ticket",
    location: "New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Observation Deck",
    rating: 4.8,
    reviewsCount: 26300,
    price: 43,
    imageUrl:
      "https://antisocialtourist.com/wp-content/uploads/2023/01/What-to-Expect-at-SUMMIT-One-Vanderbilt-Tickets.jpg",
    isPopular: true,
    description:
      "Step into a multi-sensory immersive experience designed by Kenzo Digital that completely redefines the New York City viewing platform.",
    highlights: [
      "Grab last-minute tickets to explore SUMMIT One Vanderbilt.",
      "Discover immersive art installations and interactive exhibits.",
      "Enjoy 360° panoramic views of New York City.",
      "Walk across a glass-floor deck 1,100 feet above Manhattan.",
      "Capture stunning skyline views and unforgettable photos.",
    ],
    included: [
      "Timed entry admission ticket",
      "Access to all immersive observation decks",
    ],
    duration: "2 hours",
    openingHours: "Daily: 09:00 - 00:00",
  },
  {
    id: "lon-eye-entry",
    timezone: "GMT Standard Time",
    name: "London Eye Entry Ticket",
    location: "London, United Kingdom",
    city: "London",
    region: "Europe",
    category: "Observation Decks",
    rating: 4.6,
    reviewsCount: 15420,
    price: 35.0,
    discountPrice: 32.0,
    imageUrl:
      "https://www.londoneye.com/media/h5gpgkf2/712a7392w.jpg?format=jpg",
    isPopular: true,
    description:
      "Enjoy breathtaking 360-degree views of London from the iconic London Eye, Europe's tallest cantilevered observation wheel.",
    highlights: [
      "Book London Eye tickets and enjoy a 30-minute ride on Europe’s iconic observation wheel, standing 135 metres tall.",
      "Experience breathtaking panoramic views of London from a spacious glass observation pod.",
      "Spot famous landmarks, including Big Ben, the Houses of Parliament, and Buckingham Palace, from above.",
    ],
    included: ["Standard admission to the London Eye", "30-minute rotation"],
    duration: "30 minutes",
    openingHours: "Daily: 10:00 - 20:30",
  },
  {
    id: "lon-tower-crown-jewels",
    timezone: "GMT Standard Time",
    name: "Tower of London: Home to the Crown Jewels - Admission",
    location: "London, United Kingdom",
    city: "London",
    region: "Europe",
    category: "Historic Sites",
    rating: 4.8,
    reviewsCount: 22105,
    price: 34.8,
    imageUrl:
      "https://static.wixstatic.com/media/099728_c9379f2308ae48c9a0b77e7da72b6d47~mv2_d_4989_3326_s_4_2.jpeg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/099728_c9379f2308ae48c9a0b77e7da72b6d47~mv2_d_4989_3326_s_4_2.jpeg",
    isPopular: true,
    description:
      "Explore the historic Tower of London, a UNESCO World Heritage site, and marvel at the world-famous Crown Jewels.",
    highlights: [
      "Explore the Tower of London, a UNESCO World Heritage Site rich in royal history.",
      "Admire royal treasures, including crowns and the famous Imperial State Crown.",
      "Discover the Bloody Tower and Traitors’ Gate, steeped in fascinating prison history.",
      "Visit the White Tower, showcasing medieval weapons, armour, and the Chapel of St. John.",
      "Enjoy fascinating stories of royal scandals and executions with the Yeoman Warders (Beefeaters).",
    ],
    included: [
      "Admission to the Tower of London",
      "Access to the Crown Jewels exhibition",
      "White Tower entry",
    ],
    duration: "2-3 hours",
    openingHours: "Daily: 09:00 - 17:30",
  },
  {
    id: "lon-tower-bridge",
    timezone: "GMT Standard Time",
    name: "Tower Bridge London General Admission Ticket",
    location: "London, United Kingdom",
    city: "London",
    region: "Europe",
    category: "Monuments",
    rating: 4.7,
    reviewsCount: 18450,
    price: 13.4,
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800",
    isPopular: false,
    description:
      "Step inside London's most famous bridge and experience the stunning glass floor walkway with views of the Thames below.",
    highlights: [
      "Visit London’s iconic Tower Bridge, one of the city’s most famous landmarks and historic river crossings.",
      "Enjoy breathtaking panoramic views of the London skyline from the 43-metre-high glass-floor walkway.",
      "Explore the Tower Bridge Exhibition and discover fascinating stories about the bridge’s history, architecture, and cultural significance.",
      "Get a closer look at the original Victorian steam engines that once powered the bridge’s lifting mechanism.",
    ],
    included: [
      "General admission to Tower Bridge",
      "Access to the Glass Floor and Walkways",
      "Entry to the Victorian Engine Rooms",
    ],
    duration: "1-2 hours",
    openingHours: "Daily: 09:30 - 18:00",
  },
  {
    id: "sd-zoo",
    timezone: "Pacific Standard Time",
    name: "San Diego Zoo",
    location: "San Diego, California, USA",
    city: "San Diego",
    region: "The Americas",
    category: "Zoos & Aquariums",
    rating: 4.8,
    reviewsCount: 15420,
    price: 74.0,
    imageUrl:
      "https://www.sandiegouniontribune.com/wp-content/uploads/2025/03/sut-l-zoo-babies-007.jpg?w=1800&resize=1800,1800",
    isPopular: true,
    description:
      "Explore the world-famous San Diego Zoo, home to over 4,000 rare and endangered animals representing more than 800 species and subspecies.",
    highlights: [
      "Book San Diego Zoo tickets and explore its 100-acre wildlife park, home to over 3,700 animals across 650 species.",
      "Visit Panda Canyon to see giant pandas and learn about the zoo’s panda conservation efforts.",
      "Discover themed habitats, including Africa Rocks, Urban Jungle, and Asian Passage, featuring animals from around the world.",
      "Enjoy breathtaking panoramic views of the zoo and its surroundings on the Skyfari Aerial Tram, soaring 89 feet above the ground.",
    ],
    included: [
      "1-Day Admission to the San Diego Zoo",
      "Unlimited use of the Guided Bus Tour",
      "Unlimited use of the Kangaroo Express Bus",
      "Skyfari Aerial Tram",
    ],
    duration: "Full day",
    openingHours: "Daily: 09:00 - 18:00",
  },
  {
    id: "sd-safari-park",
    timezone: "Pacific Standard Time",
    name: "San Diego Zoo Safari Park",
    location: "Escondido, California, USA",
    city: "San Diego",
    region: "The Americas",
    category: "Zoos & Aquariums",
    rating: 4.7,
    reviewsCount: 12105,
    price: 74.0,
    imageUrl:
      "https://images.unsplash.com/photo-1549472393-5ce25eb5fbdb?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    description:
      "Experience an expansive wildlife sanctuary that is home to more than 3,000 animals representing more than 300 species. Its 1,800 acres are widely known for having large, open-field enclosures.",
    highlights: [
      "Enjoy the Africa Tram tour at San Diego Zoo Safari Park and discover over 3,000 animals and 1,500 plant varieties.",
      "Explore vast African savanna-inspired habitats home to more than 300 animal species.",
      "Get up-close views of incredible wildlife, including rhinoceroses, tigers, elephants, and giraffes.",
      "Observe majestic lion prides and towering giraffes reaching for leaves high above the ground.",
      "Learn about wildlife conservation and animal welfare through the park’s Conservation Corps and guided educational experiences.",
    ],
    included: [
      "1-Day Admission to the San Diego Zoo Safari Park",
      "Africa Tram",
      "Cheetah Run viewing",
    ],
    duration: "Full day",
    openingHours: "Daily: 09:00 - 17:00",
  },
  {
    id: "sd-uss-midway",
    timezone: "Pacific Standard Time",
    name: "USS Midway Museum",
    location: "San Diego, California, USA",
    city: "San Diego",
    region: "The Americas",
    category: "Museums",
    rating: 4.9,
    reviewsCount: 20450,
    price: 34.0,
    imageUrl:
      "https://www.destinationsdetoursdreams.com/wp-content/uploads/2018/05/uss-midway.jpg",
    isPopular: true,
    description:
      "Step aboard the USS Midway, the longest-serving US Navy aircraft carrier of the 20th century. Explore more than 60 exhibits with a collection of 29 restored aircraft.",
    highlights: [
      "Explore a historic WWII aircraft carrier museum and discover its naval history.",
      "Visit the engine rooms, jail, restrooms, and over 60 fascinating exhibits.",
      "Listen to audio stories narrated by former sailors.",
      "Discover the experiences of approximately 200,000 sailors who served aboard.",
      "Admire restored WWII aircraft and enjoy interactive exhibits and the Battle of Midway Theater.",
    ],
    included: [
      "Admission to the USS Midway Museum",
      "Self-guided audio tour",
      "Access to all exhibits and aircraft",
    ],
    duration: "3-4 hours",
    openingHours: "Daily: 10:00 - 17:00",
  },
  {
    id: "ny-amnh",
    timezone: "Eastern Standard Time",
    name: "American Museum of Natural History",
    location: "New York City, New York, USA",
    city: "New York",
    region: "The Americas",
    category: "Museums",
    rating: 4.7,
    reviewsCount: 18900,
    price: 28.0,
    imageUrl:
      "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&q=80&w=800",
    isPopular: true,
    description:
      "Discover the natural world and the known universe at the American Museum of Natural History, featuring the famous dinosaur halls and a giant blue whale model.",
    highlights: [
      "Explore the American Museum of Natural History, home to over 34 million specimens showcasing biodiversity, cultural heritage, and cosmic wonders.",
      "Discover the famous Dinosaur Halls, featuring impressive fossils of Tyrannosaurus Rex, Triceratops, and other prehistoric giants.",
      "Marvel at the enormous Blue Whale model suspended in the Milstein Hall of Ocean Life.",
      "Learn about human evolution and our origins at the Hall of Human Origins.",
      "Visit the Rose Center for Earth and Space and enjoy fascinating shows at the Hayden Planetarium.",
    ],
    included: [
      "General Admission to the museum",
      "Access to all 45 permanent exhibition halls",
      "Access to the Rose Center for Earth and Space",
    ],
    duration: "3-5 hours",
    openingHours: "Daily: 10:00 - 17:30",
  },
  {
    id: "bkk-safari-world",
    timezone: "SE Asia Standard Time",
    name: "Safari World Bangkok Tickets",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.6,
    reviewsCount: 15200,
    price: 35.0,
    discountPrice: 28.0,
    imageUrl:
      "https://img.avianexperiences.com/attractions/a42af5a9-17eb-4982-88d4-6f21876e2799",
    isPopular: true,
    description:
      "Explore Thailand's greatest open zoo and leisure park that offers a great variety of entertainment for everyone.",
    highlights: [
      "Explore Safari World Bangkok, featuring two exciting attractions: Safari Park and Marine Park, with unforgettable wildlife encounters.",
      "Drive through Safari Park to spot lions, tigers, giraffes, and other exotic animals roaming freely.",
      "Enjoy the spectacular Dolphin Show, featuring impressive jumps, tricks, and acrobatic performances.",
      "Watch the entertaining Sea Lion Show and see these intelligent animals showcase their amazing skills.",
      "Experience the Wild West Stunt Show, featuring thrilling cowboy performances and action-packed stunts.",
    ],
    included: ["Admission ticket", "Access to shows"],
    duration: "Full day",
    openingHours: "Daily: 09:00 - 17:00",
  },
  {
    id: "pat-underwater-world",
    timezone: "SE Asia Standard Time",
    name: "Underwater World Pattaya Tickets",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.4,
    reviewsCount: 8400,
    price: 20.0,
    discountPrice: 15.0,
    imageUrl:
      "https://www.agoda.com/wp-content/uploads/2024/09/aquarium-featured-1244x700.jpg",
    isPopular: false,
    description:
      "Discover a rich variety of marine life with a walk through the glass tunnel at Underwater World Pattaya.",
    highlights: [
      "Walk through the spectacular underwater glass tunnel and enjoy 360-degree views of sharks, rays, and colourful fish swimming all around you.",
      "Explore themed marine zones, including the Coral Reef and Tropical Sea, showcasing diverse aquatic ecosystems and fascinating marine life.",
      "Discover over 5,000 marine species, including vibrant fish, sea turtles, and majestic rays, while learning about marine conservation.",
      "Get a thrilling close-up look at different shark species, including Blacktip Reef and Nurse Sharks, at the exciting Shark Tank.",
      "Visit the Seahorse Kingdom and observe fascinating seahorse species while learning more about these unique marine creatures.",
    ],
    included: ["Admission ticket"],
    duration: "2-3 hours",
    openingHours: "Daily: 09:00 - 18:00",
  },
  {
    id: "pat-dolphinarium",
    timezone: "SE Asia Standard Time",
    name: "Pattaya Dolphinarium Tickets",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Shows & Events",
    rating: 4.8,
    reviewsCount: 4200,
    price: 30.0,
    discountPrice: 25.0,
    imageUrl:
      "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&q=80&w=1080",
    isPopular: true,
    description:
      "Enjoy a spectacular show featuring intelligent dolphins and seals at Pattaya Dolphinarium.",
    highlights: [
      "Visit Pattaya Dolphinarium and enjoy an entertaining show featuring impressive dolphin and seal performances.",
      "Marvel at their incredible tricks, stunts, and acrobatic displays showcasing their agility and intelligence.",
      "Get an up-close look at these fascinating marine animals and learn more about their behaviour and natural habitats.",
      "Choose from Regular, Deluxe, or VIP seating options for a comfortable experience with great views of the show.",
    ],
    included: ["Admission ticket", "Dolphin show"],
    duration: "1 hour",
    openingHours: "Daily: 10:00 - 18:00",
  },
  {
    id: "bkk-sealife",
    timezone: "SE Asia Standard Time",
    name: "SEA LIFE Ocean World Tickets, Bangkok",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.7,
    reviewsCount: 18500,
    price: 45.0,
    discountPrice: 38.0,
    imageUrl:
      "https://storage.googleapis.com/firstmithu/Activities/Bangkok/sealife.jpeg",
    isPopular: true,
    description:
      "Explore one of the largest aquariums in Southeast Asia located beneath the Siam Paragon mall.",
    highlights: [
      "Discover over 400 marine species, from vibrant tropical fish to rare deep-sea creatures, in naturalistic habitats.",
      "Marvel at the Giant Ocean Tank, holding 2.5 million litres of water and home to a diverse range of marine life.",
      "Enjoy an immersive 4D movie featuring special effects like water sprays, wind, and scents.",
      "Watch exciting feeding sessions and learn about marine animals' behaviour and feeding habits.",
      "Walk through SEA LIFE’s spectacular 270-degree underwater glass tunnel, surrounded by sharks, rays, and colourful fish.",
    ],
    included: ["Admission ticket"],
    duration: "2-3 hours",
    openingHours: "Daily: 10:00 - 20:00",
  },
  {
    id: "bkk-mahanakhon",
    timezone: "SE Asia Standard Time",
    name: "Mahanakhon Skywalk Tickets, Bangkok",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Observation Decks",
    rating: 4.8,
    reviewsCount: 12300,
    price: 32.0,
    discountPrice: 28.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeae4WOLABD6_lzWhgwN2IYcWkeh0GVJ3oBiHlo1CokM-8UtloLFNNv24Q&s=10",
    isPopular: true,
    description:
      "Experience spectacular 360-degree panoramic views of Bangkok from Thailand's highest observation deck.",
    highlights: [
      "Visit King Power Mahanakhon, Thailand’s iconic 314-metre-tall skyscraper and one of Bangkok’s most famous landmarks.",
      "Experience the thrill of walking across the glass floor, suspended 310 metres above the city.",
      "Enjoy breathtaking panoramic views of Bangkok from the indoor and outdoor observation decks.",
      "Explore interactive displays and exhibits showcasing Bangkok’s history, culture, and iconic landmarks.",
    ],
    included: ["Admission ticket", "Glass tray access"],
    duration: "1-2 hours",
    openingHours: "Daily: 10:00 - 19:00",
  },
  {
    id: "hkt-fantasea",
    timezone: "SE Asia Standard Time",
    name: "Phuket Fantasea Tickets",
    location: "Phuket, Thailand",
    city: "Phuket",
    region: "Asia",
    category: "Shows & Events",
    rating: 4.6,
    reviewsCount: 14200,
    price: 55.0,
    discountPrice: 45.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn9jovHjbCiKIW_CJY_URQGh8niw_eTo7P_Uv1ksGqnPd-qv0dyFKYyZxR&s=10",
    isPopular: true,
    description:
      "Experience the ultimate Thai cultural theme park with a spectacular theatrical show and grand buffet.",
    highlights: [
      "Visit Phuket FantaSea at Kamala Beach and experience Thailand’s rich culture through spectacular shows and attractions.",
      "Enjoy a dazzling Las Vegas-style theatrical performance combining traditional Thai culture with modern technology.",
      "Indulge in a delicious dining experience at the Golden Kinnaree Buffet Restaurant, featuring a variety of Thai and international cuisines.",
      "Explore the vibrant Carnival Village, filled with exciting games, street performances, and souvenir shops.",
      "Discover Thailand’s heritage through cultural exhibits showcasing traditional arts, crafts, and historical artefacts.",
    ],
    included: ["Admission ticket", "Show ticket"],
    duration: "4-5 hours",
    openingHours: "Tue-Sun: 17:30 - 23:30",
  },
  {
    id: "hkt-andamanda",
    timezone: "SE Asia Standard Time",
    name: "Andamanda Waterpark Tickets, Phuket",
    location: "Phuket, Thailand",
    city: "Phuket",
    region: "Asia",
    category: "Theme Parks",
    rating: 4.7,
    reviewsCount: 6500,
    price: 48.0,
    discountPrice: 40.0,
    imageUrl:
      "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&q=80&w=1200",
    galleryUrls: [
      "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800"
    ],
    isPopular: true,
    description:
      "Enjoy a splash-tastic day out at Phuket's largest water park featuring thrilling rides and a massive wave pool.",
    highlights: [
      "Explore Andamanda Phuket’s exciting zones, including Rainbow Slide Tower and Wave Pool, offering fun-filled aquatic adventures.",
      "Feel the adrenaline rush on high-speed Speed Slides featuring steep drops and thrilling descents.",
      "Challenge your friends and family on the Multi-Lane Racer and race side by side to the finish line.",
      "Enjoy the park’s beautiful tropical surroundings, lush greenery, exotic plants, and picturesque views for a refreshing getaway.",
    ],
    included: ["Admission ticket"],
    duration: "Full day",
    openingHours: "Daily: 10:00 - 19:00",
  },
  {
    id: "pat-ramayana",
    timezone: "SE Asia Standard Time",
    name: "Ramayana Water Park Tickets, Pattaya",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Theme Parks",
    rating: 4.7,
    reviewsCount: 8200,
    price: 42.0,
    discountPrice: 35.0,
    imageUrl:
      "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&q=80&w=1200",
    galleryUrls: [
      "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800"
    ],
    isPopular: true,
    description:
      "Cool off at Thailand's biggest and best water park with dozens of premium water slides and attractions.",
    highlights: [
      "Book Ramayana Water Park tickets and enjoy an exciting day at Thailand’s largest water park, inspired by the legendary Ramakien epic.",
      "Experience thrilling rides like Aqua Coaster, Python, Boomerango, Freefall, and Aqualoop.",
      "Capture unforgettable moments with complimentary photos and videos on five of the park’s most popular water slides.",
      "Relax in the Lazy Pool or enjoy the Double Wave Pool, Thailand’s largest double wave pool, featuring a 150-metre sandy beach.",
    ],
    included: ["Admission ticket"],
    duration: "Full day",
    openingHours: "Thu-Tue: 11:00 - 18:00",
  },
  {
    id: "pat-nong-nooch",
    timezone: "SE Asia Standard Time",
    name: "Nong Nooch Tropical Botanical Garden Ticket, Pattaya",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Parks & Gardens",
    rating: 4.5,
    reviewsCount: 10500,
    price: 25.0,
    discountPrice: 20.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRctsKfa8Nz3a8LArDKmdRqFHOgV4Xf7tOgjTP3PE-sAzpStKoK2HSwObHE&s=10",
    isPopular: false,
    description:
      "Wander through beautifully landscaped gardens and enjoy Thai cultural performances at Nong Nooch.",
    highlights: [
      "Discover over 19,000 plants representing 12,000+ species at Nong Nooch Tropical Botanical Garden, one of Southeast Asia’s largest botanical gardens in Pattaya.",
      "Wander through beautifully landscaped themed gardens, including the Italian Garden, Waterfall Garden, Butterfly Hill, and Tray Garden.",
      "Admire the intricate art of bonsai cultivation and the natural beauty of sculpted Suiseki stones at the Bonsai and Suiseki Exhibition.",
      "Stroll through the enchanting French Rose Garden, where vibrant blooms and delightful floral fragrances create a memorable sensory experience.",
    ],
    included: ["Admission ticket"],
    duration: "3-4 hours",
    openingHours: "Daily: 08:00 - 18:00",
  },
  {
    id: "pat-tiger-park",
    timezone: "SE Asia Standard Time",
    name: "Tiger Park Pattaya Tickets",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.3,
    reviewsCount: 5400,
    price: 22.0,
    discountPrice: 18.0,
    imageUrl:
      "https://pattayacitytourcoltd.com/uploads/SightSeenImage/tiger-park-pattaya-3442.webp",
    isPopular: false,
    description:
      "Get up close and personal with tigers of all sizes in a safe and controlled environment.",
    highlights: [
      "Visit Tiger Park Pattaya and enjoy close-up encounters with tigers of different sizes in a controlled environment.",
      "Participate in supervised feeding sessions and observe the tigers’ natural behaviours up close.",
      "Join informative guided tours to learn about tiger conservation, the park’s mission, and the lives of these majestic animals.",
      "Enjoy opportunities to interact with tiger cubs and capture memorable photographs during your visit.",
    ],
    included: ["Admission ticket"],
    duration: "1-2 hours",
    openingHours: "Daily: 09:00 - 18:00",
  },
  {
    id: "pat-sanctuary-truth",
    timezone: "SE Asia Standard Time",
    name: "Sanctuary Of Truth Pattaya Tickets",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Monuments",
    rating: 4.8,
    reviewsCount: 11200,
    price: 28.0,
    discountPrice: 22.0,
    imageUrl:
      "https://meetingsmags.com/wp-content/uploads/sites/152/2023/08/AdobeStock_486300148_Editorial_Use_Only.jpg",
    isPopular: true,
    description:
      "Marvel at the intricate wood carvings of the Sanctuary of Truth, a breathtaking architectural wonder.",
    highlights: [
      "Visit the magnificent Sanctuary of Truth in Pattaya, an entirely wooden structure showcasing intricate traditional craftsmanship.",
      "Admire detailed carvings and sculptures depicting Thai, Hindu, Buddhist, and Khmer cultures.",
      "Discover mythical creatures, religious stories, and fascinating figurines throughout the sanctuary.",
      "Learn about the symbolism and philosophy behind the carvings, reflecting Buddhist and Hindu beliefs.",
      "Witness traditional carpentry techniques and marvel at the sanctuary’s towering wooden spires and elaborate architecture.",
    ],
    included: ["Admission ticket", "Guided tour"],
    duration: "2-3 hours",
    openingHours: "Daily: 08:00 - 18:00",
  },
  {
    id: "sin-bird-paradise",
    timezone: "Singapore Standard Time",
    name: "Bird Paradise Tickets | Mandai Wildlife Reserve",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.8,
    reviewsCount: 1250,
    price: 35.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeytTuOzDxuSoQO-zgLJgvAqOCV7yYKjQ5-nTpsNhksHYm2qXPy5B7bnMc&s=10",
    isPopular: true,
    description:
      "Immerse yourself in a symphony of colours at Asia's largest bird park.",
    highlights: [
      "Discover Bird Paradise, Asia’s largest bird park, home to over 400 bird species, including rare and endangered varieties.",
      "Explore immersive aviaries where thousands of free-flying birds thrive in lush environments inspired by their natural habitats.",
      "Enjoy exciting bird presentations and shows that highlight the intelligence, agility, and fascinating behaviours of different species.",
      "Capture stunning photographs of colourful toucans, flamingos, hornbills, and other exotic birds in beautiful naturalistic settings.",
      "Get up close to these feathered wonders through interactive feeding sessions, bird presentations, and fun educational experiences.",
    ],
    included: ["Admission ticket"],
    duration: "3-4 hours",
    openingHours: "Daily: 09:00 - 18:00",
  },
  {
    id: "sin-flyer",
    timezone: "Singapore Standard Time",
    name: "Singapore Flyer Tickets",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Observation Decks",
    rating: 4.6,
    reviewsCount: 8500,
    price: 30.0,
    imageUrl:
      "https://www.singaporevisa.ae/blog/wp-content/uploads/2022/07/singapore-flyer.jpg",
    isPopular: true,
    description:
      "Enjoy panoramic views of Marina Bay and beyond from Asia's largest giant observation wheel.",
    highlights: [
      "Experience the world’s first Wiggle Wiggle-themed giant observation wheel at the Singapore Flyer, featuring vibrant Korean-inspired designs.",
      "Book Singapore Flyer tickets and enjoy a thrilling ride on one of the world’s tallest observation wheels, standing 165 metres high.",
      "Admire breathtaking panoramic views of Marina Bay and Singapore’s iconic skyline from spacious, air-conditioned capsules.",
      "Enjoy exclusive dining experiences like Sky Dining or the Singapore Sling Flight, combining delicious treats with stunning aerial views.",
    ],
    included: ["Flight ticket", "Time Capsule access"],
    duration: "1 hour",
    openingHours: "Daily: 10:00 - 22:00",
  },
  {
    id: "sin-wings-time",
    timezone: "Singapore Standard Time",
    name: "Wings Of Time Tickets, Singapore",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Shows & Events",
    rating: 4.5,
    reviewsCount: 5400,
    price: 15.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAya7EijJvjfItrQtqZ9KY8bJJlw5JSaMTr-o-A7meE1uqaMWaFfG-AN0n&s=10",
    isPopular: true,
    description:
      "End your day at Sentosa with the award-winning multi-sensory night show.",
    highlights: [
      "Experience the spectacular Wings of Time show, featuring 3D laser projections, water screens, and dazzling pyrotechnics against the South China Sea.",
      "Follow the magical journey of Shahbaz, the mythical bird, through captivating storytelling, stunning visuals, and immersive soundtracks.",
      "Watch the night sky light up with spectacular fireworks and vibrant special effects.",
      "Travel through artistic representations of the British Industrial Revolution, Mayan Pyramids, the Underwater World, the Silk Road, and the African Savanna.",
      "Marvel at synchronized robotic water fountains dancing in harmony with colourful lights and breathtaking visual effects.",
    ],
    included: ["Show ticket"],
    duration: "20 minutes",
    openingHours: "Daily: 19:40 & 20:40",
  },
  {
    id: "sin-mbs-skypark",
    timezone: "Singapore Standard Time",
    name: "Marina Bay Sands Skypark Observation Deck Tickets, Singapore",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Observation Decks",
    rating: 4.7,
    reviewsCount: 11200,
    price: 25.0,
    imageUrl:
      "https://www.marinabaysands.com/content/dam/revamp/attractions/TicketOnlineOrder/skypark-obs-deck-offpeak.jpg",
    isPopular: true,
    description:
      "Take in stunning views of Singapore from the iconic Marina Bay Sands Skypark.",
    highlights: [
      "Visit the Marina Bay Sands SkyPark Observation Deck on the 57th floor and enjoy breathtaking panoramic views of Singapore’s skyline and iconic landmarks.",
      "Witness the spectacular light and water show, combining dazzling visuals, music, and cutting-edge technology.",
      "Enjoy a scenic Sampan boat ride along the indoor canal at The Shoppes at Marina Bay Sands.",
      "Explore interactive exhibits and learn about Singapore’s transformation from a small port into a global metropolis.",
      "Capture stunning views of landmarks like the Singapore Flyer, Supertree Grove, and Marina Bay Sands.",
    ],
    included: ["Admission ticket"],
    duration: "1-2 hours",
    openingHours: "Daily: 11:00 - 21:00",
  },
  {
    id: "sin-night-safari",
    timezone: "Singapore Standard Time",
    name: "Singapore Night Safari Tickets with Tram Ride | Mandai Wildlife Reserve",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.8,
    reviewsCount: 14300,
    price: 45.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqDGXVMyOfj84YEv9VQALKZP-zBzgOlLFKqrFrtVnOeJ9aOcGMHIooA6U&s=10",
    isPopular: true,
    description:
      "Experience the world's first nocturnal wildlife park and explore it via a guided tram ride.",
    highlights: [
      "Book Singapore Night Safari tickets and explore the world’s first nocturnal wildlife park, home to over 4,200 animals across 130 species.",
      "Enjoy a tram ride through seven themed zones, including Himalayan Foothills and Equatorial Africa, spotting elephants, zebras, and anteaters.",
      "Explore the Fishing Cat and Leopard Trails for up-close encounters with fascinating nocturnal wildlife.",
      "Watch the entertaining Creatures of the Night show, featuring otters, civets, and other nocturnal animals.",
      "Experience spectacular fire performances while discovering the Night Safari’s heritage and conservation efforts.",
    ],
    included: ["Admission ticket", "Tram ride"],
    duration: "3-4 hours",
    openingHours: "Daily: 19:15 - 00:00",
  },
  {
    id: "sin-oceanarium",
    timezone: "Singapore Standard Time",
    name: "Singapore Oceanarium Tickets",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.7,
    reviewsCount: 9600,
    price: 40.0,
    imageUrl:
      "https://assets.cntraveller.in/photos/687e0eef95d499854d6c7bf0/master/w_1600%2Cc_limit/The%2520Shark%2520Tunnel%2520-%2520Image%2520by%2520Pallavi%2520Pasricha.JPG",
    isPopular: true,
    description:
      "Explore the fascinating marine realm of S.E.A. Aquarium, home to more than 100,000 marine animals.",
    highlights: [
      "Explore one of Asia’s largest oceanariums and embark on a multi-sensory journey through 22 themed ocean zones.",
      "Discover fascinating exhibits like Ancient Waters, Whale Fall, and Open Ocean Habitat, showcasing diverse marine environments.",
      "Encounter manta rays, zebra sharks, and colourful reef species in immersive underwater habitats.",
      "Experience interactive exhibits such as Spirit of Exploration, Pier Adventure, and Hallway of Hope, highlighting marine history and conservation.",
      "Marvel at the dramatic Whale Fall habitat, recreating a deep-sea ecosystem where a sunken whale supports unique marine life.",
    ],
    included: ["Admission ticket"],
    duration: "2-3 hours",
    openingHours: "Daily: 10:00 - 17:00",
  },
  {
    id: "sin-madame-tussauds",
    timezone: "Singapore Standard Time",
    name: "Madame Tussauds Singapore Tickets",
    location: "Singapore",
    city: "Singapore",
    region: "Asia",
    category: "Museums",
    rating: 4.4,
    reviewsCount: 5200,
    price: 28.0,
    imageUrl:
      "https://www.serviceonline.sg/Storage/Shop/1/Products/1151/1_500.png",
    isPopular: false,
    description:
      "Mingle with your favorite celebrities and experience the Spirit of Singapore boat ride.",
    highlights: [
      "Visit Madame Tussauds Singapore and encounter lifelike wax figures of famous celebrities, global icons, and influential personalities from around the world.",
      "Explore the exciting IIFA Awards Experience, walk the green carpet, and pose alongside lifelike wax figures of your favourite Bollywood stars.",
      "Enjoy a unique boat ride through a beautifully recreated tropical Singaporean garden, a first-of-its-kind experience at Madame Tussauds.",
      "Step into the vibrant K-Zone and capture memorable photos with your favourite Korean celebrities against stunning cherry blossom backdrops.",
      "Book your Madame Tussauds Singapore tickets and immerse yourself in the world of fame, entertainment, and celebrity experiences.",
    ],
    included: ["Admission ticket"],
    duration: "2-3 hours",
    openingHours: "Daily: 10:00 - 18:00",
  },
  {
    id: "hkt-carnival-magic",
    timezone: "SE Asia Standard Time",
    name: "Carnival Magic Tickets, Phuket",
    location: "Phuket, Thailand",
    city: "Phuket",
    region: "Asia",
    category: "Theme Parks",
    rating: 4.8,
    reviewsCount: 2100,
    price: 65.0,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRltGz-J5WLULCqHuYd0pxfXqOGFSThlr-VSy2ua4uREEtIRLzDPdWBa2w&s=10",
    isPopular: true,
    description:
      "Experience the magic of Thai culture with stunning parades, illuminations, and a grand buffet.",
    highlights: [
      "Explore Carnival Magic Phuket, the world’s first Thai Cultural Carnival Park, renowned for its dazzling lights, grand parades, and vibrant celebration of Thai traditions.",
      "Witness the spectacular River Carnival Parade, featuring the world’s largest indoor river parade, 150 performers, and breathtaking special effects.",
      "Immerse yourself in Thai culture through colourful shows like The Legend Continues and River Palace Paradium.",
      "Enjoy a grand buffet featuring delicious Thai and international cuisine at the Bird of Paradise Buffet or dine at the Fire Eater À La Carte Restaurant.",
      "Make your visit even more exciting with fun activities, including VR games, traditional dress-up sessions, and interactive experiences at Carnival Playland.",
    ],
    included: ["Admission ticket", "Show ticket"],
    duration: "4-5 hours",
    openingHours: "Mon, Wed, Sat: 17:30 - 23:30",
  },
  {
    id: "bkk-ancient-city",
    timezone: "SE Asia Standard Time",
    name: "Ancient City Bangkok Tickets",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Historic Sites",
    rating: 4.7,
    reviewsCount: 4300,
    price: 22.0,
    imageUrl:
      "https://www.thailandnews.co/wp-content/uploads/Ancient-Siam-Park-Mueang-Boran-HAH.jpg",
    isPopular: false,
    description:
      "Explore the world's largest outdoor museum featuring scaled-down replicas of Thailand's most significant historical structures.",
    highlights: [
      "Book Ancient City and Erawan Museum tickets and discover Thailand’s rich cultural heritage, traditional architecture, and artistic wonders.",
      "Explore Ancient City (Muang Boran), one of the world’s largest outdoor museums, featuring over 116 replicas of Thailand’s historic monuments, temples, and architectural landmarks.",
      "Marvel at the magnificent three-headed elephant sculpture at the Erawan Museum, an iconic example of intricate Thai craftsmanship.",
      "Discover fascinating collections curated by museum founder Khun Lek Viriyapant, showcasing Thailand’s history, traditions, cultural heritage, and artistic craftsmanship.",
    ],
    included: ["Admission ticket"],
    duration: "Half day",
    openingHours: "Daily: 09:00 - 18:00",
  },
  {
    id: "bkk-erawan-museum",
    timezone: "SE Asia Standard Time",
    name: "Erawan Museum Tickets",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Museums",
    rating: 4.6,
    reviewsCount: 3800,
    price: 12.0,
    imageUrl:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=85&w=1200",
    isPopular: false,
    description:
      "Marvel at the giant three-headed elephant statue housing a fascinating museum of antiquities.",
    highlights: [
      "Book Ancient City and Erawan Museum tickets and discover Thailand’s rich cultural heritage, stunning architecture, and artistic wonders.",
      "Explore Ancient City (Muang Boran), one of the world’s largest outdoor museums, featuring over 116 replicas of historic ruins, temples, monuments, and architectural landmarks.",
      "Marvel at the magnificent three-headed elephant sculpture at the Erawan Museum, renowned for its intricate craftsmanship and iconic design.",
      "Discover fascinating collections curated by museum founder Khun Lek Viriyapant, offering insights into Thailand’s history, traditions, local customs, and artistic heritage.",
    ],
    included: ["Admission ticket"],
    duration: "1-2 hours",
    openingHours: "Daily: 09:00 - 18:00",
  },
  {
    id: "bkk-siam-amazing-park",
    timezone: "SE Asia Standard Time",
    name: "Siam Amazing Park Tickets, Bangkok",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Theme Parks",
    rating: 4.5,
    reviewsCount: 6100,
    price: 25.0,
    imageUrl:
      "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&q=85&w=1200",
    isPopular: true,
    description:
      "Enjoy a fun-filled day at one of Southeast Asia's largest theme and water parks.",
    highlights: [
      "Visit Siam Amazing Park, one of Thailand’s largest theme parks, offering exciting rides and attractions for all ages.",
      "Explore six themed zones, including Adventure World, Fantasy World, Water World, and X-treme World.",
      "Experience thrilling rides like the Vortex, a massive suspended looping roller coaster featuring five inversions.",
      "Let kids enjoy Small World, with family-friendly attractions like mini boats and the gentle Mini Viking ride.",
    ],
    included: ["Admission ticket", "Access to water park and amusement park"],
    duration: "Full day",
    openingHours: "Daily: 10:00 - 18:00",
  },
  {
    id: "hkt-aquaria",
    timezone: "SE Asia Standard Time",
    name: "Aquaria Phuket Tickets",
    location: "Phuket, Thailand",
    city: "Phuket",
    region: "Asia",
    category: "Zoos & Aquariums",
    rating: 4.6,
    reviewsCount: 2900,
    price: 26.0,
    imageUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=85&w=1200",
    isPopular: false,
    description:
      "Discover the wonders of the ocean at the largest aquarium in Thailand.",
    highlights: [
      "Explore Aquaria Phuket, Thailand’s largest aquarium, and discover over 25,000 marine and freshwater creatures, including penguins, stingrays, and otters.",
      "Wander through nine immersive themed zones that recreate diverse ecosystems, including Canopy Walk, Jewels of the Jungle, and Coastal Haven.",
      "Enjoy the spectacular Mermaid Show, featuring mesmerising underwater performances as mermaids gracefully twirl and glide through massive aquarium tanks.",
      "Walk through the impressive 40-metre underwater tunnel and enjoy up-close views of sharks, rays, and colourful schools of fish swimming all around you.",
      "Visit the interactive Station Aquarius zone, where you can touch and learn about fascinating marine creatures such as starfish and sea cucumbers.",
    ],
    included: ["Admission ticket"],
    duration: "2-3 hours",
    openingHours: "Daily: 10:30 - 18:00",
  },
  {
    id: "bkk-madame-tussauds",
    timezone: "SE Asia Standard Time",
    name: "Madame Tussauds Bangkok Tickets",
    location: "Bangkok, Thailand",
    city: "Bangkok",
    region: "Asia",
    category: "Museums",
    rating: 4.4,
    reviewsCount: 4100,
    price: 24.0,
    imageUrl:
      "https://d1j7gws94ta18j.cloudfront.net/insecure/rs:fill:1168:656/czM6Ly90YWtlbWV0b3VyLTMtMC90cmlwcy9JamE0TS1vbVZ6Ui1tYWRhbS5qcGc",
    isPopular: false,
    description:
      "Get up close and take selfies with lifelike wax figures of global icons and celebrities.",
    highlights: [
      "Explore exciting themed zones at Madame Tussauds, from the glitz and glamour of Hollywood to the fascinating worlds of science and innovation.",
      "Pose alongside legendary sports icons such as David Beckham, Serena Williams, and Cristiano Ronaldo, and capture unforgettable moments.",
      "Travel through history and meet influential leaders and visionaries, including Mahatma Gandhi, Albert Einstein, and Pablo Picasso.",
      "Step into the spotlight and get up close to lifelike wax figures of global superstars like Brad Pitt, Angelina Jolie, and Jackie Chan.",
    ],
    included: ["Admission ticket"],
    duration: "1-2 hours",
    openingHours: "Daily: 10:00 - 20:00",
  },
  {
    id: "hkt-dolphin-show",
    timezone: "SE Asia Standard Time",
    name: "Phuket Dolphin Show Ticket",
    location: "Phuket, Thailand",
    city: "Phuket",
    region: "Asia",
    category: "Shows & Events",
    rating: 4.5,
    reviewsCount: 3200,
    price: 20.0,
    imageUrl:
      "https://phukettravelshop.com/wp-content/uploads/2022/11/PHUKET-DOLPHIN-SHOW-15.jpg",
    isPopular: false,
    description:
      "Be entertained by the incredible intelligence and agility of dolphins at this family-friendly show.",
    highlights: [
      "Enjoy an unforgettable Phuket Dolphin Show at Dolphins Bay and watch these intelligent marine creatures showcase their incredible talents.",
      "Witness spectacular dolphin performances featuring impressive jumps, thrilling flips, and perfectly synchronized routines alongside their trainers.",
      "Admire the special bond between dolphins and their trainers as they interact through playful activities and engaging performances.",
      "Discover fascinating facts about dolphin behaviour, biology, and conservation efforts through informative presentations, gaining a deeper appreciation for these remarkable creatures.",
    ],
    included: ["Show ticket"],
    duration: "45 minutes",
    openingHours: "Tue-Sun: 11:00, 14:00, 17:00",
  },
  {
    id: "pat-colosseum-show",
    timezone: "SE Asia Standard Time",
    name: "Colosseum Show Pattaya Tickets",
    location: "Pattaya, Thailand",
    city: "Pattaya",
    region: "Asia",
    category: "Shows & Events",
    rating: 4.7,
    reviewsCount: 5800,
    price: 18.0,
    imageUrl:
      "https://changpuakmagazine.com/images/article/11421906pat_co_march23.jpg",
    isPopular: true,
    description:
      "Experience Thailand's largest and most spectacular cabaret show featuring dazzling costumes and sets.",
    highlights: [
      "Visit the spectacular Colosseum Show in Pattaya, a grand theatre inspired by the iconic Roman amphitheatre.",
      "Enjoy a dazzling international cabaret performance featuring music, dance, and acts inspired by cultures around the world.",
      "Travel across Italy, Asia, India, and the West through vibrant stage performances.",
      "Marvel at extravagant costumes, impressive stage sets, and talented performers in an unforgettable 16-segment show.",
      "Experience a diverse range of acts, from traditional Thai dance to a glamorous Marilyn Monroe tribute.",
    ],
    included: ["Show ticket"],
    duration: "75 minutes",
    openingHours: "Daily: 18:00, 19:30, 21:00",
  },
];

export const DESTINATIONS: Destination[] = [
  {
    id: "france",
    name: "France",
    attractionsCount: 457,
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "spain",
    name: "Spain",
    attractionsCount: 216,
    imageUrl:
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "italy",
    name: "Italy",
    attractionsCount: 283,
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "singapore",
    name: "Singapore",
    attractionsCount: 199,
    imageUrl:
      "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "thailand",
    name: "Thailand",
    attractionsCount: 234,
    imageUrl:
      "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "australia",
    name: "Australia",
    attractionsCount: 142,
    imageUrl:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "usa",
    name: "United States",
    attractionsCount: 512,
    imageUrl:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "japan",
    name: "Japan",
    attractionsCount: 469,
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "london",
    name: "London",
    attractionsCount: 390,
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "dubai",
    name: "Dubai",
    attractionsCount: 156,
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "south-korea",
    name: "South Korea",
    attractionsCount: 178,
    imageUrl:
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&q=80&w=1200",
  },
];

// Helper to get standard timezone based on location
function getFallbackTz(city: string | undefined, location: string | undefined): string {
  const cityLower = (city || "").toLowerCase();
  const locLower = (location || "").toLowerCase();

  if (cityLower === "amsterdam") return "W. Europe Standard Time";
  if (cityLower === "lisbon") return "GMT Standard Time";
  if (cityLower === "barcelona") return "Romance Standard Time";
  if (cityLower === "new york" || cityLower === "usa" || locLower.includes("new york") || locLower.includes("california") || locLower.includes("orlando") || locLower.includes("san diego")) {
    if (locLower.includes("california") || locLower.includes("san diego")) {
      return "Pacific Standard Time";
    }
    return "Eastern Standard Time";
  }
  if (cityLower === "zurich") return "W. Europe Standard Time";
  if (cityLower === "rome") return "W. Europe Standard Time";
  if (cityLower === "istanbul") return "Türkiye Standard Time";
  if (cityLower === "singapore") return "Singapore Standard Time";
  if (cityLower === "tokyo") return "Tokyo Standard Time";
  if (cityLower === "paris") return "Romance Standard Time";
  if (cityLower === "bangkok") return "SE Asia Standard Time";
  if (cityLower === "sydney") return "AUS Eastern Standard Time";
  if (cityLower === "osaka") return "Tokyo Standard Time";
  if (cityLower === "dubai") return "Arabian Standard Time";
  if (cityLower === "switzerland") return "W. Europe Standard Time";
  if (cityLower === "athens") return "GTB Standard Time";
  if (cityLower === "florence") return "W. Europe Standard Time";
  if (cityLower === "london") return "GMT Standard Time";
  if (cityLower === "san diego") return "Pacific Standard Time";
  if (cityLower === "pattaya") return "SE Asia Standard Time";
  if (cityLower === "phuket") return "SE Asia Standard Time";

  if (locLower.includes("spain") || locLower.includes("barcelona")) return "Romance Standard Time";
  if (locLower.includes("italy") || locLower.includes("florence") || locLower.includes("rome")) return "W. Europe Standard Time";
  if (locLower.includes("france") || locLower.includes("paris")) return "Romance Standard Time";
  if (locLower.includes("united kingdom") || locLower.includes("london") || locLower.includes("uk")) return "GMT Standard Time";
  if (locLower.includes("netherlands") || locLower.includes("amsterdam")) return "W. Europe Standard Time";
  if (locLower.includes("turkey") || locLower.includes("istanbul")) return "Türkiye Standard Time";
  if (locLower.includes("greece") || locLower.includes("athens")) return "GTB Standard Time";
  if (locLower.includes("switzerland") || locLower.includes("zurich")) return "W. Europe Standard Time";
  if (locLower.includes("thailand") || locLower.includes("bangkok") || locLower.includes("pattaya") || locLower.includes("phuket")) return "SE Asia Standard Time";
  if (locLower.includes("japan") || locLower.includes("tokyo") || locLower.includes("osaka")) return "Tokyo Standard Time";
  if (locLower.includes("singapore")) return "Singapore Standard Time";
  if (locLower.includes("australia") || locLower.includes("sydney")) return "AUS Eastern Standard Time";
  if (locLower.includes("dubai") || locLower.includes("uae")) return "Arabian Standard Time";

  return "GMT Standard Time";
}

/**
 * Normalizes a string for robust duplicate matching
 */
export function cleanKey(str?: string): string {
  return (str || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

/**
 * Deduplicates attractions ensuring only a single canonical entry exists for any activity.
 * Matches by:
 * - exact id
 * - exact productId
 * - displayProductId hash
 * - normalized (name + city)
 *
 * When duplicates are detected (e.g. customized user entry vs hardcoded default):
 * The customized entry (e.g. updated price, custom variants, edited details) is prioritized,
 * and canonical slug IDs (like "ams-van-gogh") are restored if replaced with numeric IDs.
 */
export function deduplicateAttractions(
  items: Attraction[],
  referenceDefaults: Attraction[] = []
): Attraction[] {
  if (!Array.isArray(items)) return [];

  const defaultsById = new Map<string, Attraction>();
  const defaultsByNameCity = new Map<string, Attraction>();

  for (const def of referenceDefaults) {
    if (def.id) defaultsById.set(def.id, def);
    const key = `${cleanKey(def.name)}__${cleanKey(def.city || def.location)}`;
    if (cleanKey(def.name).length > 3) defaultsByNameCity.set(key, def);
  }

  const seenIds = new Set<string>();
  const seenProductIds = new Set<string>();
  const seenNameCity = new Set<string>();
  const result: Attraction[] = [];

  for (const rawItem of items) {
    if (!rawItem || !rawItem.name) continue;
    const item: Attraction = { ...rawItem };

    const id = (item.id || "").trim();
    const productId = (item.productId || "").trim();
    const normName = cleanKey(item.name);
    const normCity = cleanKey(item.city || item.location);
    const nameCityKey = `${normName}__${normCity}`;

    // Look for matching default
    const matchingDefault =
      (id && defaultsById.get(id)) ||
      (productId && defaultsById.get(productId)) ||
      (normName.length > 3 ? defaultsByNameCity.get(nameCityKey) : undefined);

    // If item has a purely numeric ID but matches a canonical default slug (e.g. 'ams-van-gogh'), restore canonical id
    if (matchingDefault && (!item.id || /^\d{8}$/.test(item.id))) {
      item.id = matchingDefault.id;
      item.productId = item.productId || rawItem.id || getDisplayProductId(matchingDefault);
    }

    const currentId = item.id || "";
    const currentProdId = item.productId || "";

    const isDupById = currentId && seenIds.has(currentId);
    const isDupByProdId = currentProdId && seenProductIds.has(currentProdId);
    const isDupByNameCity = normName.length > 3 && seenNameCity.has(nameCityKey);

    if (isDupById || isDupByProdId || isDupByNameCity) {
      // Find the existing item in result
      const existingIdx = result.findIndex(
        (r) =>
          (currentId && r.id === currentId) ||
          (currentProdId && r.productId === currentProdId) ||
          (normName.length > 3 &&
            `${cleanKey(r.name)}__${cleanKey(r.city || r.location)}` === nameCityKey)
      );

      if (existingIdx !== -1) {
        const existing = result[existingIdx];
        if (matchingDefault) {
          // Check if newly encountered item has user customization (e.g. customized price or variants)
          const itemIsCustom =
            item.price !== matchingDefault.price ||
            (item.discountPrice && item.discountPrice !== matchingDefault.discountPrice) ||
            (item.variants && item.variants.length > 0);
          const existingIsCustom =
            existing.price !== matchingDefault.price ||
            (existing.discountPrice && existing.discountPrice !== matchingDefault.discountPrice) ||
            (existing.variants && existing.variants.length > 0);

          if (itemIsCustom && !existingIsCustom) {
            result[existingIdx] = {
              ...item,
              id: existing.id && !/^\d{8}$/.test(existing.id) ? existing.id : (matchingDefault.id || item.id),
              productId: item.productId || existing.productId || getDisplayProductId(matchingDefault),
            };
          }
        }
      }
      continue;
    }

    if (currentId) seenIds.add(currentId);
    if (currentProdId) seenProductIds.add(currentProdId);
    if (normName.length > 3) seenNameCity.add(nameCityKey);

    result.push(item);
  }

  return result;
}

// Initialize dynamic synchronization from localStorage on module load
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("tiqsey_custom_attractions");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let hasChanges = false;

        const hardcodedAttractions = [...POPULAR_ATTRACTIONS];

        // 1. Deduplicate the saved list from localStorage first against hardcoded defaults
        const deduplicatedParsed = deduplicateAttractions(parsed, hardcodedAttractions);
        if (deduplicatedParsed.length !== parsed.length) {
          hasChanges = true;
        }

        // 2. Build index of existing items in deduplicatedParsed
        const existingIds = new Set<string>();
        const existingNameCity = new Set<string>();
        for (const item of deduplicatedParsed) {
          if (item.id) existingIds.add(item.id);
          if (item.productId) existingIds.add(item.productId);
          const nKey = `${cleanKey(item.name)}__${cleanKey(item.city || item.location)}`;
          if (cleanKey(item.name).length > 3) existingNameCity.add(nKey);
        }

        const merged = [...deduplicatedParsed];

        // 3. Only merge hardcoded attractions that are truly not present
        for (const item of hardcodedAttractions) {
          const nKey = `${cleanKey(item.name)}__${cleanKey(item.city || item.location)}`;
          const matchesId = item.id && (existingIds.has(item.id) || existingIds.has(getDisplayProductId(item)));
          const matchesNameCity = cleanKey(item.name).length > 3 && existingNameCity.has(nKey);

          if (!matchesId && !matchesNameCity) {
            merged.push(item);
            hasChanges = true;
          }
        }

        const finalCleanList = deduplicateAttractions(merged, hardcodedAttractions);
        if (finalCleanList.length !== merged.length) {
          hasChanges = true;
        }

        const HIGHLIGHTS_SYNC_KEY = "tiqsey_highlights_sync_version";
        const HIGHLIGHTS_SYNC_VERSION = "2026-11-23-sheet-v1";
        let needsHighlightsSync = false;
        try {
          needsHighlightsSync = localStorage.getItem(HIGHLIGHTS_SYNC_KEY) !== HIGHLIGHTS_SYNC_VERSION;
        } catch {
          needsHighlightsSync = false;
        }
        const defaultHighlightsById = new Map<string, string[]>();
        for (const h of hardcodedAttractions) {
          if (h.id && Array.isArray(h.highlights) && h.highlights.length > 0) {
            defaultHighlightsById.set(h.id, h.highlights);
          }
        }

        const migrated = finalCleanList.map((item: any) => {
          if (!item.timezone) {
            item.timezone = getFallbackTz(item.city, item.location);
            hasChanges = true;
          }
          if (needsHighlightsSync && item.id && defaultHighlightsById.has(item.id)) {
            item.highlights = [...(defaultHighlightsById.get(item.id) || [])];
            hasChanges = true;
          }
          // Repair broken third-party URLs that may have been saved to local storage previously
          if (item.imageUrl) {
            if (item.imageUrl.includes("staybook.in")) {
              if (item.id === "ams-canal" || item.name?.includes("Amsterdam Canal")) {
                item.imageUrl = "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=1080";
              } else if (item.name?.includes("Efteling")) {
                item.imageUrl = "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&q=80&w=1080";
              } else if (item.name?.includes("Orangerie")) {
                item.imageUrl = "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&q=80&w=1080";
              } else if (item.name?.includes("Dolphin")) {
                item.imageUrl = "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&q=80&w=1080";
              } else {
                item.imageUrl = "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&q=80&w=1080";
              }
              hasChanges = true;
            } else if (item.imageUrl.includes("darrenbloggie.com")) {
              item.imageUrl = "https://images.unsplash.com/photo-1582650625119-3a31f841807d?auto=format&fit=crop&q=80&w=1080";
              hasChanges = true;
            }
          }
          return item;
        });

        POPULAR_ATTRACTIONS.length = 0;
        POPULAR_ATTRACTIONS.push(...migrated);

        if (hasChanges || finalCleanList.length !== parsed.length) {
          try {
            localStorage.setItem("tiqsey_custom_attractions", JSON.stringify(migrated));
            if (needsHighlightsSync) {
              localStorage.setItem(HIGHLIGHTS_SYNC_KEY, HIGHLIGHTS_SYNC_VERSION);
            }
          } catch (storageErr) {
            console.warn("Failed to persist migrated attractions to localStorage", storageErr);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse custom attractions from localStorage", e);
    }
  } else {
    try {
      localStorage.setItem("tiqsey_custom_attractions", JSON.stringify(POPULAR_ATTRACTIONS));
      localStorage.setItem("tiqsey_highlights_sync_version", "2026-11-23-sheet-v1");
    } catch (e) {
      console.error("Failed to write initial attractions to localStorage", e);
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener('storage', (e) => {
    if (e.key === 'tiqsey_custom_attractions' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleanList = deduplicateAttractions(parsed);
          POPULAR_ATTRACTIONS.length = 0;
          POPULAR_ATTRACTIONS.push(...cleanList);
          window.dispatchEvent(new Event("tiqsey_attractions_updated"));
        }
      } catch (err) {
        console.error('Failed to sync tiqsey_custom_attractions from storage event', err);
      }
    }
  });
}

/**
 * Synchronizes the live POPULAR_ATTRACTIONS array and persists it to backend SQLite and localStorage.
 * This triggers a reactive window event so components can optionally update.
 */
export function syncCustomAttractions(newAttractions: Attraction[]) {
  if (typeof window !== "undefined") {
    const cleanList = deduplicateAttractions(newAttractions);
    try {
      localStorage.setItem("tiqsey_custom_attractions", JSON.stringify(cleanList));
    } catch (e) {
      console.warn("Failed to persist attractions to localStorage (quota or disabled)", e);
    }
    POPULAR_ATTRACTIONS.length = 0;
    POPULAR_ATTRACTIONS.push(...cleanList);
    window.dispatchEvent(new Event("tiqsey_attractions_updated"));

    // Async sync to SQLite backend
    fetch("/api/inventory/attractions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanList)
    }).catch((err) => {
      console.warn("[Backend Attractions Sync Warning]:", err);
    });
  }
}

// Fetch persisted attractions from backend database on initialization
if (typeof window !== "undefined") {
  fetch("/api/inventory/attractions")
    .then((res) => {
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        return res.json();
      }
      return null;
    })
    .then((data) => {
      if (data && data.success && Array.isArray(data.attractions) && data.attractions.length > 0) {
        // Merge backend attractions (backend overrides default mockData)
        const merged = [...POPULAR_ATTRACTIONS];
        data.attractions.forEach((remoteAttr: Attraction) => {
          const idx = merged.findIndex((m) => m.id === remoteAttr.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...remoteAttr };
          } else {
            merged.unshift(remoteAttr);
          }
        });
        const clean = deduplicateAttractions(merged);
        POPULAR_ATTRACTIONS.length = 0;
        POPULAR_ATTRACTIONS.push(...clean);
        window.dispatchEvent(new Event("tiqsey_attractions_updated"));
        console.log(`[Attractions Sync] Merged ${data.attractions.length} attractions from SQLite backend.`);
      }
    })
    .catch(() => {});
}

