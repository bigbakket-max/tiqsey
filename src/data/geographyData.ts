export interface GeographyHierarchy {
  [region: string]: {
    [subRegion: string]: {
      [country: string]: {
        [state: string]: string[];
      };
    };
  };
}

export const GEOGRAPHY_DATA: GeographyHierarchy = {
  "Africa": {
    "Northern Africa": {
      "Egypt": {
        "Cairo Governorate": ["Cairo"],
        "Giza Governorate": ["Giza"]
      },
      "Morocco": {
        "Marrakesh-Safi": ["Marrakesh"],
        "Casablanca-Settat": ["Casablanca"]
      }
    },
    "Southern Africa": {
      "South Africa": {
        "Western Cape": ["Cape Town"],
        "Gauteng": ["Johannesburg"]
      }
    },
    "East Africa": {
      "Kenya": {
        "Nairobi County": ["Nairobi"]
      }
    }
  },
  "The Americas": {
    "North America": {
      "United States": {
        "New York": ["New York", "Buffalo", "Albany"],
        "California": ["San Francisco", "Los Angeles", "San Diego", "Yosemite"],
        "Florida": ["Miami", "Orlando", "Key West"],
        "Nevada": ["Las Vegas", "Reno"],
        "Illinois": ["Chicago"],
        "Hawaii": ["Honolulu", "Maui"]
      },
      "Canada": {
        "Ontario": ["Toronto", "Ottawa", "Niagara Falls"],
        "Quebec": ["Montreal", "Quebec City"],
        "British Columbia": ["Vancouver", "Victoria"]
      },
      "Mexico": {
        "Quintana Roo": ["Cancun", "Tulum", "Cozumel"],
        "Mexico City": ["Mexico City"],
        "Jalisco": ["Guadalajara", "Puerto Vallarta"]
      }
    },
    "South America": {
      "Brazil": {
        "Rio de Janeiro": ["Rio de Janeiro"],
        "São Paulo": ["São Paulo"]
      },
      "Peru": {
        "Cusco": ["Cusco", "Machu Picchu"],
        "Lima": ["Lima"]
      }
    }
  },
  "Asia": {
    "East Asia": {
      "Japan": {
        "Tokyo Prefecture": ["Tokyo"],
        "Kyoto Prefecture": ["Kyoto"],
        "Osaka Prefecture": ["Osaka"],
        "Hokkaido": ["Sapporo"]
      },
      "South Korea": {
        "Seoul Capital": ["Seoul"],
        "Busan Metropolitan": ["Busan"],
        "Jeju Province": ["Jeju City"]
      },
      "Taiwan": {
        "Taipei City": ["Taipei"],
        "Kaohsiung City": ["Kaohsiung"]
      }
    },
    "Southeast Asia": {
      "Thailand": {
        "Bangkok Metropolitan": ["Bangkok"],
        "Chiang Mai": ["Chiang Mai"],
        "Phuket Province": ["Phuket"]
      },
      "Singapore": {
        "Central Region": ["Singapore"]
      },
      "Indonesia": {
        "Bali": ["Ubud", "Denpasar", "Seminyak", "Kuta"],
        "Jakarta Special Capital": ["Jakarta"]
      },
      "Vietnam": {
        "Hanoi Municipality": ["Hanoi"],
        "Ho Chi Minh City Municipality": ["Ho Chi Minh City"],
        "Quang Nam Province": ["Hoi An"]
      }
    },
    "South Asia": {
      "India": {
        "Delhi NCR": ["New Delhi"],
        "Maharashtra": ["Mumbai"],
        "Rajasthan": ["Jaipur", "Udaipur", "Jaisalmer"],
        "Uttar Pradesh": ["Agra"]
      }
    },
    "Western Asia": {
      "United Arab Emirates": {
        "Dubai Emirate": ["Dubai"],
        "Abu Dhabi Emirate": ["Abu Dhabi"]
      },
      "Turkey": {
        "Istanbul Province": ["Istanbul"],
        "Central Anatolia": ["Cappadocia"],
        "Antalya Province": ["Antalya"]
      },
      "Jordan": {
        "Amman Governorate": ["Amman"],
        "Ma'an Governorate": ["Petra"]
      }
    }
  },
  "Europe": {
    "Western Europe": {
      "France": {
        "Île-de-France": ["Paris", "Versailles"],
        "Provence-Alpes-Côte d'Azur": ["Nice", "Marseille", "Cannes"],
        "Auvergne-Rhône-Alpes": ["Lyon", "Chamonix"]
      },
      "Netherlands": {
        "North Holland": ["Amsterdam", "Haarlem"],
        "South Holland": ["Rotterdam", "The Hague"]
      },
      "Germany": {
        "Bavaria": ["Munich", "Nuremberg"],
        "Berlin State": ["Berlin"],
        "Hamburg": ["Hamburg"]
      },
      "Belgium": {
        "Brussels-Capital": ["Brussels"],
        "Flanders": ["Bruges", "Ghent", "Antwerp"]
      }
    },
    "Southern Europe": {
      "Italy": {
        "Lazio": ["Rome", "Tivoli"],
        "Tuscany": ["Florence", "Pisa", "Siena"],
        "Veneto": ["Venice", "Verona"],
        "Lombardy": ["Milan", "Como"]
      },
      "Spain": {
        "Catalonia": ["Barcelona", "Girona"],
        "Madrid Community": ["Madrid"],
        "Andalusia": ["Seville", "Granada", "Malaga"]
      },
      "Greece": {
        "Attica": ["Athens"],
        "South Aegean": ["Santorini", "Mykonos"]
      },
      "Portugal": {
        "Lisbon District": ["Lisbon", "Sintra"],
        "Porto District": ["Porto"]
      }
    },
    "Northern Europe": {
      "United Kingdom": {
        "England": ["London", "Bath", "Oxford", "Cambridge"],
        "Scotland": ["Edinburgh", "Glasgow"],
        "Northern Ireland": ["Belfast"]
      },
      "Ireland": {
        "Leinster": ["Dublin"],
        "Munster": ["Cork", "Killarney"]
      },
      "Iceland": {
        "Capital Region": ["Reykjavik"],
        "Southern Region": ["Vik"]
      }
    },
    "Central & Eastern Europe": {
      "Austria": {
        "Vienna State": ["Vienna"],
        "Salzburg State": ["Salzburg"],
        "Tyrol": ["Innsbruck"]
      },
      "Czech Republic": {
        "Prague Capital": ["Prague"]
      },
      "Hungary": {
        "Central Hungary": ["Budapest"]
      }
    }
  },
  "Oceania": {
    "Australasia": {
      "Australia": {
        "New South Wales": ["Sydney", "Byron Bay"],
        "Victoria": ["Melbourne"],
        "Queensland": ["Brisbane", "Cairns", "Gold Coast"]
      },
      "New Zealand": {
        "Auckland Region": ["Auckland"],
        "Otago Region": ["Queenstown"],
        "Canterbury": ["Christchurch"]
      }
    }
  }
};
