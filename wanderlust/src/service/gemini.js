// src/service/gemini.js
// Keep all your existing imports and configurations
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Keep your existing getNewHotel export
export const getNewHotel = async (destination, budget) => {
  // Your existing getNewHotel implementation
  try {
    if (!destination) {
      throw new Error("Destination is required");
    }

    const prompt = `Generate a realistic hotel in ${destination} with ${budget} budget level.
    Requirements:
    1. Hotel must be a realistic hotel name in ${destination}
    2. Use real street names and areas from ${destination}
    3. Price must match ${budget} budget level for ${destination}
    4. Include local landmarks in description
    5. Use realistic ratings and prices for the area

    Return a JSON object with these exact properties:
    {
      "hotelName": "(real hotel name)",
      "hotelAddress": "(specific street address)",
      "price": "(specific price range)",
      "rating": "(between 3.5-5.0)",
      "description": "(detailed description with nearby landmarks)",
      "geoCoordinates": "(actual coordinates)"
    }`;

    const newChat = model.startChat({
      generationConfig,
      history: []
    });

    const result = await newChat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI Response:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const hotelData = JSON.parse(jsonMatch[0]);

    if (!hotelData.hotelName || !hotelData.hotelAddress) {
      throw new Error('Invalid hotel data generated');
    }

    return {
      hotelName: hotelData.hotelName,
      hotelAddress: `${hotelData.hotelAddress}, ${destination}`,
      price: `${hotelData.price}`,
      rating: parseFloat(hotelData.rating || "4.0").toFixed(1),
      description: hotelData.description,
      geoCoordinates: hotelData.geoCoordinates,
      location: destination
    };
  } catch (error) {
    console.error("Error in getNewHotel:", error);
    throw new Error(`Failed to generate hotel in ${destination}: ${error.message}`);
  }
};

// Add the new getNewPlace function
export const getNewPlace = async (destination, budget) => {
  try {
    if (!destination) {
      throw new Error("Destination is required");
    }

    const prompt = `Generate a realistic place to visit in ${destination} with ${budget} budget level.
    Requirements:
    1. Place must be a realistic tourist attraction in ${destination}
    2. Include details like ticket pricing, time to travel, and a brief description
    3. Use real landmarks and areas from ${destination}

    Return a JSON object with these exact properties:
    {
      "placeName": "(real place name)",
      "placeDetails": "(brief description)",
      "time": "(keep empty)",
      "timeToTravel": "(time required to visit)",
      "ticketPricing": "(specific price range)"
    }`;

    const newChat = model.startChat({
      generationConfig,
      history: []
    });

    const result = await newChat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const placeData = JSON.parse(jsonMatch[0]);

    if (!placeData.placeName || !placeData.placeDetails) {
      throw new Error('Invalid place data generated');
    }

    return placeData;
  } catch (error) {
    console.error("Error in getNewPlace:", error);
    throw new Error(`Failed to generate place: ${error.message}`);
  }
};