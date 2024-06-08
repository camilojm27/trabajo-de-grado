// @ts-nocheck
import {useEffect, useRef} from "react";
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);
// @ts-ignore
export default function RamUsage({data}) {
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
                        label: 'RAM',
                        data: [],
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        fill: false,
                        label: 'SWAP',
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
                        max: Math.ceil(data.mem_total/1000000) ,
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
            chart.data.labels.push(now);
            chart.data.datasets[0].data.push((data.mem_total - data.mem_available)/1000000);
            chart.data.datasets[1].data.push((data.swap_total - data.swap_free)/1000000);

            chart.update();
        }
    }, [data]);

    return <canvas ref={chartRef}/>;
}
