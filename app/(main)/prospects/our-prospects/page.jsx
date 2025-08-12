"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Star,
  StarOff,
  Plus,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export default function OurProspects() {
  const [result, setResult] = useState(null);

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const messages = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("hi!"),
  ];

  const handleClick = async () => {
    const res = await model.invoke(messages);
    console.log(res.content); // ✅ only runs when you click
    setResult(res.content); // ✅ store result in state
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">ICP Page</h1>
      <p>{result}</p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Click Me
      </button>
    </div>
  );
}
