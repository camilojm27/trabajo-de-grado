// @ts-nocheck
import {useEffect, useRef, useState} from "react";
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);
export default function CpuUsage({cpuUsage}: {cpuUsage: number}) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const maxDataPoints = 10; // Set the maximum number of data points to display

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        // @ts-ignore
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        fill: true,
                        label: 'CPU Usage',
                        data: [],
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                    },
                },
            },
        });

        return () => {
            chartInstance.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            const chart = chartInstance.current;
            const now = new Date().toLocaleTimeString();

            if (chart.data.labels.length > maxDataPoints) {
                chart.data.labels.shift(); // Remove the oldest label
                chart.data.datasets[0].data.shift(); // Remove the oldest data point
            }

            chart.data.labels.push(now);
            chart.data.datasets[0].data.push(cpuUsage);
            chart.update();
        }
    }, [cpuUsage]);


    return <canvas ref={chartRef} />;
}
