import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalDocs, setTotalDocs] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = parseInt(params.get('page') || '1') - 1;
    setPage(pageParam);
  }, [location.search]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/exchange/history/${uid}`,
          { params: { page, pageSize } }
        );
        const { history, totalDocs } = response.data;
        setHistory(history);
        setTotalDocs(totalDocs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [uid, page, pageSize]);

  useEffect(() => {
    navigate(`/my-history?page=${page + 1}`);
  }, [page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const rows = history.map((item: HistoryItem, index) => {
    return {
      id: index + 1 + page * pageSize,
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-4">
          {history.length === 0 ? (
            <div>No history available</div>
          ) : (
            <HistoryTable
              rows={rows}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              rowCount={totalDocs}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
