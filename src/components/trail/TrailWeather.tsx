import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { trailWeatherStyles, elevationStyles } from '../../styles/components/trailWeather.styles';

interface TrailWeatherProps {
  trail: any;
}

function ElevationProfile({ coordinates }: { coordinates: any }) {
  if (!coordinates || !coordinates.coordinates || coordinates.coordinates.length < 2) {
    return null;
  }

  const coords = coordinates.coordinates;
  const elevations = coords.map((c: number[]) => c[2] || 0);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  const eleRange = maxEle - minEle || 1;

  const sampleSize = Math.min(30, coords.length);
  const step = Math.floor(coords.length / sampleSize);
  const sampledElevations: number[] = [];
  
  for (let i = 0; i < coords.length; i += step) {
    sampledElevations.push(elevations[i]);
  }

  const maxHeight = 60;
  const bars = sampledElevations.map((ele: number) => {
    const normalized = (ele - minEle) / eleRange;
    return Math.max(8, normalized * maxHeight);
  });

  const startEleFt = Math.round(elevations[0] * 3.28084);
  const maxEleFt = Math.round(maxEle * 3.28084);
  const endEleFt = Math.round(elevations[elevations.length - 1] * 3.28084);

  return (
    <View style={elevationStyles.container}>
      <View style={elevationStyles.labelsRow}>
        <View style={elevationStyles.labelBox}>
          <Text style={elevationStyles.labelValue}>{startEleFt.toLocaleString()}'</Text>
          <Text style={elevationStyles.labelText}>Start</Text>
        </View>
        <View style={[elevationStyles.labelBox, elevationStyles.labelBoxPeak]}>
          <Text style={elevationStyles.labelValue}>{maxEleFt.toLocaleString()}'</Text>
          <Text style={elevationStyles.labelText}>Peak</Text>
        </View>
        <View style={elevationStyles.labelBox}>
          <Text style={elevationStyles.labelValue}>{endEleFt.toLocaleString()}'</Text>
          <Text style={elevationStyles.labelText}>End</Text>
        </View>
      </View>

      <View style={elevationStyles.barsContainer}>
        {bars.map((height: number, index: number) => {
          const bgColor = index === 0 ? COLORS.primary : index === bars.length - 1 ? '#FF3B30' : '#8B6F47';
          return (
            // @ts-ignore
            <View key={`bar-${index}`} style={[elevationStyles.bar, { height: height, backgroundColor: bgColor }]} />
          );
        })}
      </View>

      <View style={elevationStyles.distanceRow}>
        <Text style={elevationStyles.distanceText}>0 mi</Text>
        <Text style={elevationStyles.distanceText}>
          {((coords.length * 0.01) / 2).toFixed(1)} mi
        </Text>
        <Text style={elevationStyles.distanceText}>
          {(coords.length * 0.01).toFixed(1)} mi
        </Text>
      </View>
    </View>
  );
}

