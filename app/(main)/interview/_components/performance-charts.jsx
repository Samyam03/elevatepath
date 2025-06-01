"use client";

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PerformanceChart = ({ assessments }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((item) => ({
        date: format(new Date(item.createdAt), 'MMM dd, yyyy'),
        score: item.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card className="bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Performance Trend</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Your quiz score over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#ccc' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937', // gray-800
                  border: '1px solid #374151', // gray-700
                  borderRadius: '0.5rem',
                  color: '#f9fafb', // gray-50
                }}
                labelStyle={{ color: '#9ca3af' }} // gray-400
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#60a5fa" // blue-400
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
