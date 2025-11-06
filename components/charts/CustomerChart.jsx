"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CustomerSegmentCharts = () => {
  const [segmentation, setSegmentation] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const local = localStorage.getItem("session");
    const user = JSON.parse(local)?.user;
    if (user) setUserEmail(user.email);
  }, []);

  useEffect(() => {
    const fetchSegmentation = async () => {
      if (!userEmail) return;
      const { data, error } = await supabase
        .from("Customers")
        .select("*")
        .eq("status", "Active")
        .eq("user_email", userEmail);

      if (error) {
        console.error("Error fetching segmentation:", error);
        return;
      }

      const segmentCounts = data.reduce((acc, curr) => {
        const key = curr.segment || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const formatted = Object.keys(segmentCounts).map((key) => ({
        segment: key,
        count: segmentCounts[key],
      }));

      setSegmentation(formatted);
    };

    fetchSegmentation();
  }, [userEmail]);

  const dummyData = {
    customerIndustry: 12,
    highestPrice: "$5,400",
    purchaseHistory: 28,
  };

  const totalActiveCustomers = segmentation.reduce((acc, s) => acc + s.count, 0);

  const customerLocations = [
    { lat: 28.6139, lng: 77.209, name: "Delhi", count: 50 },
    { lat: 19.076, lng: 72.8777, name: "Mumbai", count: 80 },
    { lat: 13.0827, lng: 80.2707, name: "Chennai", count: 30 },
    { lat: 22.5726, lng: 88.3639, name: "Kolkata", count: 40 },
  ];

  return (
    <div className="p-4 space-y-8">
      {/* 2x2 Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
       <Card className= ":bg-white/50 dark:bg-slate-700/50">
   
          <CardHeader>
            <CardTitle>Customer Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalActiveCustomers}</p>
            <p className="text-gray-500">Active Customers</p>
          </CardContent>
        </Card>

        <Card className= ":bg-white/50 dark:bg-slate-700/50">
          <CardHeader>
           

            <CardTitle>Customer Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dummyData.customerIndustry}</p>
            <p className="text-gray-500">Industries</p>
          </CardContent>
        </Card>

     
      
        <Card className= ":bg-white/50 dark:bg-slate-700/50">
   
        
          <CardHeader>
            <CardTitle>Highest Price Purchased</CardTitle>
          </CardHeader>
          <CardContent>
           
            <p className="text-3xl font-bold">{dummyData.highestPrice}</p>
            <p className="text-gray-500">Purchase Value</p>
         
          </CardContent>
        </Card>

       
       <Card className= ":bg-white/50 dark:bg-slate-700/50">
   
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{dummyData.purchaseHistory}</p>
            <p className="text-gray-500">Total Purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Distribution Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              className="h-full w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {customerLocations.map((loc, index) => (
                <CircleMarker
                  key={index}
                  center={[loc.lat, loc.lng]}
                  radius={loc.count / 5}
                  color="rgba(255,0,0,0.6)"
                  fillOpacity={0.4}
                >
                  <Tooltip>
                    {loc.name}: {loc.count} customers
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSegmentCharts;
