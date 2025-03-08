import { BotIcon, Cog, Command, MessageSquare, Zap } from "lucide-react";

export default function DashboardPage() {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Smart Conversations",
      description: "Engage in natural conversations with our AI assistant",
      color: "blue",
    },
    {
      icon: <Command className="w-6 h-6" />,
      title: "Powerful Commands",
      description: "Access advanced features with simple commands",
      color: "green",
    },
    {
      icon: <Cog className="w-6 h-6" />,
      title: "Useful Tools",
      description: "Leverage integrated tools for enhanced productivity",
      color: "purple",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Actions",
      description: "Perform tasks faster with shortcut actions",
      color: "amber",
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-100 to-gray-50/50 rounded-3xl animate-gradient-x"></div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] rounded-3xl"></div>

        <div className="relative space-y-8 p-8">
          <div className="bg-white/60 backdrop-blur-sm shadow-sm ring-1 ring-gray-200/50 rounded-2xl p-8 space-y-8">
            <div className="text-center">
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 inline-flex mb-6">
                <BotIcon className="w-16 h-16 text-gray-600 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                Welcome to the AI Agent Chat
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto text-lg">
                Experience the next generation of AI assistance. Select a
                feature below to learn more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {features.map((feature) => (
                <button
                  key={feature.title}
                  className={`p-6 rounded-xl text-left transition-all duration-200 hover:bg-gray-50 hover:shadow-md`}
                >
                  <div className={`text-${feature.color}-500 mb-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
