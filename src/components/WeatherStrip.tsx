"use client";
import { useEffect, useState } from "react";

type WeatherDay = {
  date: string;
  high: number;
  low: number;
  code: number;
};

type CurrentWeather = {
  temp: number;
  code: number;
  wind: number;
};

function weatherDesc(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 84) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

function shortDay(dateStr: string): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(dateStr + "T12:00:00").getDay()];
}

export default function WeatherStrip() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Benton, LA coordinates
    const url = "https://api.open-meteo.com/v1/forecast?latitude=32.6876&longitude=-93.7318&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago&forecast_days=5";

    fetch(url)
      .then(r => r.json())
      .then(data => {
        setCurrent({
          temp: Math.round(data.current_weather.temperature),
          code: data.current_weather.weathercode,
          wind: Math.round(data.current_weather.windspeed),
        });
        const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
          date,
          high: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
          code: data.daily.weathercode[i],
        }));
        setForecast(days);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !current) return null;

  return (
    <div style={{
      background: "#eeeae0",
      borderBottom: "1px solid #bbb",
      padding: "6px 16px",
      display: "flex",
      alignItems: "center",
      gap: 0,
      flexWrap: "wrap",
      fontSize: 11,
      fontFamily: "'Courier Prime', monospace",
      overflowX: "auto",
      whiteSpace: "nowrap",
    }}>
      {/* Location + current */}
      <span style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: "#fff",
        background: "#111",
        padding: "2px 8px",
        marginRight: 12,
        flexShrink: 0,
      }}>
        Benton, LA
      </span>

      <span style={{ marginRight: 12, color: "#111", fontWeight: 700, flexShrink: 0 }}>
        {weatherEmoji(current.code)} {current.temp}°F · {weatherDesc(current.code)} · Wind {current.wind} mph
      </span>

      <span style={{ color: "#bbb", marginRight: 12, flexShrink: 0 }}>|</span>

      {/* 5-day forecast */}
      {forecast.map((day, i) => (
        <span key={day.date} style={{ display: "inline-flex", alignItems: "center", marginRight: 12, flexShrink: 0 }}>
          <span style={{ color: "#555", marginRight: 4 }}>
            {i === 0 ? "Today" : shortDay(day.date)}
          </span>
          <span style={{ marginRight: 3 }}>{weatherEmoji(day.code)}</span>
          <span style={{ color: "#cc0000", fontWeight: 700 }}>{day.high}°</span>
          <span style={{ color: "#888", marginLeft: 2 }}>{day.low}°</span>
          {i < forecast.length - 1 && (
            <span style={{ color: "#ddd", marginLeft: 12 }}>·</span>
          )}
        </span>
      ))}
    </div>
  );
}