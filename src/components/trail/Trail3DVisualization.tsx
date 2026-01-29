// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import Svg, { Path, Defs, LinearGradient, Stop, G, Circle, Rect, Text as SvgText } from 'react-native-svg';
// import { trail3DStyles } from '../../styles/components/trail3D.styles';

// interface Trail3DVisualizationProps {
//   coordinates: any;
//   trailName: string;
// }

// export default function Trail3DVisualization({ coordinates, trailName }: Trail3DVisualizationProps) {
//   const { width } = Dimensions.get('window');
  
//   const viewBoxWidth = 400;
//   const viewBoxHeight = 200;

//   if (!coordinates || !coordinates.coordinates || coordinates.coordinates.length === 0) {
//     return null;
//   }

//   // Get min/max values for normalization
//   const coords = coordinates.coordinates;
//   const lngs = coords.map((c: number[]) => c[0]);
//   const lats = coords.map((c: number[]) => c[1]);
//   const eles = coords.map((c: number[]) => c[2] || 0);

//   const minLng = Math.min(...lngs);
//   const maxLng = Math.max(...lngs);
//   const minLat = Math.min(...lats);
//   const maxLat = Math.max(...lats);
//   const minEle = Math.min(...eles);
//   const maxEle = Math.max(...eles);

//   // Convert GPS coordinates to isometric 3D projection
//   const convertToIsometric = (coord: number[]) => {
//     const [lng, lat, elevation = 0] = coord;

//     // Normalize to 0-1 range
//     const normLng = (lng - minLng) / (maxLng - minLng || 1);
//     const normLat = (lat - minLat) / (maxLat - minLat || 1);
//     const normEle = (elevation - minEle) / (maxEle - minEle || 1);

//     // Isometric projection
//     const scale = 200;
//     const elevationScale = 50;
//     const angle = Math.PI / 6;

//     const x = (normLng - normLat) * Math.cos(angle) * scale + viewBoxWidth / 2;
//     const y = (normLng + normLat) * Math.sin(angle) * scale - normEle * elevationScale + viewBoxHeight / 1.3;

//     return { x, y, elevation: normEle };
//   };

//   // Generate path points
//   const points = coords.map((coord: number[]) => convertToIsometric(coord));

//   // Create SVG path
//   const pathData = points.reduce((path: string, point: any, index: number) => {
//     const command = index === 0 ? 'M' : 'L';
//     return `${path} ${command}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
//   }, '');

//   // Key points for elevation labels
//   const startPoint = points[0];
//   const midPoint = points[Math.floor(points.length / 2)];
//   const endPoint = points[points.length - 1];

//   // Get actual elevations in feet
//   const startEleFt = Math.round((coords[0][2] || 0) * 3.28084);
//   const midEleFt = Math.round((coords[Math.floor(coords.length / 2)][2] || 0) * 3.28084);
//   const endEleFt = Math.round((coords[coords.length - 1][2] || 0) * 3.28084);

//   return (
//     <View style={trail3DStyles.container}>
//       <Svg width={width - 80} height={180} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
//         <Defs>
//           <LinearGradient id="terrainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
//             <Stop offset="0%" stopColor="#a8d5a8" stopOpacity="0.6" />
//             <Stop offset="100%" stopColor="#7fb57f" stopOpacity="0.8" />
//           </LinearGradient>
          
//           <LinearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//             <Stop offset="0%" stopColor="#8B6F47" stopOpacity="1" />
//             <Stop offset="50%" stopColor="#A0826D" stopOpacity="1" />
//             <Stop offset="100%" stopColor="#8B6F47" stopOpacity="1" />
//           </LinearGradient>
//         </Defs>

//         {/* Terrain base */}
//         <Path
//           d={`M 50,${viewBoxHeight - 20} Q 150,${viewBoxHeight - 40} 200,${viewBoxHeight - 30} Q 250,${viewBoxHeight - 20} 350,${viewBoxHeight - 35} L 350,${viewBoxHeight} L 50,${viewBoxHeight} Z`}
//           fill="url(#terrainGradient)"
//         />

//         {/* Trail shadow */}
//         <Path
//           d={pathData}
//           stroke="#000"
//           strokeWidth="6"
//           strokeOpacity="0.2"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
        
//         {/* Trail line */}
//         <Path
//           d={pathData}
//           stroke="url(#trailGradient)"
//           strokeWidth="4"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />

//         {/* Start marker */}
//         <G>
//           <Circle cx={startPoint.x} cy={startPoint.y} r="6" fill="#2d5a3f" stroke="#fff" strokeWidth="2" />
//           <Rect x={startPoint.x - 22} y={startPoint.y - 28} width="44" height="18" rx="9" fill="rgba(45, 90, 63, 0.95)" />
//           <SvgText x={startPoint.x} y={startPoint.y - 15} fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">
//             {startEleFt}′
//           </SvgText>
//         </G>

//         {/* Mid marker */}
//         <G>
//           <Circle cx={midPoint.x} cy={midPoint.y} r="5" fill="#2d5a3f" stroke="#fff" strokeWidth="2" />
//           <Rect x={midPoint.x - 22} y={midPoint.y - 28} width="44" height="18" rx="9" fill="rgba(45, 90, 63, 0.95)" />
//           <SvgText x={midPoint.x} y={midPoint.y - 15} fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">
//             {midEleFt}′
//           </SvgText>
//         </G>

//         {/* End marker */}
//         <G>
//           <Circle cx={endPoint.x} cy={endPoint.y} r="6" fill="#FF3B30" stroke="#fff" strokeWidth="2" />
//           <Rect x={endPoint.x - 22} y={endPoint.y - 28} width="44" height="18" rx="9" fill="rgba(255, 59, 48, 0.95)" />
//           <SvgText x={endPoint.x} y={endPoint.y - 15} fill="#fff" fontSize="10" fontWeight="700" textAnchor="middle">
//             {endEleFt}′
//           </SvgText>
//         </G>
//       </Svg>
//     </View>
//   );
// }