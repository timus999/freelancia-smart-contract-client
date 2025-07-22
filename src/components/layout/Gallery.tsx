export default function Gallery() {
    const artworks = [
      { id: 1, src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", alt: "Digital Art 1" },
      { id: 2, src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe", alt: "Digital Art 2" },
      { id: 3, src: "https://images.unsplash.com/photo-1618945033602-8b9473b6a2e0", alt: "Digital Art 3" },
      { id: 4, src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a51ead", alt: "Digital Art 4" },
    ];
  
    return (
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Creations from Freelancia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {artworks.map((art) => (
              <img
                key={art.id}
                src={art.src}
                alt={art.alt}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }