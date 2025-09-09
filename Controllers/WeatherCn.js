import Weather from "../Models/WeatherMd.js";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import * as cacheService from "../services/cacheService.js";

export const getCurrentWeather = catchAsync(async (req, res, next) => {
  const { city, country } = req.query;

  if (!city) {
    return next(new HandleERROR("City parameter is required", 400));
  }

  const cacheKey = `weather:${city.toLowerCase()}:${country || "default"}`;

  const cachedData = await cacheService.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      success: true,
      data: cachedData,
      source: "cache",
      message: "Weather data from cache",
    });
  }

  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  const dbWeather = await Weather.findOne({
    city: city.toLowerCase(),
    country: country || "",
    createdAt: { $gte: twelveHoursAgo },
  }).sort({ createdAt: -1 });

  if (dbWeather) {
    await cacheService.set(cacheKey, dbWeather);
    return res.status(200).json({
      success: true,
      data: dbWeather,
      source: "database",
      message: "Fresh data from database",
    });
  }

  const location = country ? `${city},${country}` : city;
  const apiUrl = `${process.env.WEATHER_API_URL}/${location}?unitGroup=metric&include=current&key=${process.env.WEATHER_API_KEY}&contentType=json`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "WeatherAPI-Service/1.0",
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        return next(new HandleERROR("City not found", 404));
      }
      if (response.status === 401) {
        return next(new HandleERROR("Invalid API key", 401));
      }
      return next(
        new HandleERROR(`API Error: ${response.status}`, response.status)
      );
    }

    const apiData = await response.json();
    const current = apiData.currentConditions;

    const newWeather = await Weather.create({
      city: city.toLowerCase(),
      country: country || "",
      tempC: Math.round(current.temp * 10) / 10,
      description: current.conditions,
    });

    await cacheService.set(cacheKey, newWeather);

    return res.status(201).json({
      success: true,
      data: newWeather,
      source: "external_api",
      message: "Weather data fetched successfully",
    });
  } catch (error) {
    return next(new HandleERROR("Weather service unavailable", 503));
  }
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Weather, req?.query, req?.role)
    .addManualFilters()
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const result = await features.execute();
  return res.status(200).json(result);
});
