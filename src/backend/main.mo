import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  type AITool = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    url : Text;
    isFeatured : Bool;
  };

  module AITool {
    public func compareByName(tool1 : AITool, tool2 : AITool) : Order.Order {
      Text.compare(tool1.name, tool2.name);
    };
  };

  let tools = Map.empty<Nat, AITool>();
  var nextId = 1;

  // Seed Data
  let initialTools : [AITool] = [
    {
      id = 1;
      name = "ChatGPT";
      description = "AI chatbot by OpenAI.";
      category = "Chat";
      url = "https://chat.openai.com";
      isFeatured = true;
    },
    {
      id = 2;
      name = "Google Gemini";
      description = "Conversational AI by Google.";
      category = "Chat";
      url = "https://gemini.google.com";
      isFeatured = true;
    },
    {
      id = 3;
      name = "Perplexity";
      description = "AI search engine and assistant.";
      category = "Research";
      url = "https://perplexity.ai";
      isFeatured = false;
    },
    {
      id = 4;
      name = "Microsoft Copilot";
      description = "AI assistant integrated with Microsoft 365.";
      category = "Chat";
      url = "https://copilot.microsoft.com";
      isFeatured = false;
    },
    {
      id = 5;
      name = "Claude";
      description = "Conversational AI by Anthropic";
      category = "Chat";
      url = "https://claude.ai";
      isFeatured = false;
    },
    {
      id = 6;
      name = "DALL-E";
      description = "AI image generation.";
      category = "Image";
      url = "https://openai.com/dall-e-2";
      isFeatured = false;
    },
    {
      id = 7;
      name = "Midjourney";
      description = "AI image creation on Discord.";
      category = "Image";
      url = "https://midjourney.com";
      isFeatured = false;
    },
    {
      id = 8;
      name = "Stable Diffusion";
      description = "Open-source AI image generator.";
      category = "Image";
      url = "https://stability.ai";
      isFeatured = false;
    },
    {
      id = 9;
      name = "GitHub Copilot";
      description = "AI coding assistant by GitHub.";
      category = "Code";
      url = "https://github.com/features/copilot";
      isFeatured = false;
    },
    {
      id = 10;
      name = "Replit Ghostwriter";
      description = "AI coding assistant on Replit.";
      category = "Code";
      url = "https://replit.com/ghostwriter";
      isFeatured = false;
    },
    {
      id = 11;
      name = "Runway ML";
      description = "Video editing with AI tools.";
      category = "Video";
      url = "https://runwayml.com";
      isFeatured = true;
    },
    {
      id = 12;
      name = "Suno AI";
      description = "AI music generation app.";
      category = "Audio";
      url = "https://suno.com";
      isFeatured = false;
    },
    {
      id = 13;
      name = "Otter.ai";
      description = "AI meeting transcription tool.";
      category = "Audio";
      url = "https://otter.ai";
      isFeatured = false;
    },
    {
      id = 14;
      name = "Grammarly";
      description = "AI writing assistant.";
      category = "Writing";
      url = "https://grammarly.com";
      isFeatured = false;
    },
    {
      id = 15;
      name = "Jasper";
      description = "AI writing and marketing platform.";
      category = "Writing";
      url = "https://jasper.ai";
      isFeatured = false;
    },
    {
      id = 16;
      name = "Notion AI";
      description = "AI writing and organization tools.";
      category = "Writing";
      url = "https://notion.so/product/ai";
      isFeatured = false;
    },
    {
      id = 17;
      name = "Canva AI";
      description = "Design with AI features.";
      category = "Image";
      url = "https://canva.com/ai";
      isFeatured = false;
    },
    {
      id = 18;
      name = "Adobe Firefly";
      description = "AI image creation by Adobe.";
      category = "Image";
      url = "https://adobe.com/products/firefly.html";
      isFeatured = false;
    },
    {
      id = 19;
      name = "ElevenLabs";
      description = "AI voice generation platform.";
      category = "Audio";
      url = "https://elevenlabs.io";
      isFeatured = true;
    },
    {
      id = 20;
      name = "Pika Labs";
      description = "AI generated video from text prompt.";
      category = "Video";
      url = "https://pika.art";
      isFeatured = true;
    },
  ];

  // Initialize data
  for (tool in initialTools.values()) {
    tools.add(tool.id, tool);
  };
  nextId += initialTools.size();

  public query ({ caller }) func getAllTools() : async [AITool] {
    tools.values().toArray().sort(AITool.compareByName);
  };

  public query ({ caller }) func getToolsByCategory(category : Text) : async [AITool] {
    tools.values().toArray().filter(
      func(tool) { Text.equal(tool.category, category) }
    );
  };

  public query ({ caller }) func getFeaturedTools() : async [AITool] {
    tools.values().toArray().filter(
      func(tool) { tool.isFeatured }
    );
  };

  func containsIgnoreCase(haystack : Text, needle : Text) : Bool {
    let lowerHaystack = haystack.map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } });
    let lowerNeedle = needle.map(func(c) { if (c >= 'A' and c <= 'Z') { Char.fromNat32(c.toNat32() + 32) } else { c } });
    lowerHaystack.contains(#text lowerNeedle);
  };

  public query ({ caller }) func searchTools(searchText : Text) : async [AITool] {
    tools.values().toArray().filter(
      func(tool) {
        containsIgnoreCase(tool.name, searchText) or containsIgnoreCase(tool.description, searchText)
      }
    );
  };

  public shared ({ caller }) func addTool(name : Text, description : Text, category : Text, url : Text, isFeatured : Bool) : async {
    id : Nat;
  } {
    let tool : AITool = {
      id = nextId;
      name;
      description;
      category;
      url;
      isFeatured;
    };
    tools.add(nextId, tool);
    nextId += 1;
    {
      id = tool.id;
    };
  };

  public shared ({ caller }) func updateTool(id : Nat, name : Text, description : Text, category : Text, url : Text, isFeatured : Bool) : async () {
    switch (tools.get(id)) {
      case (null) { Runtime.trap("Tool does not exist") };
      case (?_) {
        let updatedTool : AITool = {
          id;
          name;
          description;
          category;
          url;
          isFeatured;
        };
        tools.add(id, updatedTool);
      };
    };
  };

  public shared ({ caller }) func deleteTool(id : Nat) : async () {
    switch (tools.get(id)) {
      case (null) { Runtime.trap("Tool does not exist") };
      case (?_) {
        tools.remove(id);
      };
    };
  };

  public query ({ caller }) func getToolById(id : Nat) : async ?AITool {
    tools.get(id);
  };
};
