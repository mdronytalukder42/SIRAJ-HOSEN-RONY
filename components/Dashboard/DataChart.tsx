
import React, { useEffect, useRef } from 'react';
import { IncomeEntry, EntryType } from '../../types';

declare const Chart: any; // Using global Chart from CDN

interface DataChartProps {
  entries: IncomeEntry[];
  timeframe: 'daily' | 'monthly' | 'yearly';
  year: string;
  month: string;
}

const DataChart: React.FC<DataChartProps> = ({ entries, timeframe, year, month }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Check if Chart.js is loaded and the canvas is ready
    if (!canvasRef.current || !entries || typeof Chart === 'undefined') return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let labels: string[] = [];
    const incomeData: number[] = [];
    const otpData: number[] = [];
    
    const calculateTotals = (entry: IncomeEntry, summary: { income: number; otp: number }) => {
        if (entry.type === EntryType.IncomeAdd) summary.income += entry.amount;
        else if (entry.type === EntryType.IncomeMinus || entry.type === EntryType.IncomePayment) summary.income -= entry.amount;
        else if (entry.type === EntryType.OTPAdd) summary.otp += entry.amount;
        else if (entry.type === EntryType.OTPMinus || entry.type === EntryType.OTPPayment) summary.otp -= entry.amount;
    };

    if (timeframe === 'yearly') {
        const yearlySummary: { [year: string]: { income: number, otp: number } } = {};
        entries.forEach(entry => {
            const entryYear = entry.date.substring(0, 4);
            if (!yearlySummary[entryYear]) {
                yearlySummary[entryYear] = { income: 0, otp: 0 };
            }
            calculateTotals(entry, yearlySummary[entryYear]);
        });
        
        labels = Object.keys(yearlySummary).sort();
        labels.forEach(y => {
            incomeData.push(yearlySummary[y].income);
            otpData.push(yearlySummary[y].otp);
        });
    } else if (timeframe === 'monthly' && year !== 'all') {
        const monthlySummary = Array(12).fill(0).map(() => ({ income: 0, otp: 0 }));
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        entries.filter(e => e.date.startsWith(year)).forEach(entry => {
            const entryMonth = parseInt(entry.date.substring(5, 7), 10) - 1;
            if (entryMonth >= 0 && entryMonth < 12) {
                calculateTotals(entry, monthlySummary[entryMonth]);
            }
        });
    
        monthlySummary.forEach(summary => {
            incomeData.push(summary.income);
            otpData.push(summary.otp);
        });
    } else if (timeframe === 'daily' && year !== 'all' && month !== 'all') {
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        const dailySummary = Array(daysInMonth).fill(0).map(() => ({ income: 0, otp: 0 }));
        labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        
        entries.filter(e => e.date.startsWith(`${year}-${month}`)).forEach(entry => {
            const day = parseInt(entry.date.substring(8, 10), 10) - 1;
            if (day >= 0 && day < daysInMonth) {
                calculateTotals(entry, dailySummary[day]);
            }
        });
    
        dailySummary.forEach(summary => {
            incomeData.push(summary.income);
            otpData.push(summary.otp);
        });
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#D1D5DB' } },
            tooltip: { 
                titleFont: { size: 14 }, 
                bodyFont: { size: 12 },
                backgroundColor: 'rgba(0,0,0,0.7)',
                multiKeyBackground: 'transparent'
             }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Daily Income',
            data: incomeData,
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total OTP Cash',
            data: otpData,
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    });

  }, [entries, timeframe, year, month]);

  return <canvas ref={canvasRef} />;
};

export default DataChart;