export default function TrailWeather({ trail }: TrailWeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, [trail]);

  const fetchWeather = async () => {
    try {
      const lat = trail.trailhead_lat || 40.3772;
      const lng = trail.trailhead_lon || -105.5217;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver&forecast_days=7`
      );
      
      const data = await response.json();
      setWeather(data.current);
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      const forecastData = data.daily.time.slice(0, 7).map((date: string, index: number) => ({
        day: index === 0 ? 'Today' : days[(today + index) % 7],
        icon: getWeatherIcon(data.daily.weather_code[index]),
        high: Math.round(data.daily.temperature_2m_max[index]),
        low: Math.round(data.daily.temperature_2m_min[index]),
      }));
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
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 49) return 'Cloudy';
    if (code <= 67) return 'Rain';
    if (code <= 86) return 'Snow';
    return 'Storms';
  };

  const getTrailInsights = (): string[] => {
    if (!weather) return [];
    
    const insights: string[] = [];
    const temp = weather.temperature_2m;
    const wind = weather.wind_speed_10m;
    const elevation = trail.elevation_gain_ft || 0;

    if (temp > 85) {
      insights.push('🌡️ Hot conditions - bring extra water and sun protection');
    } else if (temp < 40) {
      insights.push('❄️ Cold weather - dress in layers and bring warm gear');
    } else if (temp >= 55 && temp <= 75) {
      insights.push('✅ Perfect hiking temperature today!');
    } else {
      insights.push('🌤️ Moderate temperature - dress in layers');
    }

    if (wind > 25) {
      insights.push('💨 Strong winds expected - secure loose items');
    } else if (wind > 15) {
      insights.push('🌬️ Breezy - bring a windbreaker for exposed sections');
    } else {
      insights.push('🍃 Light winds - comfortable hiking conditions');
    }

    if (elevation > 2000) {
      insights.push('⛰️ High elevation gain - take breaks and stay hydrated');
    } else if (elevation > 1000) {
      insights.push('📈 Moderate climb - pace yourself on steep sections');
    }

    if (temp > 75) {
      insights.push('🌅 Best to start early morning to avoid afternoon heat');
    }

    if (trail.difficulty === 'hard' || trail.difficulty === 'expert') {
      insights.push('⚠️ Challenging trail - ensure proper preparation');
    }

    return insights.slice(0, 4);
  };

  if (loading) {
    return (
      <View style={trailWeatherStyles.container}>
        <Text style={trailWeatherStyles.title}>Weather</Text>
        <View style={trailWeatherStyles.loader}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (!weather) return null;

  const insights = getTrailInsights();
  const weatherIcon = getWeatherIcon(weather.weather_code);
  const weatherCondition = getWeatherCondition(weather.weather_code);

  return (
    <View style={trailWeatherStyles.container}>
      <Text style={trailWeatherStyles.title}>Weather</Text>
      
      <View style={trailWeatherStyles.heroCard}>
        <View style={trailWeatherStyles.currentWeather}>
          <View style={trailWeatherStyles.iconContainer}>
            <Ionicons name={weatherIcon} size={48} color="#FFD700" />
          </View>
          <View style={trailWeatherStyles.tempSection}>
            <Text style={trailWeatherStyles.temperature}>
              {Math.round(weather.temperature_2m)}°
            </Text>
            <Text style={trailWeatherStyles.weatherCondition}>{weatherCondition}</Text>
          </View>
        </View>

        <View style={trailWeatherStyles.statsGrid}>
          <View style={trailWeatherStyles.statBox}>
            <Ionicons name="water-outline" size={18} color={COLORS.primary} />
            <Text style={trailWeatherStyles.statValue}>{weather.relative_humidity_2m}%</Text>
            <Text style={trailWeatherStyles.statLabel}>Humidity</Text>
          </View>
          <View style={trailWeatherStyles.statBox}>
            <Ionicons name="speedometer-outline" size={18} color={COLORS.primary} />
            <Text style={trailWeatherStyles.statValue}>{Math.round(weather.wind_speed_10m)} mph</Text>
            <Text style={trailWeatherStyles.statLabel}>Wind</Text>
          </View>
        </View>
      </View>

      <Text style={trailWeatherStyles.sectionTitle}>7-Day Forecast</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={trailWeatherStyles.forecastScroll}
      >
        {forecast.map((day, index) => (
          // @ts-ignore
          <View key={`forecast-${index}`} style={trailWeatherStyles.forecastDay}>
            <Text style={trailWeatherStyles.dayName}>{day.day}</Text>
            <Ionicons name={day.icon} size={24} color={COLORS.primary} />
            <Text style={trailWeatherStyles.tempHigh}>{day.high}°</Text>
            <Text style={trailWeatherStyles.tempLow}>{day.low}°</Text>
          </View>
        ))}
      </ScrollView>

      {trail.route_coordinates && (
        <>
          <Text style={trailWeatherStyles.sectionTitle}>Elevation Profile</Text>
          <View style={trailWeatherStyles.elevationCard}>
            <ElevationProfile coordinates={trail.route_coordinates} />
          </View>
        </>
      )}

      <Text style={trailWeatherStyles.sectionTitle}>Trail Conditions</Text>
      <View style={trailWeatherStyles.insightsCard}>
        {insights.map((insight, index) => (
          // @ts-ignore
          <View key={`insight-${index}`} style={trailWeatherStyles.insightItem}>
            <Text style={trailWeatherStyles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}