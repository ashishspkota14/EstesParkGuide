
import { Redirect } from "expo-router";

export default function RootIndex() {
  return <Redirect href="/tabs" />;
}



// import { View, Text, StyleSheet } from 'react-native';

// export default function Index() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🏔️ Estes Park Guide</Text>
//       <Text style={styles.subtitle}>App is running!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f4f1e8',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#2d5a3f',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#666',
//   },
// });
