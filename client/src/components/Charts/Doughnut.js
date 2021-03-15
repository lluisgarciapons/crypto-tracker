import React from 'react';
import { Doughnut } from '@reactchartjs/react-chart.js';

const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
        {
            label: 'BTC quantity',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

const DoughnutChart = (props) => {
    data.labels = props.info.map(item => item.symbol);
    data.datasets[0].data = props.info.map(item => (item.quantity * item.btcPrice).toFixed(8));
    console.log(data);
    return (
        <>
            <Doughnut data={data} />
        </>
    );
};

export default DoughnutChart;