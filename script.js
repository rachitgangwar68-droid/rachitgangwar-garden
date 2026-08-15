/* =====================================================================
   HOW TO ADD A NEW FLOWER / PLANT TO YOUR JOURNAL
   =====================================================================
   1. Put your photo(s) in the "images" folder.
   2. Copy one of the {...} blocks below and paste it into the list.
   3. Fill in the fields:
        name        - required
        latin       - optional, delete the line to hide it
        date        - optional, delete the line to hide it
        description - short note about the plant
        images      - a LIST of one or more photo paths. Add as many
                       as you like, e.g. of the same flower at
                       different times. If there's more than one,
                       the card shows next/previous arrows.
   4. Save the file and refresh the page (or re-upload if it's live).
   That's it — no other code needs to change.
   ===================================================================== */

const flowersData = [
  {
    name: "Marigold",
    latin: "Tagetes erecta",
    date: "June 2026",
    images: ["images/marigold-1.jpg", "images/marigold-2.jpg"],
    description: "Bright orange blooms by the front path. Flowers almost non-stop through summer and the bees love it."
  },
  {
    name: "Rose",
    latin: "Rosa 'Iceberg'",
    date: "May 2026",
    images: ["images/rose-1.jpg"],
    description: "Planted this white rose bush two years ago. It's finally covering the trellis by the gate."
  },
  {
    name: "Sunflower",
    latin: "Helianthus annuus",
    date: "July 2026",
    images: ["images/sunflower-1.jpg"],
    description: "Grew from seed this year — taller than me by August. Always facing the morning sun."
  },
   {
    name: "Chrysanthemum",
    latin: "Helianthus annuus",
    date: "July 2026",
    images: ["images/Chrysanthemum-1.jpg","images/Chrysanthemum-2.jpg","images/Chrysanthemum-3.jpg"],
    description: "Grew from seed this year — taller than me by August. Always facing the morning sun."
  }

  // Add more entries here, following the same pattern:
  // {
  //   name: "Tulip",
  //   latin: "Tulipa",
  //   date: "March 2026",
  //   images: ["images/tulip-1.jpg", "images/tulip-2.jpg"],
  //   description: "A short note about this plant."
  // },
];

/* ===================== rendering — no need to edit below ===================== */

function createCard(flower) {
  const card = document.createElement("article");
  card.className = "card";

  const tape = document.createElement("div");
  tape.className = "tape";
  card.appendChild(tape);

  // Support old single "image" entries too, just in case.
  const images = flower.images && flower.images.length
    ? flower.images
    : (flower.image ? [flower.image] : []);

  card.appendChild(createCarousel(images, flower.name));

  const name = document.createElement("h2");
  name.className = "card-name";
  name.textContent = flower.name;
  card.appendChild(name);

  if (flower.latin) {
    const latin = document.createElement("p");
    latin.className = "card-latin";
    latin.textContent = flower.latin;
    card.appendChild(latin);
  }

  if (flower.date) {
    const date = document.createElement("p");
    date.className = "card-date";
    date.textContent = flower.date;
    card.appendChild(date);
  }

  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = flower.description || "";
  card.appendChild(desc);

  return card;
}

function createCarousel(images, name) {
  const wrap = document.createElement("div");
  wrap.className = "carousel";

  if (!images.length) {
    wrap.appendChild(makePlaceholder(name));
    return wrap;
  }

  let current = 0;

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = name;

  function showImage(index) {
    current = (index + images.length) % images.length;

    // Reset any "missing photo" state left over from a previous slide.
    img.style.display = "";
    const existingPlaceholder = wrap.querySelector(".carousel-placeholder");
    if (existingPlaceholder) existingPlaceholder.remove();

    img.src = images[current];
    img.onerror = function () {
      img.style.display = "none";
      if (!wrap.querySelector(".carousel-placeholder")) {
        const ph = makePlaceholder(name);
        ph.classList.add("carousel-placeholder");
        wrap.insertBefore(ph, img);
      }
    };
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  wrap.appendChild(img);

  // Only add arrows and dots if there's more than one photo.
  let dots = [];
  if (images.length > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", `Previous photo of ${name}`);
    prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", () => showImage(current - 1));

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", `Next photo of ${name}`);
    nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", () => showImage(current + 1));

    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);

    const dotRow = document.createElement("div");
    dotRow.className = "carousel-dots";
    images.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to photo ${i + 1} of ${name}`);
      dot.addEventListener("click", () => showImage(i));
      dotRow.appendChild(dot);
      dots.push(dot);
    });
    wrap.appendChild(dotRow);

    // Swipe support for touch devices.
    let touchStartX = null;
    wrap.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    wrap.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx > 0 ? showImage(current - 1) : showImage(current + 1);
      }
      touchStartX = null;
    });
  }

  showImage(0);
  return wrap;
}

function makePlaceholder(name) {
  const div = document.createElement("div");
  div.className = "placeholder";
  div.textContent = `photo missing: ${name}`;
  return div;
}

function render() {
  const gallery = document.getElementById("gallery");
  const emptyState = document.getElementById("empty-state");

  if (!flowersData.length) {
    emptyState.hidden = false;
    return;
  }

  flowersData.forEach((flower) => {
    gallery.appendChild(createCard(flower));
  });
}

render();
