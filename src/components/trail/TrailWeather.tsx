import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { trailWeatherStyles } from '../../styles/components/trailWeather.styles';
import { COLORS } from '../../constants/colors';

interface TrailWeatherProps {
  trail: any;
}

export default function TrailWeather({ trail }: TrailWeatherProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, [trail]);

  const fetchWeather = async () => {
    try {
      const lat = trail.start_lat || 40.3772;
      const lng = trail.start_lng || -105.5217;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver`
      );
      
      const data = await response.json();
      setWeather(data.current);
    } catch (error) {
      console.error('Weather fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return 'sunny';
    if (code <= 3) return 'partly-sunny';
    if (code <= 49) return 'cloudy';
    if (code <= 67) return 'rainy';
    if (code <= 86) return 'snow';
    return 'thunderstorm';
  };

  const getTrailConditions = (): string[] => {
    if (!weather) return [];
    
    const conditions: string[] = [];
    const temp = weather.temperature_2m;
    const humidity = weather.relative_humidity_2m;
    const wind = weather.wind_speed_10m;
    const elevation = trail.elevation_gain_ft || 0;

    if (temp > 85) {
      conditions.push('🌡️ Hot conditions - bring extra water');
    } else if (temp < 40) {
      conditions.push('❄️ Cold weather - dress in layers');
    } else {
      conditions.push('✅ Comfortable hiking temperature');
    }

    if (wind > 20) {
      conditions.push('💨 Windy conditions - secure loose items');
    }

    if (humidity > 70) {
      conditions.push('💧 High humidity - pace yourself');
    }

    if (elevation > 1500) {
      conditions.push('⛰️ Significant elevation gain - take breaks');
    }

    if (trail.shade_coverage === 'limited') {
      conditions.push('☀️ Limited shade - bring sun protection');
    } else if (trail.shade_coverage === 'full') {
      conditions.push('🌲 Shaded trail - cooler conditions');
    }

    return conditions;
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

  const conditions = getTrailConditions();
  const weatherIcon = getWeatherIcon(weather.weather_code);

  return (
    <View style={trailWeatherStyles.container}>
      <Text style={trailWeatherStyles.title}>Weather & Trail Conditions</Text>
      
      <View style={trailWeatherStyles.weatherCard}>
        {/* Current Weather */}
        <View style={trailWeatherStyles.currentWeather}>
          <Ionicons name={weatherIcon} size={48} color={COLORS.primary} />
          <View style={trailWeatherStyles.tempContainer}>
            <Text style={trailWeatherStyles.temperature}>
              {Math.round(weather.temperature_2m)}°F
            </Text>
            <Text style={trailWeatherStyles.weatherDesc}>Right Now</Text>
          </View>
        </View>

        {/* Weather Stats */}
        <View style={trailWeatherStyles.statsRow}>
          <View style={trailWeatherStyles.statItem}>
            <Ionicons name="water-outline" size={20} color={COLORS.textLight} />
            <Text style={trailWeatherStyles.statValue}>{weather.relative_humidity_2m}%</Text>
            <Text style={trailWeatherStyles.statLabel}>Humidity</Text>
          </View>
          <View style={trailWeatherStyles.statDivider} />
          <View style={trailWeatherStyles.statItem}>
            <Ionicons name="speedometer-outline" size={20} color={COLORS.textLight} />
            <Text style={trailWeatherStyles.statValue}>{Math.round(weather.wind_speed_10m)} mph</Text>
            <Text style={trailWeatherStyles.statLabel}>Wind</Text>
          </View>
        </View>
      </View>

      {/* Trail Insights */}
      <View style={trailWeatherStyles.insightsCard}>
        <Text style={trailWeatherStyles.insightsTitle}>What to Expect on Trail</Text>
        {conditions.map((condition, index) => (
          <View key={index} style={trailWeatherStyles.insightItem}>
            <Text style={trailWeatherStyles.insightText}>{condition}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}