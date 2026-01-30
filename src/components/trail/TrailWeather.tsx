import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { trailWeatherStyles } from '../../styles/components/trailWeather.styles';
import { COLORS } from '../../constants/colors';

interface TrailWeatherProps {
  trail: any;
}

interface ForecastDay {
  day: string;
  date: string;
  icon: string;
  high: number;
  low: number;
  rainChance: number;
  weatherCode: number;
  condition: string;
}

export default function TrailWeather({ trail }: TrailWeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [sunTimes, setSunTimes] = useState<{ sunrise: string; sunset: string } | null>(null);
  const [pastPrecipitation, setPastPrecipitation] = useState<{ rain: number; snow: number }>({ rain: 0, snow: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Today

  useEffect(() => {
    fetchWeather();
  }, [trail]);

  const fetchWeather = async () => {
    try {
      const lat = trail.trailhead_lat;
      const lng = trail.trailhead_lon;
      
      if (!lat || !lng) {
        console.warn('Trail missing coordinates:', trail.name);
        setLoading(false);
        return;
      }
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,precipitation_sum,snowfall_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver&forecast_days=7&past_days=3`
      );
      
      const data = await response.json();
      setWeather(data.current);
      
      // Calculate past 3 days precipitation
      if (data.daily?.precipitation_sum && data.daily?.snowfall_sum) {
        const pastRain = (data.daily.precipitation_sum[0] || 0) + 
                         (data.daily.precipitation_sum[1] || 0) + 
                         (data.daily.precipitation_sum[2] || 0);
        const pastSnow = (data.daily.snowfall_sum[0] || 0) + 
                         (data.daily.snowfall_sum[1] || 0) + 
                         (data.daily.snowfall_sum[2] || 0);
        setPastPrecipitation({ rain: pastRain, snow: pastSnow });
      }
      
      const todayIndex = 3;
      if (data.daily?.sunrise?.[todayIndex] && data.daily?.sunset?.[todayIndex]) {
        const sunriseDate = new Date(data.daily.sunrise[todayIndex]);
        const sunsetDate = new Date(data.daily.sunset[todayIndex]);
        setSunTimes({
          sunrise: sunriseDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
          sunset: sunsetDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        });
      }
      
      // Build forecast data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      
      const forecastData: ForecastDay[] = data.daily.time.slice(todayIndex, todayIndex + 7).map((dateStr: string, index: number) => {
        const date = new Date(dateStr);
        const weatherCode = data.daily.weather_code[todayIndex + index];
        return {
          day: index === 0 ? 'Today' : days[(today.getDay() + index) % 7],
          date: `${months[date.getMonth()]} ${date.getDate()}`,
          icon: getWeatherIcon(weatherCode),
          high: Math.round(data.daily.temperature_2m_max[todayIndex + index]),
          low: Math.round(data.daily.temperature_2m_min[todayIndex + index]),
          rainChance: data.daily.precipitation_probability_max?.[todayIndex + index] || 0,
          weatherCode: weatherCode,
          condition: getWeatherCondition(weatherCode),
        };
      });
      setForecast(forecastData);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number): any => {
    if (code === 0) return 'sunny';
    if (code <= 3) return 'partly-sunny';
    if (code <= 49) return 'cloudy';
    if (code <= 67) return 'rainy';
    if (code <= 86) return 'snow';
    return 'thunderstorm';
  };

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'Clear & Sunny';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 49) return 'Cloudy';
    if (code <= 55) return 'Light Rain';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snow';
    if (code <= 86) return 'Heavy Snow';
    return 'Stormy';
  };

  const getIconColor = (code: number): string => {
    if (code === 0) return '#FFD700';
    if (code <= 3) return '#FFA500';
    if (code <= 49) return '#9E9E9E';
    if (code <= 67) return '#5DADE2';
    if (code <= 86) return '#74B9FF';
    return '#9B59B6';
  };

  // SMART TRAIL CONDITION LOGIC
  const getTodayCondition = (): { text: string; emoji: string; color: string } => {
    if (!weather) return { text: 'Unknown', emoji: '❓', color: '#666' };
    
    const code = weather.weather_code;
    const temp = weather.temperature_2m;
    const feelsLike = weather.apparent_temperature || temp;
    const trailElevation = trail.trailhead_elevation_ft || 8000;
    const month = new Date().getMonth();
    
    const hadRecentRain = pastPrecipitation.rain > 0.1;
    const hadRecentSnow = pastPrecipitation.snow > 0.5;
    const isWinterSeason = month >= 10 || month <= 2;
    const isHighElevation = trailElevation > 9500;

    if (code >= 71 && code <= 86) {
      return { text: 'Snowy Trail', emoji: '❄️', color: '#5DADE2' };
    }
    if (temp < 32 || feelsLike < 25) {
      if (hadRecentSnow || hadRecentRain) {
        return { text: 'Icy Conditions', emoji: '🧊', color: '#74B9FF' };
      }
      if (isWinterSeason) {
        return { text: 'Frozen & Slippery', emoji: '🥶', color: '#74B9FF' };
      }
      return { text: 'Cold & Icy', emoji: '🧊', color: '#74B9FF' };
    }
    if (temp >= 32 && temp < 40) {
      if (hadRecentSnow) {
        return { text: 'Slushy Trail', emoji: '🌨️', color: '#85C1E9' };
      }
      if (hadRecentRain) {
        return { text: 'Wet & Cold', emoji: '💧', color: '#85929E' };
      }
      if (isHighElevation && isWinterSeason) {
        return { text: 'Possibly Icy', emoji: '⚠️', color: '#F39C12' };
      }
    }
    if (code >= 51 && code <= 67) {
      return { text: 'Rainy & Muddy', emoji: '🌧️', color: '#85929E' };
    }
    if (hadRecentRain && temp > 40) {
      return { text: 'Muddy Trail', emoji: '🟤', color: '#8B6F47' };
    }
    if (temp > 85) {
      return { text: 'Hot & Dry', emoji: '🔥', color: '#E74C3C' };
    }
    if (temp > 75 && code === 0) {
      return { text: 'Warm & Dry', emoji: '☀️', color: '#F39C12' };
    }
    if (code === 0 && temp >= 50 && temp <= 75 && !hadRecentRain && !hadRecentSnow) {
      return { text: 'Perfect Conditions', emoji: '✨', color: '#27AE60' };
    }
    if (code <= 3 && temp >= 40 && temp <= 80) {
      if (hadRecentRain) {
        return { text: 'Drying Out', emoji: '🌤️', color: '#3498DB' };
      }
      return { text: 'Good Conditions', emoji: '👍', color: '#27AE60' };
    }
    if (code <= 49 && temp >= 40) {
      return { text: 'Overcast', emoji: '☁️', color: '#95A5A6' };
    }
    return { text: 'Check Conditions', emoji: '🔍', color: '#9B59B6' };
  };

  // Get display weather based on selected day
  const getDisplayWeather = () => {
    if (selectedDayIndex === 0 && weather) {
      // Today - use current weather
      return {
        temp: Math.round(weather.temperature_2m),
        feelsLike: Math.round(weather.apparent_temperature || weather.temperature_2m),
        condition: getWeatherCondition(weather.weather_code),
        icon: getWeatherIcon(weather.weather_code),
        iconColor: getIconColor(weather.weather_code),
        humidity: weather.relative_humidity_2m,
        wind: Math.round(weather.wind_speed_10m),
        isToday: true,
      };
    } else if (forecast[selectedDayIndex]) {
      // Future day - use forecast
      const day = forecast[selectedDayIndex];
      return {
        temp: day.high,
        feelsLike: day.low,
        condition: day.condition,
        icon: day.icon,
        iconColor: getIconColor(day.weatherCode),
        humidity: null,
        wind: null,
        isToday: false,
        high: day.high,
        low: day.low,
      };
    }
    return null;
  };

  if (loading) {
    return (
      <View style={trailWeatherStyles.container}>
        <Text style={trailWeatherStyles.title}>Weather & Conditions</Text>
        <View style={trailWeatherStyles.loader}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (!weather) return null;

  const todayCondition = getTodayCondition();
  const displayWeather = getDisplayWeather();
  const selectedDay = forecast[selectedDayIndex];

  return (
    <View style={trailWeatherStyles.container}>
      <Text style={trailWeatherStyles.title}>Weather & Conditions</Text>
      
      {/* Current/Selected Weather Hero Card */}
      <View style={trailWeatherStyles.heroCard}>
        {/* Selected Day Label */}
        {selectedDayIndex > 0 && selectedDay && (
          <View style={trailWeatherStyles.selectedDayBadge}>
            <Text style={trailWeatherStyles.selectedDayText}>
              {selectedDay.day} • {selectedDay.date}
            </Text>
          </View>
        )}
        
        <View style={trailWeatherStyles.currentWeather}>
          <View style={trailWeatherStyles.iconContainer}>
            <Ionicons 
              name={displayWeather?.icon as any} 
              size={48} 
              color={displayWeather?.iconColor || '#FFD700'} 
            />
          </View>
          <View style={trailWeatherStyles.tempSection}>
            <Text style={trailWeatherStyles.temperature}>
              {displayWeather?.temp}°
            </Text>
            <Text style={trailWeatherStyles.weatherCondition}>
              {displayWeather?.condition}
            </Text>
            <Text style={trailWeatherStyles.feelsLike}>
              {displayWeather?.isToday 
                ? `Feels like ${displayWeather?.feelsLike}°`
                : `Low ${displayWeather?.low}° • High ${displayWeather?.high}°`
              }
            </Text>
          </View>
        </View>

        {/* Stats - Only show for Today */}
        {displayWeather?.isToday && (
          <View style={trailWeatherStyles.statsGrid}>
            <View style={trailWeatherStyles.statBox}>
              <Ionicons name="water-outline" size={18} color={COLORS.primary} />
              <Text style={trailWeatherStyles.statValue}>{displayWeather.humidity}%</Text>
              <Text style={trailWeatherStyles.statLabel}>Humidity</Text>
            </View>
            <View style={trailWeatherStyles.statBox}>
              <Ionicons name="speedometer-outline" size={18} color={COLORS.primary} />
              <Text style={trailWeatherStyles.statValue}>{displayWeather.wind} mph</Text>
              <Text style={trailWeatherStyles.statLabel}>Wind</Text>
            </View>
          </View>
        )}

        {/* Sunrise/Sunset - Only show for Today */}
        {displayWeather?.isToday && sunTimes && (
          <View style={trailWeatherStyles.sunTimesRow}>
            <View style={trailWeatherStyles.sunTimeBox}>
              <Ionicons name="sunny-outline" size={18} color="#F39C12" />
              <View>
                <Text style={trailWeatherStyles.sunTimeLabel}>Sunrise</Text>
                <Text style={trailWeatherStyles.sunTimeValue}>{sunTimes.sunrise}</Text>
              </View>
            </View>
            <View style={trailWeatherStyles.sunTimeDivider} />
            <View style={trailWeatherStyles.sunTimeBox}>
              <Ionicons name="moon-outline" size={18} color="#9B59B6" />
              <View>
                <Text style={trailWeatherStyles.sunTimeLabel}>Sunset</Text>
                <Text style={trailWeatherStyles.sunTimeValue}>{sunTimes.sunset}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 7-Day Forecast - CLICKABLE */}
      <Text style={trailWeatherStyles.forecastTitle}>7-Day Forecast</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={trailWeatherStyles.forecastScroll}
        contentContainerStyle={trailWeatherStyles.forecastContent}
      >
        {forecast.map((day, index) => (
          <TouchableOpacity
            key={`forecast-${index}`}
            style={[
              trailWeatherStyles.forecastDay,
              index === selectedDayIndex && trailWeatherStyles.forecastDaySelected
            ]}
            onPress={() => setSelectedDayIndex(index)}
            activeOpacity={0.7}
          >
            <Text style={[
              trailWeatherStyles.dayName,
              index === selectedDayIndex && trailWeatherStyles.dayNameSelected
            ]}>
              {day.day}
            </Text>
            
            <View style={[
              trailWeatherStyles.forecastIconWrap,
              index === selectedDayIndex && trailWeatherStyles.forecastIconWrapSelected
            ]}>
              <Ionicons 
                name={day.icon as any} 
                size={24} 
                color={index === selectedDayIndex ? COLORS.white : getIconColor(day.weatherCode)} 
              />
            </View>
            
            <Text style={[
              trailWeatherStyles.tempHigh,
              index === selectedDayIndex && trailWeatherStyles.tempHighSelected
            ]}>
              {day.high}°
            </Text>
            <Text style={[
              trailWeatherStyles.tempLow,
              index === selectedDayIndex && trailWeatherStyles.tempLowSelected
            ]}>
              {day.low}°
            </Text>
            
            {day.rainChance > 20 && (
              <View style={[
                trailWeatherStyles.rainChance,
                index === selectedDayIndex && trailWeatherStyles.rainChanceSelected
              ]}>
                <Ionicons name="water" size={10} color={index === selectedDayIndex ? COLORS.white : '#1976D2'} />
                <Text style={[
                  trailWeatherStyles.rainChanceText,
                  index === selectedDayIndex && trailWeatherStyles.rainChanceTextSelected
                ]}>
                  {day.rainChance}%
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Today's Trail Condition - COMPACT */}
      <View style={trailWeatherStyles.todayConditionCard}>
        <View style={[trailWeatherStyles.todayConditionBadge, { backgroundColor: todayCondition.color + '15' }]}>
          <Text style={trailWeatherStyles.todayConditionEmoji}>{todayCondition.emoji}</Text>
          <View style={trailWeatherStyles.todayConditionContent}>
            <Text style={trailWeatherStyles.todayConditionLabel}>Today's Trail Condition</Text>
            <Text style={[trailWeatherStyles.todayConditionText, { color: todayCondition.color }]}>
              {todayCondition.text}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}