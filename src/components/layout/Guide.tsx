export default function Guide() {
    const steps = [
      {
        title: "Sign Up",
        description: "Create an account as a client or freelancer.",
      },
      {
        title: "Post or Find Jobs",
        description: "Clients post jobs, freelancers apply with proposals.",
      },
      {
        title: "Work & Pay Securely",
        description: "Complete projects and pay via Solana escrow.",
      },
    ];
  
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Get Started with Freelancia</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 p-6 bg-gray-100 rounded-lg text-center">
                <div className="text-2xl font-bold mb-2">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }