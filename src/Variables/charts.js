const dashboard24HoursPerformanceChart = {
  data: (canvas) => {
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      datasets: [
        {
          borderColor: "#6bd098",
          backgroundColor: "#6bd098",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          data: [310, 320, 330, 340, 350, 360, 370, 380, 390, 400], // Updated data
        },
        {
          borderColor: "#f17e5d",
          backgroundColor: "#f17e5d",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          data: [330, 345, 360, 375, 390, 400, 420, 430, 440, 450], // Updated data
        },
        {
          borderColor: "#fcc468",
          backgroundColor: "#fcc468",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          data: [380, 390, 400, 410, 420, 440, 450, 460, 470, 480], // Updated data
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true }, // Changed to display legend
      tooltip: { enabled: true }, // Enabled tooltip
    },
    scales: {
      y: {
        ticks: {
          color: "#9f9f9f",
          beginAtZero: false,
          maxTicksLimit: 6, // Increased limit
        },
        grid: {
          drawBorder: true, // Border drawn
          display: true, // Enabled grid display
        },
      },
      x: {
        barPercentage: 1.4, // Adjusted bar percentage
        grid: {
          drawBorder: true, // Border drawn
          display: true, // Enabled grid display
        },
        ticks: {
          padding: 10, // Adjusted padding
          color: "#9f9f9f",
        },
      },
    },
  },
};

const dashboardEmailStatisticsChart = {
  data: (canvas) => {
    return {
      labels: [1, 2, 3, 4], // Added another label
      datasets: [
        {
          label: "Emails",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            "#e3e3e3",
            "#4acccd",
            "#fcc468",
            "#ef8157",
            "#51CACF",
          ], // Added new color
          borderWidth: 0,
          data: [342, 480, 530, 600, 120], // Added new value
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true }, // Display the legend
      tooltip: { enabled: true }, // Enabled tooltip
    },
    maintainAspectRatio: false,
    pieceLabel: {
      render: "percentage",
      fontColor: ["white"],
      precision: 2,
    },
    scales: {
      y: {
        ticks: {
          display: true, // Display Y ticks
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        barPercentage: 1.6,
        grid: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: true, // Display X ticks
        },
      },
    },
  },
};

const dashboardNASDAQChart = {
  data: (canvas) => {
    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          data: [10, 19, 25, 30, 45, 50, 55, 60, 40, 50, 65, 75], // Updated data
          fill: false,
          borderColor: "#fbc658",
          backgroundColor: "transparent",
          pointBorderColor: "#fbc658",
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
          tension: 0.4,
        },
        {
          data: [0, 10, 20, 30, 40, 45, 50, 55, 60, 70, 80, 90], // Updated data
          fill: false,
          borderColor: "#51CACF",
          backgroundColor: "transparent",
          pointBorderColor: "#51CACF",
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
          tension: 0.4,
        },
      ],
    };
  },
  options: {
    plugins: {
      legend: { display: true }, // Display the legend
    },
  },
};

export {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
};
