// Simple localStorage helper for Metro Cinema

(function () {
  var PREFIX = "metroCinema:";

  // Default movie catalog
  var defaultMovies = [
    {
      id: 1,
      slug: "iron-man",
      title: "Iron Man",
      year: 2008,
      genre: "Action, Sci-Fi",
      category: "Marvel",
      director: "Jon Favreau",
      description: "Tony Stark, a genius inventor, builds a powerful suit of armor and becomes the superhero Iron Man.",
      poster: "images/iron-man.jpg",
      cssClass: "iron-man",
      stars: "★★★★★",
      review: "“The film that started it all. Downey is perfect.”",
      reviewer: "Layla"
    },
    {
      id: 2,
      slug: "black-panther",
      title: "Black Panther",
      year: 2018,
      genre: "Action, Sci-Fi",
      category: "Marvel",
      director: "Ryan Coogler",
      description: "T'Challa returns to Wakanda to become king, but must protect his country when an enemy challenges his leadership.",
      poster: "images/black-panther.jpg",
      cssClass: "black-panther",
      stars: "★★★★☆",
      review: "“Stunning world, great music and a strong villain.”",
      reviewer: "Youssef"
    },
    {
      id: 3,
      slug: "endgame",
      title: "Avengers: Endgame",
      year: 2019,
      genre: "Action, Adventure",
      category: "Marvel",
      director: "Anthony Russo, Joe Russo",
      description: "After a devastating defeat, the surviving Avengers work together on one final mission to restore what was lost.",
      poster: "images/endgame.jpg",
      cssClass: "endgame",
      stars: "★★★★★",
      review: "“An emotional finale worth ten years of waiting.”",
      reviewer: "Omar"
    },
    {
      id: 4,
      slug: "guardians",
      title: "Guardians of the Galaxy",
      year: 2014,
      genre: "Action, Comedy, Sci-Fi",
      category: "Marvel",
      director: "James Gunn",
      description: "A group of unusual space criminals join forces to protect the galaxy from a dangerous enemy.",
      poster: "images/guardians.jpg",
      cssClass: "guardians",
      stars: "★★★★☆",
      review: "“Funny, colorful and full of heart.”",
      reviewer: "Nour"
    },
    {
      id: 5,
      slug: "spiderman",
      title: "Spider-Man: No Way Home",
      year: 2021,
      genre: "Action, Adventure",
      category: "Marvel",
      director: "Jon Watts",
      description: "Peter Parker asks Doctor Strange for help, but an unraveled spell brings powerful villains from other dimensions.",
      poster: "images/spiderman.jpg",
      cssClass: "spiderman",
      stars: "★★★★★",
      review: "“The cinema was shouting. Pure fan joy.”",
      reviewer: "Hady"
    },
    {
      id: 6,
      slug: "doctor-strange",
      title: "Doctor Strange",
      year: 2016,
      genre: "Action, Fantasy",
      category: "Marvel",
      director: "Scott Derrickson",
      description: "A brilliant neurosurgeon learns the mystic arts to heal and protect the world from alternate dimension threats.",
      poster: "images/doctor-strange.jpg",
      cssClass: "doctor-strange",
      stars: "★★★★☆",
      review: "“Mind-bending visuals and a great origin story.”",
      reviewer: "Salma"
    },
    {
      id: 7,
      slug: "yacoubian",
      title: "The Yacoubian Building",
      arabicTitle: "عمارة يعقوبيان",
      year: 2006,
      genre: "Drama",
      category: "Egyptian",
      director: "Marwan Hamed",
      description: "Depicts the intertwined lives, struggles, and social corruption among residents of a historic downtown Cairo building.",
      poster: "images/yacoubian.jpg",
      cssClass: "yacoubian",
      stars: "★★★★★",
      review: "“Sharp, human and unforgettable. A Cairo classic.”",
      reviewer: "Mona"
    },
    {
      id: 8,
      slug: "embassy",
      title: "The Embassy in the Building",
      arabicTitle: "السفارة في العمارة",
      year: 2005,
      genre: "Comedy, Drama",
      category: "Egyptian",
      director: "Amr Arafa",
      description: "An engineer returns to Cairo after years abroad and finds the Israeli embassy next door to his apartment.",
      poster: "images/embassy.jpg",
      cssClass: "embassy",
      stars: "★★★★☆",
      review: "“Adel Imam at his funniest. Still makes me laugh.”",
      reviewer: "Karim"
    },
    {
      id: 9,
      slug: "terrorism-kebab",
      title: "Terrorism and Kebab",
      arabicTitle: "الإرهاب والكباب",
      year: 1992,
      genre: "Comedy",
      category: "Egyptian",
      director: "Sherif Arafa",
      description: "A regular citizen goes to the Mogamma government building for routine paperwork and causes an accidental hostage standoff.",
      poster: "images/terrorism-kebab.jpg",
      cssClass: "terrorism-kebab",
      stars: "★★★★★",
      review: "“A comedy with a big heart and a sharp message.”",
      reviewer: "Rania"
    },
    {
      id: 10,
      slug: "cairo-station",
      title: "Cairo Station",
      arabicTitle: "باب الحديد",
      year: 1958,
      genre: "Drama",
      category: "Egyptian",
      director: "Youssef Chahine",
      description: "A crippled newsstand seller develops a dangerous obsession with a lively lemonade vendor at Cairo Central Station.",
      poster: "images/cairo-station.jpg",
      cssClass: "cairo-station",
      stars: "★★★★★",
      review: "“Chahine’s masterpiece. Full of life, fear and longing.”",
      reviewer: "Tamer"
    },
    {
      id: 11,
      slug: "blue-elephant",
      title: "The Blue Elephant",
      arabicTitle: "الفيل الأزرق",
      year: 2014,
      genre: "Drama, Thriller",
      category: "Egyptian",
      director: "Marwan Hamed",
      description: "A psychiatrist at an asylum for the criminally insane evaluates an old friend who has committed a bizarre crime.",
      poster: "images/blue-elephant.jpg",
      cssClass: "blue-elephant",
      stars: "★★★★☆",
      review: "“Dark, surreal and very well acted.”",
      reviewer: "Sara"
    },
    {
      id: 12,
      slug: "saidi",
      title: "Saidi at the American University",
      arabicTitle: "صعيدي في الجامعة الأمريكية",
      year: 1998,
      genre: "Comedy",
      category: "Egyptian",
      director: "Saeed Hamed",
      description: "A rural student from Upper Egypt wins a scholarship to the American University in Cairo, leading to comical cultural clashes.",
      poster: "images/saidi.jpg",
      cssClass: "saidi",
      stars: "★★★★☆",
      review: "“Pure fun. Henedy and the whole cast are great.”",
      reviewer: "Dina"
    }
  ];

  // Generate a simple unique ID
  function newId() {
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function readList(collection) {
    try {
      var raw = localStorage.getItem(PREFIX + collection);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveList(collection, list) {
    localStorage.setItem(PREFIX + collection, JSON.stringify(list));
  }

  // Get all items, or one item by id
  function get(collection, id) {
    var list = readList(collection);
    if (id === undefined) {
      return list;
    }
    return list.find(function (item) {
      return String(item.id) === String(id);
    }) || null;
  }

  // Add a new item (creates an id if missing)
  function add(collection, item) {
    var list = readList(collection);
    var newItem = Object.assign({}, item, {
      id: item && item.id ? item.id : newId()
    });
    list.push(newItem);
    saveList(collection, list);
    return newItem;
  }

  // Update an existing item by id
  function update(collection, id, changes) {
    var list = readList(collection);
    var index = list.findIndex(function (item) {
      return String(item.id) === String(id);
    });
    if (index === -1) {
      return null;
    }
    list[index] = Object.assign({}, list[index], changes, { id: list[index].id });
    saveList(collection, list);
    return list[index];
  }

  // Delete an item by id
  function remove(collection, id) {
    var list = readList(collection);
    var filtered = list.filter(function (item) {
      return String(item.id) !== String(id);
    });
    if (filtered.length === list.length) {
      return false;
    }
    saveList(collection, filtered);
    return true;
  }

  // Search items by keyword string or filter object
  function search(collection, query) {
    var list = readList(collection);
    if (!query) {
      return list;
    }

    if (typeof query === "string") {
      var text = query.toLowerCase();
      return list.filter(function (item) {
        return Object.values(item).join(" ").toLowerCase().includes(text);
      });
    }

    return list.filter(function (item) {
      return Object.keys(query).every(function (key) {
        var value = query[key];
        if (value === "" || value === null || value === undefined) {
          return true;
        }
        if (key === "id") {
          return String(item.id) === String(value);
        }
        return String(item[key] || "").toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }

  // Seed default data once
  function initialize() {
    if (!localStorage.getItem(PREFIX + "movies")) {
      saveList("movies", defaultMovies);
    }
    if (!localStorage.getItem(PREFIX + "reviews")) {
      saveList("reviews", []);
    }
    if (!localStorage.getItem(PREFIX + "users")) {
      saveList("users", []);
    }
  }

  initialize();

  window.MetroStorage = {
    get: get,
    add: add,
    update: update,
    delete: remove,
    search: search,
    initialize: initialize,
    newId: newId
  };
})();
