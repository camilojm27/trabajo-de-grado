// @ts-nocheck
import {useEffect, useRef} from "react";
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);
// @ts-ignore
export default function NetUsage({data}) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const maxDataPoints = 20; // Set the maximum number of data points to display
    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        // @ts-ignore
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        fill: false,
                        label: 'Send',
                        data: [],
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        fill: false,
                        label: 'Received',
                        data: [],
                        backgroundColor: 'rgba(255, 192, 0, 0.4)',
                        borderColor: 'rgba(255, 192, 0, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                elements: {
                    line: {
                        // tension: 0.4
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 0,
                    },
                },
            },
        });

        return () => {
            chartInstance.current.destroy();
        };
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            const chart = chartInstance.current;
            const now = new Date().toLocaleTimeString();

            if (chart.data.labels.length > maxDataPoints) {
                chart.data.labels.shift(); // Remove the oldest label
                chart.data.datasets[0].data.shift(); // Remove the oldest data point
                chart.data.datasets[1].data.shift(); // Remove the oldest data point
            }
        if (data !== null) {
            console.log(data);
            chart.data.labels.push(now);
            chart.data.datasets[0].data.push(data.bytesSent/1000000);
            chart.data.datasets[1].data.push(data.bytesRecv/1000000);

            chart.options.scales.y.max = Math.max(chart.data.datasets[1].data, chart.data.datasets[0].data);
            chart.update();
        }

        }
    }, [data]);

    return <canvas ref={chartRef}/>;
}
