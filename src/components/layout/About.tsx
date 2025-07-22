import { CheckCircle, Settings, Repeat } from "lucide-react";

export default function EnterpriseSuiteCard() {
  return (
    <div className="bg-[#b46f2e] text-white rounded-xl overflow-hidden flex flex-col md:flex-row p-6 md:p-0 w-10/12 mx-auto mt-10"> {/* bg-[#0D5C4D] */}
      {/* Text Section */}
      <div className="flex-1 p-6 md:p-10 space-y-6">
        <div>
          <p className="text-lg font-semibold">Enterprise Suite</p>
          <h1 className="text-4xl font-bold leading-tight mt-2">
            This is how <br />
            <span className="text-[#97D6A6]">good companies</span><br />
            <span className="text-[#97D6A6]">find good company.</span>
          </h1>
        </div>

        <p className="text-white/80 text-base max-w-lg">
          Access the top 1% of talent on Upwork, and a full suite of hybrid
          workforce management tools. This is how innovation works now.
        </p>

        <ul className="space-y-3 text-white/90 text-base">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#97D6A6]" />
            Access expert talent to fill your skill gaps
          </li>
          <li className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-[#97D6A6]" />
            Control your workflow: hire, classify and pay your talent
          </li>
          <li className="flex items-start gap-3">
            <Repeat className="w-5 h-5 text-[#97D6A6]" />
            Partner with Upwork for end-to-end support
          </li>
        </ul>

        <button className="mt-4 px-5 py-2.5 bg-white text-[#0D5C4D] rounded-md font-semibold hover:bg-gray-100 transition">
          Learn more
        </button>
      </div>

      {/* Image Section */}
      <div className="flex-1">
        <img
          src="https://imgs.search.brave.com/ofLaZb84th-Osn8_zfHnTfxb6fBwLJrDd3f0Y0dfJ8o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDQu/ZGVwb3NpdHBob3Rv/cy5jb20vMjMyNTg0/MS8yMTM1NS9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzIxMzU1MjA0/NC1zdG9jay1waG90/by1oYW5kc29tZS15/b3VuZy1jYXVjYXNp/YW4tZnJlZWxhbmNl/ci10YWtpbmcuanBn"
          alt="Man in wheelchair working"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}