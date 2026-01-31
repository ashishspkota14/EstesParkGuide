import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useColors } from '../../context/ThemeContext';
import { trailConditionsStyles } from '../../styles/components/trailConditions.styles';

interface TrailConditionsProps {
  trail: any;
}

interface Condition {
  emoji: string;
  text: string;
}

export default function TrailConditions({ trail }: TrailConditionsProps) {
  const COLORS = useColors();
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherAndGenerateConditions();
  }, [trail]);

  const fetchWeatherAndGenerateConditions = async () => {
    try {
      const lat = trail.trailhead_lat;
      const lng = trail.trailhead_lon;
      
      if (!lat || !lng) {
        const trailOnlyConditions = generateTrailOnlyConditions();
        setConditions(trailOnlyConditions);
        setLoading(false);
        return;
      }
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,apparent_temperature&daily=precipitation_sum,snowfall_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/Denver&past_days=3&forecast_days=1`
      );
      
      const data = await response.json();
      const weather = data.current;
      
      let pastRain = 0;
      let pastSnow = 0;
      if (data.daily?.precipitation_sum && data.daily?.snowfall_sum) {
        pastRain = (data.daily.precipitation_sum[0] || 0) + 
                   (data.daily.precipitation_sum[1] || 0) + 
                   (data.daily.precipitation_sum[2] || 0);
        pastSnow = (data.daily.snowfall_sum[0] || 0) + 
                   (data.daily.snowfall_sum[1] || 0) + 
                   (data.daily.snowfall_sum[2] || 0);
      }
      
      const generatedConditions = generateConditions(weather, pastRain, pastSnow);
      setConditions(generatedConditions);
    } catch (error) {
      console.error('Error fetching weather for conditions:', error);
      const trailOnlyConditions = generateTrailOnlyConditions();
      setConditions(trailOnlyConditions);
    } finally {
      setLoading(false);
    }
  };

  const generateConditions = (weather: any, pastRain: number, pastSnow: number): Condition[] => {
    const conditions: Condition[] = [];
    const temp = weather?.temperature_2m;
    const feelsLike = weather?.apparent_temperature || temp;
    const wind = weather?.wind_speed_10m;
    const elevation = trail.elevation_gain_ft || 0;
    const distance = trail.distance_miles || 0;
    const difficulty = trail.difficulty || 'moderate';
    const trailElevation = trail.trailhead_elevation_ft || 8000;
    
    const month = new Date().getMonth();
    const isWinterSeason = month >= 10 || month <= 2;
    const hadRecentRain = pastRain > 0.1;
    const hadRecentSnow = pastSnow > 0.5;
    const isHighElevation = trailElevation > 9500;

    if (temp !== undefined) {
      if (temp < 32 || feelsLike < 25) {
        if (hadRecentSnow || hadRecentRain) {
          conditions.push({ emoji: '🧊', text: 'Icy conditions likely - traction devices recommended' });
        } else if (isWinterSeason) {
          conditions.push({ emoji: '🥶', text: 'Freezing temps - expect frozen/slippery sections' });
        } else {
          conditions.push({ emoji: '❄️', text: 'Cold weather - dress in layers and bring warm gear' });
        }
      } else if (temp >= 32 && temp < 40) {
        if (hadRecentSnow) {
          conditions.push({ emoji: '🌨️', text: 'Slushy conditions - waterproof boots recommended' });
        } else if (hadRecentRain) {
          conditions.push({ emoji: '💧', text: 'Wet and cold - dress warmly and watch footing' });
        } else {
          conditions.push({ emoji: '🧥', text: 'Cool weather - bring a jacket and layer up' });
        }
      } else if (temp >= 40 && temp < 55) {
        conditions.push({ emoji: '🧥', text: 'Cool weather - bring a jacket and layer up' });
      } else if (temp >= 55 && temp < 70) {
        conditions.push({ emoji: '✅', text: 'Perfect hiking temperature - comfortable conditions' });
      } else if (temp >= 70 && temp < 85) {
        conditions.push({ emoji: '☀️', text: 'Warm weather - wear breathable clothing and sunscreen' });
      } else if (temp >= 85) {
        conditions.push({ emoji: '🌡️', text: 'Hot conditions - bring extra water and sun protection' });
      }
    }

    if (wind !== undefined) {
      if (wind > 25) {
        conditions.push({ emoji: '💨', text: 'Very windy - secure loose items and use caution' });
      } else if (wind > 15) {
        conditions.push({ emoji: '🍃', text: 'Breezy conditions - bring a windbreaker' });
      } else if (wind > 8) {
        conditions.push({ emoji: '🌬️', text: 'Light breeze - pleasant hiking conditions' });
      } else {
        conditions.push({ emoji: '🍃', text: 'Calm winds - ideal conditions for the trail' });
      }
    }

    if (hadRecentRain && temp > 40 && !hadRecentSnow) {
      conditions.push({ emoji: '🟤', text: 'Muddy sections likely - waterproof footwear advised' });
    } else if (hadRecentSnow && temp >= 32) {
      conditions.push({ emoji: '🌨️', text: 'Snow on trail - check depth before heading out' });
    } else if (isHighElevation && isWinterSeason && temp < 45) {
      conditions.push({ emoji: '⚠️', text: 'High elevation winter trail - ice possible even if clear' });
    }

    if (elevation > 2000) {
      conditions.push({ emoji: '⛰️', text: 'Significant elevation gain - take breaks frequently' });
    } else if (elevation > 1000) {
      conditions.push({ emoji: '📈', text: 'Moderate elevation gain - steady pace recommended' });
    } else if (elevation > 500) {
      conditions.push({ emoji: '🥾', text: 'Gradual elevation gain - good for all fitness levels' });
    } else {
      conditions.push({ emoji: '🚶', text: 'Minimal elevation change - easy walking terrain' });
    }

    if (distance > 8) {
      conditions.push({ emoji: '🥾', text: 'Long trail - start early and bring supplies' });
    } else if (distance > 5) {
      conditions.push({ emoji: '🚶', text: 'Moderate distance - plan for 3-4 hours on trail' });
    } else if (distance > 2) {
      conditions.push({ emoji: '⏱️', text: 'Medium length hike - allow 1-2 hours to complete' });
    } else {
      conditions.push({ emoji: '👟', text: 'Short trail - great for a quick outdoor adventure' });
    }

    if (conditions.length < 5) {
      if (difficulty === 'hard' || difficulty === 'expert') {
        conditions.push({ emoji: '⚠️', text: 'Challenging trail - experience and fitness required' });
      } else if (difficulty === 'moderate') {
        conditions.push({ emoji: '🏔️', text: 'Moderate difficulty - some fitness required' });
      } else {
        conditions.push({ emoji: '✨', text: 'Easy trail - suitable for beginners and families' });
      }
    }

    return conditions.slice(0, 5);
  };

  const generateTrailOnlyConditions = (): Condition[] => {
    const conditions: Condition[] = [];
    const elevation = trail.elevation_gain_ft || 0;
    const distance = trail.distance_miles || 0;
    const difficulty = trail.difficulty || 'moderate';

    conditions.push({ emoji: '🌤️', text: 'Check local weather before heading out' });

    if (elevation > 2000) {
      conditions.push({ emoji: '⛰️', text: 'Significant elevation gain - take breaks frequently' });
    } else if (elevation > 1000) {
      conditions.push({ emoji: '📈', text: 'Moderate elevation gain - steady pace recommended' });
    } else if (elevation > 500) {
      conditions.push({ emoji: '🥾', text: 'Gradual elevation gain - good for all fitness levels' });
    } else {
      conditions.push({ emoji: '🚶', text: 'Minimal elevation change - easy walking terrain' });
    }

    if (distance > 8) {
      conditions.push({ emoji: '🥾', text: 'Long trail - start early and bring supplies' });
    } else if (distance > 5) {
      conditions.push({ emoji: '🚶', text: 'Moderate distance - plan for 3-4 hours on trail' });
    } else if (distance > 2) {
      conditions.push({ emoji: '⏱️', text: 'Medium length hike - allow 1-2 hours to complete' });
    } else {
      conditions.push({ emoji: '👟', text: 'Short trail - great for a quick outdoor adventure' });
    }

    if (difficulty === 'hard' || difficulty === 'expert') {
      conditions.push({ emoji: '⚠️', text: 'Challenging trail - be prepared' });
    } else if (difficulty === 'moderate') {
      conditions.push({ emoji: '🏔️', text: 'Moderate difficulty - some fitness required' });
    } else {
      conditions.push({ emoji: '✨', text: 'Easy trail - suitable for beginners and families' });
    }

    conditions.push({ emoji: '💧', text: 'Bring water and snacks for your hike' });

    return conditions.slice(0, 5);
  };

  // Dynamic card colors - only background and left border change with theme
  const dynamicCardStyle = {
    backgroundColor: `${COLORS.primary}15`, // Light tint of primary (was #E8F5E9)
    borderLeftColor: COLORS.primary,         // Left accent (was static COLORS.primary)
  };

  if (loading) {
    return (
      <View style={trailConditionsStyles.container}>
        <View style={[trailConditionsStyles.card, dynamicCardStyle]}>
          <Text style={trailConditionsStyles.title}>Trail Conditions</Text>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (conditions.length === 0) {
    return null;
  }

  return (
    <View style={trailConditionsStyles.container}>
      <View style={[trailConditionsStyles.card, dynamicCardStyle]}>
        {/* Title and text use stylesheet colors - no changes */}
        <Text style={trailConditionsStyles.title}>Trail Conditions</Text>
        <View style={trailConditionsStyles.conditionsList}>
          {conditions.map((condition, index) => (
            <View key={`condition-${index}`} style={trailConditionsStyles.conditionItem}>
              <Text style={trailConditionsStyles.conditionEmoji}>{condition.emoji}</Text>
              <Text style={trailConditionsStyles.conditionText}>{condition.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}