import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlogPost } from '../components/BlogPage';

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id'>) => void;
  updatePost: (id: string, updatedPost: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const savedPosts = localStorage.getItem('tiqsey_blog_posts');
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Fix any broken or outdated unsplash URLs
          return parsed.map((p: BlogPost) => {
            if (p.id === 'tokyo-districts' && (!p.imageUrl || p.imageUrl.includes('photo-1540959733332'))) {
              return {
                ...p,
                imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80'
              };
            }
            if (p.id === 'amsterdam-gezelligheid' && (!p.imageUrl || p.imageUrl.includes('photo-1513694203232'))) {
              return {
                ...p,
                imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80'
              };
            }
            return p;
          });
        }
      } catch (e) {
        console.error("Failed to parse saved blog posts", e);
      }
    }
    return [
      {
        id: "paris-secrets",
      title: "A Guide to Paris's Best Kept Secret Courtyards and Passageways",
      excerpt: "Step away from the crowds of the Louvre and escape the bustling Boulevard Haussmann. Let's wander through the forgotten glass-roofed passages of the 19th century.",
      content: [
        "Paris is a city designed to be seen, but its true magic is often found in the places that try to remain unseen. Behind massive heavy wooden doors and down quiet side streets lie the covered passages (passages couverts) and secret green courtyards that offer a portal into the 19th-century Golden Age.",
        "In the early 1800s, Paris had dozens of these glass-roofed arcades. They were the world's first shopping malls, built to keep wealthy patrons dry from the muddy, unpaved streets and safe from carriage traffic. Today, only a handful remain, beautifully preserved with mosaic tiling, antique clocks, and boutique bookstore facades.",
        "Start your secret tour at Passage des Panoramas. Built in 1799, it is the oldest covered walkway in Paris. Here, you'll find stamp collectors, vintage postcard shops, and warm, lit bistros that smell of fresh crêpes. It retains a gorgeous, retro, slightly rugged atmosphere that feels genuinely historical.",
        "Just across the street is the exquisite Passage Jouffroy. Boasting an incredible glass and iron structure, it features a majestic clock and houses the famous Cabinet de Cire (wax museum) exit. It is also home to the delightful Librairie du Passage, which features floor-to-ceiling wooden shelves packed with rare art books.",
        "For green oases, slip into the Cour de Damoye in the 11th arrondissement. Just steps from the chaotic Place de la Bastille, this quiet cobblestone alley is draped in hanging ivy and filled with artisan workshops, a local coffee roaster, and absolute tranquility.",
        "How to access them: Many of Paris's finest courtyards are hidden behind digital security codes during weekends, but during weekday mornings, they are often left slightly ajar. Be respectful, walk softly, and keep your camera shutter silent to experience Paris just as the writers of the Belle Époque once did."
      ],
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      category: "Hidden Gems",
      author: {
        name: "Camille Laurent",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        role: "Parisian Local & Travel Editor"
      },
      publishedAt: "June 24, 2026",
      readTime: "5 min read",
      city: "Paris",
      tags: ["Paris", "Hidden Gems", "Belle Epoque", "France"]
    },
    {
      id: "tokyo-districts",
      title: "Navigating Tokyo: Traditional Shrines vs. Futuristic Cyberpunk Districts",
      excerpt: "How to experience the ultimate urban juxtaposition of Tokyo: transitioning from the serene, mossy gardens of Meiji Jingu to the glowing neon...",
      content: [
        "No city on Earth balances the weight of history and the acceleration of the future quite like Tokyo. Within a single train station stop, you can step out of a tranquil 17th-century wooden temple surrounded by whispering cypress trees and straight into a multi-story neon-drenched arcade playing high-velocity synth beats.",
        "This dual identity is not a contradiction to Tokyoites; it is a harmonious coexistence. To fully appreciate Tokyo, you must design your itinerary to highlight this jarring yet satisfying juxtaposition.",
        "Morning: The Traditional Sanctuary. Start your day early at Senso-ji, Tokyo's oldest Buddhist temple in Asakusa. Arrive at 7:00 AM before the Nakamise-dori shopping street opens. The smell of burning incense drifting over the giant red paper lantern (Kaminarimon) under a soft morning drizzle is spiritual. Afterwards, stroll through the nearby Ueno Park to see turtles sunning themselves on lotus leaves.",
        "Afternoon: The Hyper-Modern High-Speed Hub. Hop on the Yamanote line to Akihabara or Shibuya. In Akihabara, the quiet of the morning is shattered by towering vertical electronics stores, glowing LED billboard ads, and claw-machine parlors vibrating with retro video game soundtracks. Here, you are living inside a sci-fi vision of 1990s Tokyo.",
        "Evening: Cyberpunk Shinjuku. As night falls, make your way to Shinjuku. Walk through Omoide Yokocho (Memory Lane), a tiny network of alleys filled with smoke from yakitori grills and red paper lanterns. Then, look up: just meters away stand the monolithic skyscrapers of Nishi-Shinjuku and the colossal 3D outdoor billboards. It is a cinematic experience like no other.",
        "Tips for travelers: Always carry a coin pouch, as cash is still preferred in traditional shrines, and make sure your IC transit card (Suica or Pasmo) is fully charged to easily jump between Tokyo's past and future."
      ],
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      category: "Destination Guides",
      author: {
        name: "Kenji Sato",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        role: "Tokyo Photographer"
      },
      publishedAt: "June 28, 2026",
      readTime: "7 min read",
      city: "Tokyo",
      tags: ["Tokyo", "Culture", "Japan", "Travel Guide"]
    },
    {
      id: "amalfi-roadtrip",
      title: "7 Days Along the Amalfi Coast: The Ultimate Road Trip Itinerary",
      excerpt: "Slowing down in southern Italy. How to navigate the high-cliff hairpin turns, find the sweetest lemon granita, and explore Positano without breaking yo...",
      content: [
        "The Amalfi Coast is legendary for its dramatically steep cliffs, pastel-colored houses tumbling into the sparkling Tyrrhenian Sea, and sprawling terrace orchards heavy with massive Sfusato lemons. But it's also notorious for traffic gridlocks, expensive parking, and overwhelming crowds.",
        "The secret to a flawless Amalfi getaway? Strategic timing and slow-travel philosophy. Instead of trying to tick off every single town in 48 hours, dedicate seven days to soak up the Mediterranean sun, the scent of wild jasmine, and the local rhythm.",
        "Day 1-2: Sorrento as a Base. While technically not part of the official Amalfi Coast, Sorrento is the perfect logistical starting point. It offers excellent train access from Naples and is highly walkable. Spend your evening strolling around Piazza Tasso and tasting real, cold limoncello.",
        "Day 3-4: The Vertical Positano. Positano is as steep as they say—expect to walk hundreds of steps daily. Rather than buying overpriced beach club lounge chairs, head to the free section of Spiaggia Fornillo. It is quieter, cleaner, and frequented primarily by locals. Don't leave without grabing a lemon granita from the vintage cart near the top of the pedestrian trail.",
        "Day 5: Ravello's Cliffside Gardens. High up in the hills sits Ravello, a peaceful mountain village with panoramic views of the entire gulf. Visit Villa Cimbrone and walk along the 'Terrace of Infinity'. Standing among the marble busts overlooking the azure water below is an unforgettable, almost cinematic experience.",
        "Day 6-7: Amalfi Town and Atrani. Amalfi has a beautiful medieval cathedral with striking Moorish architecture. Walk through the dark, arched stone tunnels to Atrani—Italy's smallest municipality. Atrani remains remarkably untouched by mass tourism, offering a glimpse into authentic Italian fishing village life."
      ],
      imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80",
      category: "Travel Tips",
      author: {
        name: "Elena Rossi",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: "Italy Travel Specialist"
      },
      publishedAt: "June 15, 2026",
      readTime: "6 min read",
      city: "Rome",
      tags: ["Amalfi", "Italy", "Road Trip", "Summer"]
    },
    {
      id: "amsterdam-gezelligheid",
      title: "The Art of Dutch 'Gezelligheid': An Amsterdam Canal Guide",
      excerpt: "More than just a word, 'gezelligheid' is the driving force of Dutch culture. Here is how to find it in warm candlelit brown cafés, quiet canals, and secret...",
      content: [
        "There is no direct English translation for the Dutch word 'gezelligheid'. It encompasses cozy, social, warm, relaxed, and homey. It’s the feeling of sharing a laugh with an old friend in a warm room, the soft glow of a candle against dark wooden walls, or a slow bike ride along a quiet, misty canal at dusk.",
        "In Amsterdam, gezelligheid is woven into the very fabric of the city. To experience it, you must look past the neon red lights and tourist-heavy shopping districts and seek out the spots where time slows down.",
        "The Brown Cafés (Bruine Kroegs). These are historical Dutch pubs, named for their dark wood paneling, decades of tobacco-stained ceilings (now historic relic!), and cozy Persian rugs draped over tables. Head to Café 't Smalle in the Jordaan neighborhood. Sit by the canal with a cold local draft beer and hot bitterballen dipped in mustard. This is peak gezelligheid.",
        "Wandering the Nine Streets (Negen Straatjes). These micro-streets connect the main canals of the grand Canal Ring. They are packed with independent bookshops, vintage clothing boutiques, artisanal cheese shops, and cozy cafés. It is the perfect place to get lost on a breezy, overcast afternoon.",
        "The Begijnhof. Step through a modest wooden door near the busy Spui square, and you will suddenly find yourself in a silent medieval courtyard. Built in the 14th century for a lay Catholic sisterhood, it features gorgeous historic brick houses, a manicured green lawn, and absolute silence.",
        "Sunset on the Canals. The ultimate gezellig experience is watching Amsterdam's bridges light up as dusk falls. Find a wooden bench on the corner of Reguliersgracht and Herengracht, where you can peer through the arches of seven illuminated stone bridges lined up in perfect symmetry."
      ],
      imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
      category: "Food & Culture",
      author: {
        name: "Sven de Jong",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        role: "Amsterdam Resident"
      },
      publishedAt: "May 10, 2026",
      readTime: "4 min read",
      city: "Amsterdam",
      tags: ["Amsterdam", "Netherlands", "Culture", "Local Guide"]
    }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('tiqsey_blog_posts', JSON.stringify(posts));
  }, [posts]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPosts(prev => {
        let changed = false;
        const now = new Date();
        const next = prev.map(post => {
          if (post.status === 'Scheduled' && post.publishedAt) {
            const pubDate = new Date(post.publishedAt);
            if (!isNaN(pubDate.getTime()) && pubDate <= now) {
              changed = true;
              return { ...post, status: 'Published' as const };
            }
          }
          return post;
        });
        if (changed) {
          localStorage.setItem('tiqsey_blog_posts', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }, 10000); // Check every 10 seconds for faster updates in preview
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tiqsey_blog_posts' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setPosts(parsed);
          }
        } catch (err) {
          console.error("Failed to sync blog posts from storage event", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost = { ...post, id: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() };
    setPosts(prev => {
      const next = [newPost, ...prev];
      localStorage.setItem('tiqsey_blog_posts', JSON.stringify(next));
      return next;
    });
  };

  const updatePost = (id: string, updatedPost: Partial<BlogPost>) => {
    setPosts(prev => {
      const next = prev.map(post => post.id === id ? { ...post, ...updatedPost } : post);
      localStorage.setItem('tiqsey_blog_posts', JSON.stringify(next));
      return next;
    });
  };

  const deletePost = (id: string) => {
    setPosts(prev => {
      const next = prev.map(post => post.id === id ? { ...post, deleted: true } : post);
      localStorage.setItem('tiqsey_blog_posts', JSON.stringify(next));
      return next;
    });
  };

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
  };

  return (
    <BlogContext.Provider value={{ posts: posts.filter(p => !(p as any).deleted), addPost, updatePost, deletePost, getPostById }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
