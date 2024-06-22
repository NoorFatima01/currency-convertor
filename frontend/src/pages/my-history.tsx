import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import HistoryTable from "../components/history-table";
import { formatDate, FirestoreTimestamp } from "../utils/utils";

export type HistoryItem = {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  date: FirestoreTimestamp;
  rate: number;
  userId: string;
};

const HistoryPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/exchange/history/${uid}`
        );
        const data = response.data.history;
        setHistory(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [uid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const rows = history.map((item: HistoryItem, index) => {
    return {
      id: index + 1,
      from: item.from,
      to: item.to,
      amount: item.amount,
      convertedAmount: item.convertedAmount,
      date: formatDate(item.date),
    };
  });

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold text-darkishBlue mt-8">My History</h1>
      <div className="mt-4">
        {history.length === 0 ? (
          <div>No history available</div>
        ) : (
          <HistoryTable rows={rows} />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;