import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const OrderChart = ({ orders }) => {
  // State untuk menyimpan data harian, bulanan, dan tahunan
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    // Fungsi untuk mengelompokkan data berdasarkan tanggal
    const groupDataByDate = (data, interval) => {
      const groupedData = {};

      data.forEach((order) => {
        const date = new Date(order.created_at);
        let key = '';

        if (interval === 'daily') {
          key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } else if (interval === 'monthly') {
          key = `${date.getMonth() + 1}/${date.getFullYear()}`;
        } else if (interval === 'yearly') {
          key = `${date.getFullYear()}`;
        }

        if (!groupedData[key]) {
          groupedData[key] = 0;
        }

        groupedData[key] += 1;
      });

      return Object.entries(groupedData).map(([date, count]) => ({ date, count }));
    };

    // Mengelompokkan data berdasarkan tanggal dalam format harian, bulanan, dan tahunan
    const dailyDataGrouped = groupDataByDate(orders, 'daily');
    const monthlyDataGrouped = groupDataByDate(orders, 'monthly');
    const yearlyDataGrouped = groupDataByDate(orders, 'yearly');

    // Menyimpan data yang telah digroupkan ke dalam state
    setDailyData(dailyDataGrouped);
    setMonthlyData(monthlyDataGrouped);
    setYearlyData(yearlyDataGrouped);
  }, [orders]);

  // Mengatur opsi grafik
  // const chartConfig = {
  //   backgroundGradientFrom: "#1E2923",
  //   backgroundGradientFromOpacity: 0,
  //   backgroundGradientTo: "#08130D",
  //   backgroundGradientToOpacity: 0.5,
  //   color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  //   strokeWidth: 2, // optional, default 3
  //   barPercentage: 0.5,
  //   useShadowColorFromDataset: false // optional
  // };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Rainy Days"] // optional
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
      <ScrollView
            className="bg-white"
            contentContainerStyle={{
              paddingBottom: 100,
            }}
        >
      <View className="flex-col gap-6 justify-center items-center">

          <View className="flex-col justify-center items-center">
            <Text className="font-bold text-2xl pb-3">Laporan Harian</Text>  
            {
              (dailyData.length === 0) ?
                <ActivityIndicator animating={true}/>:
                <LineChart
              data={{
                labels: dailyData.map((data) => data.date),
                datasets: [
                  {
                    data: dailyData.map((data) => data.count),
                  },
                ],
              }}
              width={300}
              height={200}
              chartConfig={chartConfig}
            />
              }
          </View>

          <View className="flex-col justify-center items-center">
            <Text className="font-bold text-2xl pb-3">Laporan Bulanan</Text>  
            {
              (monthlyData.length === 0) ?
                <ActivityIndicator animating={true}/>:
                <LineChart
              data={{
                labels: monthlyData.map((data) => data.date),
                datasets: [
                  {
                    data: monthlyData.map((data) => data.count),
                  },
                ],
              }}
              width={300}
              height={200}
              chartConfig={chartConfig}
            />
              }
          </View>

          <View className="flex-col justify-center items-center">
            <Text className="font-bold text-2xl pb-3">Laporan Tahunan</Text>  
            {
              (yearlyData.length === 0) ?
                <ActivityIndicator animating={true}/>:
                <LineChart
              data={{
                labels: yearlyData.map((data) => data.date),
                datasets: [
                  {
                    data: yearlyData.map((data) => data.count),
                  },
                ],
              }}
              width={300}
              height={200}
              chartConfig={chartConfig}
            />
              }
          </View>

      </View>
    </ScrollView>
  );
};

export default OrderChart;
