import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, Spinner } from "react-bootstrap";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StatisticheAppuntamenti = ({ token }) => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;  
  const [statistiche, setStatistiche] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistiche = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/appuntamenti/statistiche`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Errore nel recupero delle statistiche");
        const data = await response.json();
        setStatistiche(data);
      } catch (err) {
        console.error("Errore:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStatistiche();
    }
  }, [token]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!statistiche) {
    return <p>Statistiche non disponibili</p>;
  }

  const labels = Object.keys(statistiche);
  const values = Object.values(statistiche);

  const data = {
    labels,
    datasets: [
      {
        label: "Numero Appuntamenti",
        data: values,
        backgroundColor: "#0d6efd",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card className="p-3 shadow-sm mb-4">
      <h5>Appuntamenti prossimi 7 giorni</h5>
      <Bar data={data} options={options} />
    </Card>
  );
};

export default StatisticheAppuntamenti;
