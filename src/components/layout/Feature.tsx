export default function Features() {
    const features = [
      {
        title: "Secure Payments",
        description: "Pay safely with Solana blockchain escrow.",
        icon: "🔒",
      },
      {
        title: "Global Talent",
        description: "Hire freelancers from around the world.",
        icon: "🌍",
      },
      {
        title: "Easy Job Posting",
        description: "Create and manage jobs effortlessly.",
        icon: "📝",
      },
    ];
  
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Freelancia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-gray-100 rounded-lg text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }